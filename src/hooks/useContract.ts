// 导入 React 的 useMemo 钩子用于性能优化
import { useMemo } from "react";

// 导入以太坊相关常量和类型
import { AddressZero } from "@ethersproject/constants";
import { Provider } from "@ethersproject/providers";
import { Contract, ContractInterface, Signer } from "ethers";
import { isAddress } from "ethers/lib/utils";

// 导入自定义钩子用于获取签名者或提供者
import { useSignerOrProvider } from "./useSignerOrProvider";

/**
 * 创建合约实例的辅助函数
 * @param address - 合约地址
 * @param abi - 合约 ABI 接口
 * @param provider - 签名者或提供者实例
 * @returns 返回类型化的合约实例
 */
function getContract<T = Contract>(address: string, abi: ContractInterface, provider: Signer | Provider) {
  return <T>(<unknown>new Contract(address, abi, provider));
}

/**
 * 用于创建和管理智能合约实例的 Hook
 * @param address - 合约地址
 * @param abi - 合约 ABI 接口
 * @returns 返回合约实例或 undefined
 */
export function useContract<Contract>(address: string, abi: ContractInterface) {
  // 获取签名者和提供者
  const { provider, signer } = useSignerOrProvider();
  // 优先使用签名者，如果没有则使用提供者
  const signerOrProvider = signer ?? provider;

  // 使用 useMemo 缓存合约实例
  const contract = useMemo(() => {
    // 验证地址的有效性和签名者/提供者的存在性
    if (!isAddress(address) || address === AddressZero || !signerOrProvider) {
      console.error(`Invalid 'address' parameter '${address}'.`);
      return undefined;
    }
    // 创建并返回合约实例
    return getContract<Contract>(address, abi, signerOrProvider);
  }, [address, abi, signerOrProvider]);  // 依赖项发生变化时重新创建合约实例

  return contract;
}