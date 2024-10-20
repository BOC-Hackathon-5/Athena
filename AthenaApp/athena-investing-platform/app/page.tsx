// app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Account, Stock } from '../types/Account';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [sp500Data, setSP500Data] = useState<number[]>([]);
  const [sp500Labels, setSP500Labels] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState<boolean>(!localStorage.getItem('quizCompleted'));
  const [userLevel, setUserLevel] = useState<string | null>(null);

  useEffect(() => {
    // Fetch account details from your backend API
    axios.get('/api/account')
      .then(response => {
        setAccount(response.data);
      })
      .catch(error => {
        console.error('Error fetching account data:', error);
      });

    // Fetch live S&P 500 data (mock example - replace with real API)
    axios.get('/api/sp500')
      .then(response => {
        const data = response.data;
        setSP500Data(data.prices);
        setSP500Labels(data.labels);
      })
      .catch(error => {
        console.error('Error fetching S&P 500 data:', error);
      });

    // Fetch user's stocks from backend API
    axios.get('/api/stocks')
      .then(response => {
        setStocks(response.data);
      })
      .catch(error => {
        console.error('Error fetching stocks data:', error);
      });

    // Fetch balance from Python backend

  }, []);

  const handleQuizCompletion = (level: string) => {
    setUserLevel(level);
    setShowQuiz(false);
    localStorage.setItem('quizCompleted', 'true'); // Set the quiz completion flag
  };

  const handleContinue = () => {
    setUserLevel(null);
    setShowQuiz(false); // Ensure this is set to false so it doesn't show the quiz again
  };

  const sp500ChartData = {
    labels: sp500Labels,
    datasets: [
      {
        label: 'S&P 500',
        data: sp500Data,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4,
      },
    ],
  };

  if (showQuiz) {
    return (
      <QuizComponent onComplete={handleQuizCompletion} />
    );
  }

  if (userLevel && !showQuiz) {
    return (
      <div style={styles.resultsContainer}>
        <h2 style={styles.resultsTitle}>Your Level: {userLevel}</h2>
        <button style={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ATHENA INVESTMENT</h1>
      
      {/* Greeting */}
      <div style={styles.greetingContainer}>
        <p style={styles.greetingText}>Good Afternoon, ANDREAS</p>
      </div>

      {/* Balance Display */}
      <div style={styles.balanceContainer}>
        {account ? (
          <p style={styles.balanceText}>
            <span style={styles.balanceLabel}>BALANCE</span>: €{account.balance.toFixed(2)}
          </p>
        ) : (
          <p style={styles.loadingText}>Loading balance...</p>
        )}
      </div>

      <div style={styles.chartContainer}>
        <Line data={sp500ChartData} />
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.actionButton}>Buy</button>
        <button style={styles.actionButton}>Sell</button>
      </div>

      <div style={styles.stocksContainer}>
        <h2 style={styles.stocksTitle}>Your Stocks</h2>
        {stocks.length > 0 ? (
          <ul style={styles.stockList}>
            {stocks.map((stock, index) => (
              <li key={index} style={styles.stockItem}>
                <div style={styles.stockBox}>
                  <p style={styles.stockText}><strong>{stock.name}</strong></p>
                  <p style={styles.stockText}>Quantity: {stock.quantity}</p>
                  <p style={styles.stockText}>Total: €{stock.totalValue}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.loadingText}>No stocks owned.</p>
        )}
      </div>

      {/* Bottom Navigation with Buttons */}
      <div style={styles.bottomButtons}>
        <Link href="/portfolio" passHref>
          <button style={styles.navButton}>Portfolio</button>
        </Link>
        <Link href="/athena-chat" passHref>
          <button style={styles.navButton}>Athena Chat</button>
        </Link>
        <Link href="/education" passHref>
          <button style={styles.navButton}>Education</button>
        </Link>
      </div>
    </div>
  );
};


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100vh',
    padding: '10px 20px',
    backgroundColor: '#f4f4f9',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundImage: 'linear-gradient(to bottom right, #ffffff, #d4e4fc)',
  },
  title: {
    fontSize: '2em',
    fontWeight: 'bold' as const,
    color: '#5468ff',
    backgroundImage: 'linear-gradient(to right, #5adaff, #5468ff)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textAlign: 'center' as const,
    letterSpacing: '1px',
    textShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
  },
  greetingContainer: {
    width: '80%',
    textAlign: 'center' as const,
    margin: '10px 0',
  },
  greetingText: {
    fontSize: '1.4em',
    fontWeight: 'bold' as const,
    color: '#0056b3',
    textShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
  },
  balanceContainer: {
    width: '80%',
    textAlign: 'center' as const,
    padding: '10px',
    margin: '10px 0',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 123, 255, 0.2)',
  },
  balanceText: {
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
    color: '#0056b3',
  },
  balanceLabel: {
    fontSize: '1em',
    fontWeight: 'bold' as const,
    color: '#5468ff',
    backgroundImage: 'linear-gradient(to right, #5adaff, #5468ff)',
    WebkitBackgroundClip: 'text',
  },
  chartContainer: {
    width: '100%',
    maxWidth: '450px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    margin: '10px 0',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    padding: '10px 0',
  },
  actionButton: {
    padding: '8px 15px',
    fontSize: '0.9em',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #00c851 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: '1',
    margin: '0 5px',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
    transition: 'box-shadow .15s, transform .15s',
  },
  stocksContainer: {
    width: '100%',
    maxWidth: '450px',
    height: '250px',
    overflowY: 'auto' as const,
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    margin: '15px 0',
    textAlign: 'center' as const,
  },
  stocksTitle: {
    fontSize: '1.4em',
    fontWeight: 'bold' as const,
    color: '#333',
    letterSpacing: '1px',
    textShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    marginBottom: '10px',
  },
  stockList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  stockItem: {
    margin: '8px 0',
    width: '100%', // Ensure full width usage
  },
  stockBox: {
    width: '100%', // Use full width of the container
    padding: '10px',
    backgroundColor: '#f8f9fa', // Light grey background for a subtle effect
    borderRadius: '8px',
    border: '1px solid #d1e9ff', // Light blue border for a cleaner look
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '0.9em',
    color: '#333',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'scale(1.03)', // Slight scale on hover
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // Deeper shadow on hover
    },
  },  
  stockText: {
    margin: '4px 0',
    fontWeight: 'bold' as const, // Bold text for emphasis
    fontSize: '1em', // Slightly increase the font size
    color: '#007bff', // Change to a distinct blue color for visibility
  },
  bottomButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px 0',
    borderTop: '1px solid #ddd',
  },
  navButton: {
    padding: '10px 15px',
    fontSize: '1em',
    fontWeight: 'bold' as const,
    color: '#0056b3',
    backgroundColor: '#eaf1ff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.2)',
    transition: 'box-shadow .3s, transform .3s',
    ':hover': {
      boxShadow: '0px 6px 15px rgba(0, 123, 255, 0.4)', // Interactive shadow on hover
      transform: 'scale(1.05)',
    },
  },
  loadingText: {
    fontSize: '1em',
    color: '#666',
  },
  quizContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    backgroundImage: 'linear-gradient(to bottom right, #ffffff, #d4e4fc)',
    maxWidth: '480px',
    margin: '0 auto',
  },
  quizQuestion: {
    fontSize: '1.2em',
    color: '#333',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  quizButton: {
    padding: '10px 20px',
    fontSize: '1em',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'box-shadow .15s, transform .15s',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '10px 20px',
    backgroundColor: '#f4f4f9',
    width: '100%',
    maxWidth: '480px', // Same as home page dimensions for consistency
    margin: '0 auto',
    backgroundImage: 'linear-gradient(to bottom right, #ffffff, #d4e4fc)',
  },
  resultsTitle: {
    fontSize: '1.5em',
    fontWeight: 'bold' as const,
    color: '#0056b3',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  continueButton: {
    padding: '10px 20px',
    fontSize: '1em',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
    transition: 'box-shadow .15s, transform .15s',
    marginTop: '20px',
  },
};

export default Home;
