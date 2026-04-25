export type Address = `0x${string}`;
export type Pool = {
  stTokenAddress: Address;
  poolWeight: bigint;
  lastRewardBlock: bigint;
  accMetaNodePerST: bigint;
  stTokenAmount: bigint;
  minDepositAmount: bigint;
  unstakeLockedBlocks: bigint;
};
