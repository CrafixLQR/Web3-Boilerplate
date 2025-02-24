// 导入 React 的 useMemo 钩子用于性能优化
import { useMemo } from "react";

// 导入以太坊相关类型
import type { Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import type { Signer } from "ethers";

// 定义返回类型接口
interface SignerOrProvider {
  provider: Provider | undefined;  // Web3 提供者
  signer: Signer | undefined;     // 交易签名者
}

/**
 * 获取以太坊签名者或提供者的 Hook
 * @returns 返回包含 provider 和 signer 的对象
 */
export const useSignerOrProvider = (): SignerOrProvider => {
  // 从 Web3React 获取提供者和账户
  const { provider, account } = useWeb3React();

  // 使用 useMemo 缓存结果
  return useMemo(() => {
    let signer;
    // 如果提供者支持获取签名者，则获取当前账户的签名者
    if (provider?.getSigner) {
      signer = provider.getSigner(account);
    }

    // 返回提供者和签名者
    return { provider, signer };
  }, [provider]);  // 仅在提供者变化时重新计算
};