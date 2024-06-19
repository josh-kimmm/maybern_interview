import { createCommitment, seedCommitmentsDB } from '@/db/commitments';
import { createTransaction, seedTransactionsDB } from '@/db/transactions';
import { startWaterfallCalculation } from '@/db/waterfall';
import { transactions_test_data1 } from '../data/transactions';
import { commitments_test_data1 } from '../data/commitments';

beforeAll(async () => {
  await seedCommitmentsDB();
  await seedTransactionsDB();
});

describe('Tests from example in prompt', () => {
  test('Simple test from example', async () => {
    commitments_test_data1.forEach((c) => createCommitment(c));
    transactions_test_data1.forEach((t) => createTransaction(t));

    const waterfall = startWaterfallCalculation(transactions_test_data1[1]);

    expect(waterfall.total_commitment_amount).toBe(1000);

    const distribution = waterfall.waterfall['01/01/2020'];
    expect(distribution.starting_capital).toBe(2000);
    expect(distribution.return_of_capital.LP_allocation).toBe(1000);
    expect(distribution.preferred_return.LP_allocation).toBe(80);
    expect(distribution.catch_up.GP_allocation).toBe(230);
    expect(distribution.final_split.GP_allocation).toBe(138);
    expect(distribution.final_split.LP_allocation).toBe(552);
  });

  test.skip('2 contributions with 1 distribution', async () => {});
  test.skip('3 contributions w/ 3 distributions', async () => {});
  test.skip('1st distribution is less than starting capital', async () => {});
});
