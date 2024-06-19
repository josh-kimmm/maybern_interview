import dayjs from 'dayjs';
import { getCommitment } from '@/db/commitments';
import { getTransaction, getTransactions } from '@/db/transactions';
import { roundToMoney } from '@/utils/math';
import {
  ITransaction,
  IWaterfall_FinalSplit_Step,
  IWaterfall_GP_Steps,
  IWaterfall_LP_Steps,
  IWaterfalls,
  IWaterfallsData,
} from 'types/db';

const COMMITMENT_ID_PREFIX = 'cid_';

// Mock DB
const WATERFALLS: IWaterfalls = {};

const startWaterfallCalculation = (
  distribution: ITransaction
): IWaterfallsData => {
  try {
    const commitment_id = distribution.commitment_id;
    const distr_date = distribution.transaction_date;
    const commitment = getCommitment(commitment_id);

    if (!commitment)
      throw new Error(`Commitment id: ${commitment_id} not found!`);

    if (!WATERFALLS[`${COMMITMENT_ID_PREFIX}${commitment_id}`]) {
      WATERFALLS[`${COMMITMENT_ID_PREFIX}${commitment_id}`] = {
        id: commitment.id,
        entity_name: commitment.entity_name,
        total_commitment_amount: commitment.commitment_amount,
        waterfall: {},
      };
    }
    const currWaterfallsData =
      WATERFALLS[`${COMMITMENT_ID_PREFIX}${commitment_id}`];
    const waterfallCalculation = currWaterfallsData.waterfall;
    const previousDistributions = Object.keys(waterfallCalculation).reduce(
      (acc, curr) => (acc += waterfallCalculation[curr].distribution_amount),
      0
    );
    const starting_capital =
      previousDistributions + distribution.transaction_amount;

    waterfallCalculation[distr_date] = {
      starting_capital,
      distribution_amount: distribution.transaction_amount,
      return_of_capital: {
        LP_allocation: null,
        remaining_capital: null,
      },
      preferred_return: {
        LP_allocation: null,
        remaining_capital: null,
      },
      catch_up: {
        GP_allocation: null,
        remaining_capital: null,
      },
      final_split: {
        LP_allocation: null,
        GP_allocation: null,
        total_distribution: null,
        remaining_capital: null,
      },
    };
    const transaction = getTransaction(commitment_id, distr_date);
    if (!transaction) {
      throw new Error(
        `Unable to find transaction with commitment id ${commitment_id} and date ${distr_date}`
      );
    }
    const currentDistribution = {
      ...transaction,
      transaction_amount: starting_capital,
    };
    const commitDateCalc = waterfallCalculation[distr_date];

    commitDateCalc.return_of_capital = returnOfCapital(currentDistribution);
    commitDateCalc.preferred_return = preferredReturn(
      currentDistribution,
      commitDateCalc.return_of_capital.remaining_capital || 0
    );
    commitDateCalc.catch_up = catchUp(
      commitDateCalc.preferred_return.remaining_capital || 0
    );
    commitDateCalc.final_split = finalSplit(
      commitDateCalc.catch_up.remaining_capital || 0
    );

    return currWaterfallsData;
  } catch (error) {
    console.error(`Error in startWaterfallCalculation: `, error);
    throw error;
  }
};

const returnOfCapital = (transaction: ITransaction): IWaterfall_LP_Steps => {
  try {
    const commitment = getCommitment(transaction.commitment_id);
    if (!commitment)
      throw new Error(`Unable to find commit id ${transaction.commitment_id}`);

    const distr_amount = transaction.transaction_amount;
    const ROC = Math.min(commitment.commitment_amount, distr_amount);

    return {
      LP_allocation: ROC,
      remaining_capital: distr_amount - ROC < 0 ? 0 : distr_amount - ROC,
    };
  } catch (error) {
    console.error(`Error in returnOfCapital: `, error);
    throw error;
  }
};

const preferredReturn = (
  transaction: ITransaction,
  current_capital: number
): IWaterfall_LP_Steps => {
  try {
    if (current_capital === 0)
      return {
        LP_allocation: 0,
        remaining_capital: 0,
      };

    const MILLISECONDS_IN_DAY = 86400000;
    const DAYS_IN_YEAR = 365;
    const PREFERRED_RATE = 0.08; // 8% by prompt
    const transactions = getTransactions(transaction.commitment_id);
    const contributions = transactions.filter(
      (t) => t.contribution_or_distribution === 'contribution'
    );

    // assuming all contributions are done before distribution calculation
    const preferredReturns = contributions
      .map((contribution) => {
        const contributionDate = dayjs(contribution.transaction_date);
        const distributionDate = dayjs(transaction.transaction_date);

        // this number should be negative
        const contributionAmount = contribution.transaction_amount;

        const exponent =
          Math.ceil(
            distributionDate.diff(contributionDate) / MILLISECONDS_IN_DAY
          ) / DAYS_IN_YEAR;

        // cashflow is going to be based off each contribution amount and NOT the starting_capital
        // of the entire waterfall calculation. I could be wrong here?
        const cashFlow = Math.abs(contributionAmount);
        const _1_plus_R = Math.pow(1 + PREFERRED_RATE, exponent);

        // subtract the contribution amount to get the actual PR value
        return cashFlow * _1_plus_R + contributionAmount;
      })
      .reduce((acc, curr) => (acc += curr), 0);

    return {
      LP_allocation: preferredReturns,
      remaining_capital: current_capital - preferredReturns,
    };
  } catch (error) {
    console.error(`Error in preferredReturn: `, error);
    throw error;
  }
};

// not even going to try-catch these, typescript should fix these runtime errors
const catchUp = (current_capital: number): IWaterfall_GP_Steps => {
  // for this exercise we're assuming 80/20 split. Hacky way to calculate this?
  const GP_allocation = current_capital * 0.25;
  return {
    GP_allocation,
    remaining_capital: current_capital - GP_allocation,
  };
};

const finalSplit = (current_capital: number): IWaterfall_FinalSplit_Step => {
  // LP gets 80%
  const LP_allocation = current_capital * 0.8;

  // GP gets 20%
  const GP_allocation = current_capital * 0.2;
  const total_distribution = LP_allocation + GP_allocation;

  return {
    LP_allocation,
    GP_allocation,
    total_distribution,
    remaining_capital:
      roundToMoney(current_capital) - roundToMoney(total_distribution),
  };
};

const getWaterfalls = () => {
  return WATERFALLS;
};

export { startWaterfallCalculation, getWaterfalls };
