import { Abi, Address, ContractFunctionArgs, ContractFunctionName } from 'viem';
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

export const useContract = <const T extends Abi>(abi: T, address: Address) => {
  const useRead = <F extends ContractFunctionName<T, 'pure' | 'view'>>(
    functionName: F,
    args?: ContractFunctionArgs<T, 'pure' | 'view', F>,
  ) => {
    // @ts-ignore
    return useReadContract({
      abi,
      address,
      functionName,
      args,
    });
  };

  const useWrite = () => {
    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
    const write = <
      F extends ContractFunctionName<T, 'nonpayable' | 'payable'>,
      A extends ContractFunctionArgs<T, 'nonpayable' | 'payable', F>,
    >(
      functionName: F,
      args?: A,
      value?: BigInt,
    ) => {
      // @ts-ignore
      writeContract({ abi, address, functionName, args, value });
    };
    return { write, isPending, isConfirming, isConfirmed };
  };

  return { useRead, useWrite };
};
