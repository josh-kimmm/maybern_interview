import { ITransaction } from 'types/db';

export const transactions_test_data1: Array<ITransaction> = [
  {
    commitment_id: '12345345345',
    transaction_amount: -1000,
    transaction_date: '01/01/2019',
    contribution_or_distribution: 'contribution',
  },
  {
    commitment_id: '12345345345',
    transaction_amount: 2000,
    transaction_date: '01/01/2020',
    contribution_or_distribution: 'distribution',
  },
];
export const transactions_test_data2: Array<ITransaction> = [
  {
    commitment_id: '1',
    transaction_amount: -1000,
    transaction_date: '01/01/2019',
    contribution_or_distribution: 'contribution',
  },
  {
    commitment_id: '1',
    transaction_amount: -2000,
    transaction_date: '01/01/2019',
    contribution_or_distribution: 'contribution',
  },
  {
    commitment_id: '1',
    transaction_amount: 4000,
    transaction_date: '01/01/2020',
    contribution_or_distribution: 'distribution',
  },
];
