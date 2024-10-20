// /pages/api/stocks.ts

import { NextApiRequest, NextApiResponse } from 'next';

const stocks = [
  {
    name: 'Apple Inc (AAPL)',
    quantity: 5,
    totalValue: 300, // Approximate price for 5 shares
  },
  {
    name: 'Tesla Inc (TSLA)',
    quantity: 2,
    totalValue: 200, // Approximate price for 2 shares
  },
  {
    name: 'Amazon.com Inc (AMZN)',
    quantity: 1,
    totalValue: 70, // Approximate price for 1 share
  },
  {
    name: 'Alphabet Inc (GOOGL)',
    quantity: 1,
    totalValue: 30, // Approximate price for 1 share
  },
  {
    name: 'Microsoft Corp (MSFT)',
    quantity: 3,
    totalValue: 200, // Approximate price for 3 shares
  },
  // Adding some other stocks to make a total of 5000
  {
    name: 'NVIDIA Corp (NVDA)',
    quantity: 1,
    totalValue: 100, // Approximate price for 1 share
  },
  {
    name: 'Meta Platforms Inc (META)',
    quantity: 2,
    totalValue: 50, // Approximate price for 2 shares
  },
  {
    name: 'Berkshire Hathaway (BRK.B)',
    quantity: 1,
    totalValue: 50, // Approximate price for 1 share
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(stocks);
}
