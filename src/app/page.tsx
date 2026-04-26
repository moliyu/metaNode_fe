'use client';
import { StakeNodeAbi } from '@/abi/stakeNode';
import { useContract } from '@/hooks/useContract';
import { useReward } from '@/hooks/useReward';
import { env, PID } from '@/lib/config';
import { Button, Card, CardContent, TextField } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { fmt } from '@/lib/utils';

const Home = () => {
  const client = useQueryClient();
  const { address, isConnected } = useAccount();
  const { data: balance, queryKey: balanceQueryKey } = useBalance({ address });
  const [amount, setAmount] = useState('');

  const { useRead, useWrite } = useContract(StakeNodeAbi, env.stakeAddress);
  const { data: poolData, queryKey: poolQueryKey } = useRead('pool', [PID]);
  const pool = useMemo(() => {
    if (!poolData) return undefined;
    const [
      stTokenAddress,
      poolWeight,
      lastRewardBlock,
      accMetaNodePerST,
      stTokenAmount,
      minDepositAmount,
      unstakeLockedBlocks,
    ] = poolData;
    return {
      stTokenAddress,
      poolWeight,
      lastRewardBlock,
      accMetaNodePerST,
      stTokenAmount,
      minDepositAmount,
      unstakeLockedBlocks,
    };
  }, [poolData]);

  const { write, isConfirmed, isConfirming, isPending } = useWrite();
  const handleStake = () => {
    write('depositeETH', [], parseEther(amount));
  };

  const { userStake } = useReward();

  useEffect(() => {
    if (isConfirmed) {
      client.invalidateQueries({ queryKey: balanceQueryKey });
      client.invalidateQueries({ queryKey: poolQueryKey });
    }
  }, [isConfirmed]);

  return (
    <div className="text-white p-4">
      <div className="text-center text-4xl font-bold mt-5">MetaNode Stake</div>
      <div className="text-gray-400 text-center text-lg">Stake ETH to earn tokens</div>

      <div className="grid grid-cols-2 mt-4 gap-4">
        <div className="border border-blue-500 p-12 rounded-xl">
          <div className="text-gray-500 text-xl font-bold">
            <div>Stake Amount</div>
            {isConnected && <div>{fmt(pool?.stTokenAmount)} ETH</div>}
          </div>
          <div className="mt-4 text-gray-500">Amount to stake</div>
          <div className="mt-4">
            <TextField type="number" value={amount} placeholder="0.0" onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="mt-4">
            {isConnected ? `userBalance: ${fmt(balance?.value)} ETH` : <ConnectButton label="连接钱包"></ConnectButton>}
          </div>

          <div className="mt-4">
            <Button color="primary" variant="contained" loading={isPending || isConfirming} onClick={handleStake}>
              Stake Eth
            </Button>
          </div>
          {isConfirmed && <div className="mt-4">success stake {amount} ETH</div>}
        </div>

        <Card>
          <CardContent className="flex flex-col items-center h-full">
            <div className="text-gray-500 text-xl font-bold">
              <div>Pending Rewards</div>
              {isConnected && <div className="mt-4">{fmt(userStake.staked)} MTN</div>}
            </div>
            <div className="flex-1"></div>
            <Button color="success" variant="contained">
              Claim Rewards
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
