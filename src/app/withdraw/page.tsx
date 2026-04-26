'use client';
import { useReward } from '@/hooks/useReward';
import { fmt } from '@/lib/utils';
import { Button, Card, CardContent, TextField } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Withdraw() {
  const client = useQueryClient();
  const { isConnected } = useAccount();
  const { userStake, useWithDraw, useUnstake } = useReward();
  const { isLoading: unstakeLoading, handleUnstake, isConfirmed: unstakeConfirmed } = useUnstake();
  const { isLoading: withdrawLoading, handleWithdraw, isConfirmed: withdrawConfirmed } = useWithDraw();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (unstakeConfirmed || withdrawConfirmed) {
      client.invalidateQueries();
    }
  }, [unstakeConfirmed, withdrawConfirmed]);

  return (
    <div className="text-white p-4 max-w-3xl mx-auto">
      <div className="text-center text-4xl font-bold mt-5">Withdraw</div>
      <div className="text-gray-400 text-center text-lg">Unstake and withdraw your ETH</div>
      {isConnected ? (
        <Card className="mt-10">
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-md p-4 font-bold">
                  <div className="text-gray-500 text-lg">Staked Amount</div>
                  <div className="text-lg text-blue-500">{fmt(userStake.staked)} ETH</div>
                </div>
                <div className="bg-white rounded-md p-4 font-bold">
                  <div className="text-gray-500 text-lg ">Avaliable to Withdraw</div>
                  <div className="text-lg text-blue-500">{fmt(userStake.withdrawable)} ETH</div>
                </div>
                <div className="bg-white rounded-md p-4 font-bold">
                  <div className="text-gray-500 text-lg ">Pending Withdraw</div>
                  <div className="text-lg text-blue-500">{fmt(userStake.withdrawPending)} ETH</div>
                </div>
              </div>
              <h1 className="font-bold">Unstake</h1>
              <div>
                <TextField
                  label="Amount to unstake"
                  variant="outlined"
                  type="number"
                  value={amount}
                  className="w-full"
                  onChange={(e) => setAmount(e.target.value)}
                ></TextField>
              </div>

              <div>
                <Button
                  color="primary"
                  variant="contained"
                  className="text-center w-full"
                  disabled={!amount}
                  loading={unstakeLoading}
                  onClick={() => handleUnstake(amount)}
                >
                  Unstake ETH
                </Button>
              </div>

              <div className="font-bold">withdraw</div>
              <div className="bg-white rounded-md p-4 flex">
                <div className="flex-1">
                  <div className="text-gray-500">Ready to withdraw</div>
                  <div className="text-blue-500">{fmt(userStake.withdrawable)}</div>
                </div>
                <div className="text-gray-500">20 min cooldown</div>
              </div>
              <div className="text-gray-500">After unstaking, you need to wait 20 minutes to withdraw.</div>

              <Button
                className="w-full"
                color="primary"
                variant="contained"
                disabled={userStake.withdrawable == 0n}
                loading={withdrawLoading}
                onClick={handleWithdraw}
              >
                Withdraw Eth
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center mt-10">
          <ConnectButton></ConnectButton>
        </div>
      )}
    </div>
  );
}
