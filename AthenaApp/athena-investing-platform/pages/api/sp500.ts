// pages/api/sp500.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type SP500Response = {
  prices: number[];
  labels: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SP500Response>
) {
  // Mock data for S&P 500 chart
  const data = {
    labels: [
      '2020-01-02', '2020-01-03', '2020-01-06', '2020-01-07', '2020-01-08',
      '2020-01-09', '2020-01-10', '2020-01-13', '2020-01-14', '2020-01-15',
      '2020-01-16', '2020-01-17', '2020-01-21', '2020-01-22', '2020-01-23',
      '2020-01-24', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30',
      '2020-01-31', '2020-02-03', '2020-02-04', '2020-02-05', '2020-02-06'
    ],
    prices: [
      3257.85, 3234.85, 3246.28, 3237.18, 3253.05, 3274.70, 3265.35, 3288.13,
      3283.15, 3289.29, 3316.81, 3329.62, 3320.79, 3321.75, 3325.54, 3295.47,
      3243.63, 3276.24, 3273.40, 3283.66, 3225.52, 3248.92, 3297.59, 3334.69,
      3345.78
    ]
  };

  res.status(200).json(data);
}
