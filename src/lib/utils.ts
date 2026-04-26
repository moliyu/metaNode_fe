import { formatEther } from 'viem';

export const fmt = (value: bigint | undefined) => {
  return parseFloat(formatEther(value ?? BigInt(0))).toFixed(4);
};
