"use client";

import React, { useState, useEffect } from 'react';
import { Stock } from '../types/Account';
import axios from 'axios';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
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

const Portfolio: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  useEffect(() => {
    // Fetch user's stocks from backend API
    axios.get('/api/stocks')
      .then(response => {
        setStocks(response.data);
      })
      .catch(error => {
        console.error('Error fetching stocks data:', error);
      });
  }, []);

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const renderStockDetails = () => {
    if (!selectedStock) return null;

    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example labels
      datasets: [
        {
          label: selectedStock.name,
          data: [selectedStock.totalValue * 0.8, selectedStock.totalValue * 0.85, selectedStock.totalValue, selectedStock.totalValue * 1.1, selectedStock.totalValue * 0.95, selectedStock.totalValue * 1.05], // Example data
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          tension: 0.4,
        },
      ],
    };

    return (
      <div style={styles.detailsContainer}>
        <h2 style={styles.detailsTitle}>{selectedStock.name} Overview</h2>
        <Line data={data} />
        <p style={styles.detailsText}>
          Current Value: ${selectedStock.totalValue.toFixed(2)}
        </p>
        <p style={styles.detailsText}>
          Quantity Owned: {selectedStock.quantity}
        </p>
        <button style={styles.manageButton}>Manage Stock</button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Portfolio</h1>
      <div style={styles.stocksContainer}>
        {stocks.length > 0 ? (
          <ul style={styles.stockList}>
            {stocks.map((stock, index) => (
              <li
                key={index}
                style={styles.stockItem}
                onClick={() => handleStockClick(stock)}
              >
                <div style={styles.stockBox}>
                  <p style={styles.stockText}><strong>{stock.name}</strong></p>
                  <p style={styles.stockText}>Quantity: {stock.quantity}</p>
                  <p style={styles.stockText}>Total: ${stock.totalValue}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.loadingText}>No stocks owned.</p>
        )}
      </div>

      {renderStockDetails()}

      <div style={styles.bottomButtons}>
        <Link href="/" passHref>
          <button style={styles.navButton}>Back</button>
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
  stockList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  stockItem: {
    margin: '8px 0',
    width: '100%',
    cursor: 'pointer',
  },
  stockBox: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #d1e9ff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '0.9em',
    color: '#333',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'scale(1.03)',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    }
  },
  stockText: {
    margin: '4px 0',
    fontWeight: 'bold' as const,
    fontSize: '1em',
    color: '#007bff',
  },
  detailsContainer: {
    width: '100%',
    maxWidth: '450px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
    margin: '15px 0',
    textAlign: 'center' as const,
  },
  detailsTitle: {
    fontSize: '1.5em',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '15px',
  },
  detailsText: {
    fontSize: '1em',
    color: '#555',
    margin: '8px 0',
  },
  manageButton: {
    padding: '10px 20px',
    fontSize: '1em',
    fontWeight: 'bold' as const,
    color: '#fff',
    backgroundImage: 'radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'box-shadow .15s, transform .15s',
    boxShadow: 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset',
    marginTop: '20px',
  },
  bottomButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 0',
  },
  navButton: {
    padding: '12px 15px',
    fontSize: '0.9em',
    fontWeight: 'bold' as const,
    color: '#007bff',
    backgroundColor: '#eaf1ff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    flex: '1',
    margin: '0 5px',
    boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.2)',
    transition: 'box-shadow .3s, transform .3s',
    ':hover': {
      boxShadow: '0px 6px 15px rgba(0, 123, 255, 0.4)',
      transform: 'scale(1.05)',
    },
  },
  loadingText: {
    fontSize: '1em',
    color: '#666',
  },
};

export default Portfolio;

