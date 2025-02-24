// 导入 Web3React 相关组件和类型
import { useWeb3React } from "@web3-react/core";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect-v2";

// 导入网络参数获取函数
import { getAddChainParameters } from "data/networks";

/**
 * 切换区块链网络的 Hook
 * @returns 返回切换网络的函数
 */
export function useSwitchChain() {
  // 从 Web3React 获取当前连接器
  const { connector } = useWeb3React();

  /**
   * 切换到指定的区块链网络
   * @param desiredChain - 目标链的 ID，-1 表示断开连接
   */
  const switchChain = async (desiredChain: number) => {
    // 根据连接器类型使用不同的切换方式
    if (connector instanceof WalletConnect || connector instanceof Network) {
      // WalletConnect 和 Network 连接器直接使用链 ID
      await connector.activate(desiredChain === -1 ? undefined : desiredChain);
    } else {
      // 其他连接器（如 MetaMask）需要完整的链参数
      await connector.activate(desiredChain === -1 ? undefined : getAddChainParameters(desiredChain));
    }
  };

  return switchChain;
}