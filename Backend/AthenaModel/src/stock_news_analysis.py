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

    # Add percentage for better analysis
    avg_sentiment['negative_pct'] = (avg_sentiment['negative'] / 1) * 100
    avg_sentiment['positive_pct'] = (avg_sentiment['positive'] / 1) * 100

    return avg_sentiment

def determine_recommendation(avg_sentiment, stock_symbol):
    if avg_sentiment['compound'] > 0:
        return (
            f"Recommendation for {stock_symbol}: Buy\n"
            f"Positive Sentiment: {avg_sentiment['positive_pct']:.2f}%\n"
            f"Negative Sentiment: {avg_sentiment['negative_pct']:.2f}%"
        )
    else:
        return (
            f"Recommendation for {stock_symbol}: Do not Buy\n"
            f"Positive Sentiment: {avg_sentiment['positive_pct']:.2f}%\n"
            f"Negative Sentiment: {avg_sentiment['negative_pct']:.2f}%"
        )

def get_news_sentiment(stock_symbol: str) -> str:
    logging.info(f"Fetching news articles for {stock_symbol}...")
    articles = get_stock_news(NEWS_API_KEY, stock_symbol)

    if not articles:
        return f"No articles found for {stock_symbol}."

    logging.info(f"Performing sentiment analysis on {len(articles)} articles...")
    sentiment_scores = analyze_sentiment(articles)

    avg_sentiment = summarize_sentiment(sentiment_scores)

    # Pass the stock symbol to ensure clarity in the recommendation output
    return determine_recommendation(avg_sentiment, stock_symbol)

def extract_stock_symbols(user_message: str):
    return re.findall(r"\((.*?)\)", user_message)

def get_openai_response(user_message: str) -> str:
    try:
        if "Use the news analysis tool and the stock symbol" in user_message:
            stock_symbols = extract_stock_symbols(user_message)
            if not stock_symbols:
                return "Could not find any valid stock symbols in the input."

            responses = []
            for symbol in stock_symbols:
                symbol = symbol.strip().upper()
                responses.append(get_news_sentiment(symbol))

            return "\n\n".join(responses)
        else:
            completion = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ]
            )
            return completion.choices[0].message.content
    except Exception as e:
        logging.error(f"Failed to communicate with OpenAI or News API: {e}")
        return "An error occurred. Please try again later."