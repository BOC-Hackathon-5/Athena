import type { NextApiRequest, NextApiResponse } from 'next';
import { Account } from '../../types/Account';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Account>
) {
  const account: Account = {
    name: 'John Doe',
    balance: 1000,
    currency: 'EUR',
  };

  res.status(200).json(account);
}