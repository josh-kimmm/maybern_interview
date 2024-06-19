import fs from 'fs';
import csvParser from 'neat-csv';
import path from 'path';
import { __dirname } from '@/constants';

import { ICommitments } from 'types/db';

const COMMITMENTS: Array<ICommitments> = [];

const seedCommitmentsDB = async (): Promise<Array<ICommitments>> => {
  const commitmentsStream = fs.createReadStream(
    path.join(__dirname, './commitments.csv')
  );

  const commitmentsData = await csvParser(commitmentsStream);

  commitmentsData.forEach((c) => {
    const newCommitment = {
      entity_name: c.entity_name,
      id: c.id,
      commitment_amount: parseInt(c.commitment_amount),
    };
    COMMITMENTS.push(newCommitment);
  });

  return COMMITMENTS;
};

const getCommitment = (id: string): ICommitments | undefined => {
  return COMMITMENTS.find((commitment) => commitment.id === id);
};

const createCommitment = ({
  entity_name,
  id,
  commitment_amount,
}: ICommitments): ICommitments => {
  const commitment: ICommitments = {
    id,
    entity_name,
    commitment_amount,
  };

  COMMITMENTS.push(commitment);

  return commitment;
};

export { getCommitment, seedCommitmentsDB, createCommitment };
