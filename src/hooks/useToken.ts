// 导入以太坊和数据获取相关依赖
import { BigNumber } from "ethers";
import useSWR from "swr";

// 导入 ERC20 合约 ABI 和类型
import GenericERC20Abi from "data/abi/GenericERC20.json";
import { GenericERC20 } from "data/abi/types";
import { parseBigNumberToFloat } from "utils/formatters";

// 导入合约 Hook
import { useContract } from "./useContract";

/**
 * ERC20 代币操作的 Hook
 * @param address - 代币合约地址
 */
export const useToken = (address: string) => {
  // 初始化 ERC20 合约实例
  const contract = useContract<GenericERC20>(address, GenericERC20Abi);

  /**
   * 通用合约方法调用函数
   * @param args - 方法名和参数数组
   */
  const fetcher = async (args: string[]) => {
    const [, method, ...rest] = args;
    if (!contract) throw new Error("Contract not initialized");
    const contractMethod = (contract as any)[method];
    if (!contractMethod || typeof contractMethod !== "function")
      throw new Error(`Method ${method} not found on contract`);
    try {
      return await contractMethod(...rest);
    } catch (error) {
      console.error(`Error fetching ${method}:`, error);
      throw error;
    }
  };

  // 获取代币小数位数
  const { data: decimals } = useSWR(contract ? ["decimals", "decimals"] : null, fetcher);
  // 获取代币名称
  const { data: name } = useSWR(contract ? ["name", "name"] : null, fetcher);

  /**
   * 查询代币授权额度的 Hook
   * @param spender - 被授权地址
   * @param owner - 代币所有者地址
   */
  const useAllowance = (spender: string, owner: string) => {
    const key = `allowance/${spender}/${owner}`;
    const { data } = useSWR(contract ? [key, "allowance", owner, spender] : null, async () => {
      const allowance: BigNumber = await fetcher([key, "allowance", owner, spender]);
      return parseBigNumberToFloat(allowance, Number(decimals));
    });

    return data;
  };

  /**
   * 查询代币余额的 Hook
   * @param owner - 要查询余额的地址
   */
  const useBalance = (owner: string) => {
    const key = `balance/${owner}`;
    const { data } = useSWR(contract ? [key, "balanceOf", owner] : null, async () => {
      const bal: BigNumber = await fetcher([key, "balanceOf", owner]);
      return parseBigNumberToFloat(bal, Number(decimals));
    });

    return data;
  };

  // 返回所有可用的方法和数据
  return {
    useAllowance,  // 查询授权额度
    useBalance,    // 查询代币余额
    decimals,      // 代币小数位数
    name,          // 代币名称
    contract       // 合约实例
  };
};