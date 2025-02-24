// 导入 React 核心钩子
import { useEffect, useState } from "react";

// 导入以太坊相关类型
import type { BigNumber } from "@ethersproject/bignumber";
import type { Web3ReactHooks } from "@web3-react/core";

/**
 * 获取账户原生代币余额的 Hook
 * @param provider - Web3 提供者实例
 * @param account - 要查询余额的账户地址
 * @returns 返回账户余额（BigNumber 类型）或 undefined
 */
export const useNativeBalance = (
  provider?: ReturnType<Web3ReactHooks["useProvider"]>,
  account?: string
): BigNumber | undefined => {
  // 管理余额状态
  const [balance, setBalance] = useState<BigNumber | undefined>();

  // 当提供者或账户变化时获取余额
  useEffect(() => {
    // 确保提供者和账户都存在
    if (provider && account?.length) {
      // 定义获取余额的异步函数
      const fetchBalance = async (account: string) => {
        // 调用提供者的 getBalance 方法获取余额
        const res: BigNumber | undefined = await provider?.getBalance(account);
        // 更新余额状态
        setBalance(res);
      };

      // 执行余额获取
      fetchBalance(account);
    }
  }, [provider, account]);  // 依赖项：提供者和账户

  return balance;
};