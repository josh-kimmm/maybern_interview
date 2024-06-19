import fs from 'fs';
import csvParser, { Row } from 'neat-csv';
import path from 'path';
import { __dirname } from '@/constants';

import { FormattedDate, ITransaction } from 'types/db';

const TRANSACTIONS: Array<ITransaction> = [];

const seedTransactionsDB = async (): Promise<Array<ITransaction>> => {
  const transactionsStream = fs.createReadStream(
    path.join(__dirname, './transactions.csv')
  );

  const transactionsData = await csvParser(transactionsStream);

  transactionsData.forEach((t) => {
    const newTransaction = {
      transaction_date: t.transaction_date as FormattedDate,
      transaction_amount: parseInt(t.transaction_amount),
      contribution_or_distribution: t.contribution_or_distribution,
      commitment_id: t.commitment_id,
    };
    TRANSACTIONS.push(newTransaction);
  });

  return TRANSACTIONS;
};

const getTransaction = (
  commitment_id: string,
  date: FormattedDate
): ITransaction | undefined => {
  return TRANSACTIONS.find((transaction) => {
    return (
      transaction.commitment_id === commitment_id &&
      transaction.transaction_date === date
    );
  });
};

const getTransactions = (commitment_id?: string): Array<ITransaction> => {
  if (!commitment_id) return TRANSACTIONS;

  return TRANSACTIONS.filter((t) => t.commitment_id === commitment_id);
};

const createTransaction = ({
  commitment_id,
  transaction_date,
  transaction_amount,
  contribution_or_distribution,
}: ITransaction): ITransaction => {
  const transaction: ITransaction = {
    commitment_id,
    transaction_date,
    transaction_amount,
    contribution_or_distribution,
  };

  TRANSACTIONS.push(transaction);

  return transaction;
};

export {
  seedTransactionsDB,
  getTransaction,
  getTransactions,
  createTransaction,
};
