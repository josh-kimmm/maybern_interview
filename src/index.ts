import { getTransactions, seedTransactionsDB } from '@/db/transactions';
import { seedCommitmentsDB } from '@/db/commitments';
import { getWaterfalls, startWaterfallCalculation } from '@/db/waterfall';
import fs from 'fs';
import { __dirname, __filename } from '@/constants';
import path from 'path';

const startScript = async () => {
  await seedCommitmentsDB();
  await seedTransactionsDB();

  const distributions = getTransactions().filter(
    (t) => t.contribution_or_distribution === 'distribution'
  );

  distributions.forEach((distr) => {
    startWaterfallCalculation(distr);
  });

  const waterfallsOutput = JSON.stringify(getWaterfalls());
  console.log(path.join(__dirname, './output.json'));
  fs.writeFileSync(path.join(__dirname, './output.json'), waterfallsOutput);

  return;
};

startScript().then(() => {
  console.log('Ending program now');
  process.exit(0);
});
