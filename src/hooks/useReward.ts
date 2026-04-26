import { StakeNodeAbi } from '@/abi/stakeNode';
import { useContract } from './useContract';
import { env, PID } from '@/lib/config';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { parseEther } from 'viem';

type User = {
  stAmount: bigint;
  finishedMetaNode: bigint;
  pendingMetaNode: BigInt;
};

type UserStake = {
  staked: bigint;
  withdrawPending: bigint;
  withdrawable: bigint;
};

export const useReward = () => {
  const { address } = useAccount();
  const { useRead, useWrite } = useContract(StakeNodeAbi, env.stakeAddress);
  const { data: userData } = useRead('user', [PID, address!]);
  const { data: stakeData } = useRead('stakingBalance', [PID, address!]);
  const { data: withdrawData } = useRead('withDrawAmount', [PID, address!]);

  const useWithDraw = () => {
    const { isConfirmed, isConfirming, isPending, write } = useWrite();

    const handleWithdraw = () => {
      write('withdraw', [PID]);
    };

    return {
      isLoading: isPending || isConfirming,
      handleWithdraw,
      isConfirmed,
    };
  };

  const useUnstake = () => {
    const { isConfirmed, isConfirming, isPending, write } = useWrite();
    const handleUnstake = (value: string) => {
      if (!value) {
        return;
      }
      write('unstake', [PID, parseEther(value)]);
    };
    return {
      isLoading: isPending || isConfirming,
      handleUnstake,
      isConfirmed,
    };
  };

  const user = useMemo<User>(() => {
    const [stAmount, finishedMetaNode, pendingMetaNode] = userData || [0n, 0n, 0n];
    return {
      stAmount,
      finishedMetaNode,
      pendingMetaNode,
    };
  }, [userData]);

  const userStake = useMemo<UserStake>(() => {
    const [requestAmount, pendingWithdrawAmount] = withdrawData || [0n, 0n];
    return {
      staked: stakeData || 0n,
      withdrawable: pendingWithdrawAmount,
      withdrawPending: requestAmount - pendingWithdrawAmount,
    };
  }, [withdrawData, stakeData]);

  return {
    user,
    userStake,
    useWithDraw,
    useUnstake,
  };
};
