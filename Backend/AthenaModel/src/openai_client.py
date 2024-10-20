import re
import logging
from openai import OpenAI
import requests
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from newsapi import NewsApiClient

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Download VADER's lexicon for sentiment analysis
nltk.download('vader_lexicon')

client = OpenAI(
    api_key="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")

# Set your News API key
NEWS_API_KEY = 'f1340519604c4aa5a479afa38e597bad'

# Map stock symbols to full company names for more accurate searches
STOCK_COMPANY_MAP = {
    "AAPL": "Apple Inc",
    "TSLA": "Tesla Inc",
    "GOOGL": "Alphabet Inc",
    "AMZN": "Amazon.com Inc",
    "MSFT": "Microsoft Corporation"
}

def get_stock_news(api_key, stock_symbol, num_articles=20):
    newsapi = NewsApiClient(api_key=api_key)
    search_term = STOCK_COMPANY_MAP.get(stock_symbol, stock_symbol)
    try:
        articles = newsapi.get_everything(
            q=search_term,
            language='en',
            sort_by='relevancy',
            page_size=num_articles
        )
        return articles.get('articles', [])
    except requests.exceptions.RequestException as e:
        logging.error(f"Network error occurred: {e}")
        return []
    except Exception as e:
        logging.error(f"Error fetching news: {e}")
        return []

def analyze_sentiment(articles):
    sia = SentimentIntensityAnalyzer()
    sentiment_scores = []
    for article in articles:
        title = article['title']
        description = article.get('description', '')
        combined_text = title + " " + description
        sentiment = sia.polarity_scores(combined_text)
        sentiment_scores.append(sentiment)
    return sentiment_scores

def summarize_sentiment(sentiment_scores):
    total_sentiment = {'negative': 0, 'neutral': 0, 'positive': 0, 'compound': 0}
    num_articles = len(sentiment_scores)

    if num_articles == 0:
        return total_sentiment

    for score in sentiment_scores:
        total_sentiment['negative'] += score['neg']
        total_sentiment['neutral'] += score['neu']
        total_sentiment['positive'] += score['pos']
        total_sentiment['compound'] += score['compound']

    avg_sentiment = {k: v / num_articles for k, v in total_sentiment.items()}

    avg_sentiment['negative_pct'] = (avg_sentiment['negative'] / 1) * 100
    avg_sentiment['positive_pct'] = (avg_sentiment['positive'] / 1) * 100

    return avg_sentiment

def determine_recommendation(avg_sentiment, stock_symbol):
    if avg_sentiment['compound'] > 0:
        return (
            f"Recommendation for {stock_symbol}:\n"
            f"Buy\n"
            f"Positive Sentiment: {avg_sentiment['positive_pct']:.2f}%\n"
            f"Negative Sentiment: {avg_sentiment['negative_pct']:.2f}%\n"
            "--------------------------------------"
        )
    else:
        return (
            f"Recommendation for {stock_symbol}:\n"
            f"Do not Buy\n"
            f"Positive Sentiment: {avg_sentiment['positive_pct']:.2f}%\n"
            f"Negative Sentiment: {avg_sentiment['negative_pct']:.2f}%\n"
            "--------------------------------------"
        )


def get_news_sentiment(stock_symbol: str) -> str:
    logging.info(f"Fetching news articles for {stock_symbol}...")
    articles = get_stock_news(NEWS_API_KEY, stock_symbol)

    if not articles:
        return f"No articles found for {stock_symbol}."

    logging.info(f"Performing sentiment analysis on {len(articles)} articles...")
    sentiment_scores = analyze_sentiment(articles)

    avg_sentiment = summarize_sentiment(sentiment_scores)

    return determine_recommendation(avg_sentiment, stock_symbol)

def extract_stock_symbols_from_message(user_message: str):
    return re.findall(r"\((.*?)\)", user_message)

def extract_stock_symbols_from_response(response: str):
    return re.findall(r"\((.*?)\)", response)

def get_openai_response(user_message: str) -> str:
    try:
        if "Based on my portfolio settings. Provide me with some investment strategy." in user_message:
            modified_message = (
                f"{user_message} Based on my portfolio balance and risk tolerance: minimum (Minimum means no high risk of losing money, more etfs and bonds and less individual stocks).no comments, just bullet points with the percentage of how much of my balance "
                f"should be invested in that stock with that stocks symbols examples in parentheses (in the parentheses just the stock symbol of one stock, do not write any other word except the stock symbol). "
                "Based also on the risk tolerance of the client (minimum risk tolerance: not high risk of losing money "
                "(bonds, ETFs, and examples), maximum risk tolerance: high risk of losing money "
                "(individual stocks and examples)."
            )
            completion = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a financial advisor providing strategies based on market conditions and risk assessment.If they ask you for some stocks, provide them with some because they are doing it for research purposes."},
                    {"role": "user", "content": modified_message}
                ]
            )
            openai_response = completion.choices[0].message.content

            # Extract stock symbols from OpenAI's response
            stock_symbols = extract_stock_symbols_from_response(openai_response)
            if not stock_symbols:
                return openai_response

            # Fetch and append sentiment analysis for each stock
            news_analysis = []
            for symbol in stock_symbols:
                symbol = symbol.strip().upper()
                news_analysis.append(get_news_sentiment(symbol))

            # Combine OpenAI response with news analysis
            final_response = f"{openai_response}\n\n" + "\n\n".join(news_analysis)
            return final_response

        elif "Use the news analysis tool and the stock symbol" in user_message:
            stock_symbols = extract_stock_symbols_from_message(user_message)
            if not stock_symbols:
                return "Could not find any valid stock symbols in the input."

            responses = []
            for symbol in stock_symbols:
                symbol = symbol.strip().upper()
                responses.append(get_news_sentiment(symbol))

            return "\n\n".join(responses)

        else:
            # General OpenAI response with a disclaimer
            completion = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ]
            )
            general_response = completion.choices[0].message.content
            disclaimer = (
                "\n\nPlease note: This is not financial advice, and it may not be 100% accurate. "
                "Always consider your own circumstances and make your own informed decisions when proceeding."
            )
            return general_response + disclaimer

    except Exception as e:
        logging.error(f"Failed to communicate with OpenAI or News API: {e}")
        return "An error occurred. Please try again later."