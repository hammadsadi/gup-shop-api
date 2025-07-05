import { randomUUID } from 'crypto';

export const generateTransactionId = (): string => {
  return `tran_${randomUUID()}`;
};