export type FormattedDate = `${string}/${string}/${string}`;
export type ITransaction = {
  transaction_date: FormattedDate;
  transaction_amount: number;
  contribution_or_distribution: string;
  commitment_id: string;
};

export type ICommitments = {
  entity_name: string;
  id: string;
  commitment_amount: number;
};

export type IWaterfalls = {
  [key: `cid_${string}`]: IWaterfallsData;
};

export type IWaterfallsData = {
  id: string;
  entity_name: string;
  total_commitment_amount: number;
  waterfall: IWaterfall;
};

export type IWaterfall_LP_Steps = {
  LP_allocation: number | null;
  remaining_capital: number | null;
};

export type IWaterfall_GP_Steps = {
  GP_allocation: number | null;
  remaining_capital: number | null;
};
export type IWaterfall = {
  [key: FormattedDate]: IWaterfallFormattedDate_Data;
};

export type IWaterfall_FinalSplit_Step = IWaterfall_GP_Steps &
  IWaterfall_LP_Steps & { total_distribution: number | null };

export type IWaterfallFormattedDate_Data = {
  starting_capital: number;
  distribution_amount: number;
  return_of_capital: IWaterfall_LP_Steps;
  preferred_return: IWaterfall_LP_Steps;
  catch_up: IWaterfall_GP_Steps;
  final_split: IWaterfall_FinalSplit_Step;
};
