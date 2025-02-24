// 导入 React 钩子
import { useCallback, useState } from "react";

// 导入 ethers 库
import { ethers } from "ethers";

// 导入签名者钩子
import { useSignerOrProvider } from "./useSignerOrProvider";

/**
 * 处理合约写入操作的 Hook
 */
export const useWriteContract = () => {
  // 获取签名者实例
  const { signer } = useSignerOrProvider();
  // 管理加载状态
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 消息签名方法
   * @param messageAuth - 要签名的消息
   * @returns 包含签名结果的对象
   */
  const signMessage = useCallback(
    async (messageAuth: string): Promise<{ success: boolean; data: string }> => {
      setLoading(true);
      // 设置消息内容，如果为空则使用默认消息
      const authMessage = messageAuth.length > 0 ? { Title: `${messageAuth}` } : { Title: "Hello Web3!" };

      try {
        // 调用签名者进行消息签名
        const transactionHash = await signer?.signMessage(authMessage.Title);
        return { success: true, data: transactionHash ?? "" };
      } catch (error: any) {
        // 处理错误情况
        const message = error.reason ?? error.message ?? error;
        return { success: false, data: message };
      } finally {
        setLoading(false);
      }
    },
    [signer]
  );

  /**
   * 转账原生代币方法
   * @param receiver - 接收地址
   * @param amount - 转账金额
   * @returns 包含交易回执的对象
   */
  const transferNative = useCallback(
    async (
      receiver: string,
      amount: number
    ): Promise<{ success: boolean; data: ethers.providers.TransactionReceipt | undefined }> => {
      setLoading(true);
      try {
        // 验证接收地址的有效性
        if (!ethers.utils.isAddress(receiver)) {
          throw new Error("Invalid address");
        }
        // 验证转账金额的有效性
        if (!amount || amount <= 0) {
          throw new Error("Invalid amount");
        }

        // 构建交易对象
        const amountToString = amount.toString();
        const tx = {
          to: receiver,
          value: ethers.utils.parseEther(amountToString)  // 转换为 Wei 单位
        };

        // 发送交易并等待确认
        const transaction = await signer?.sendTransaction(tx);
        const receipt = await transaction?.wait(2);  // 等待 2 个区块确认
        return { success: true, data: receipt };
      } catch (error: any) {
        // 处理错误情况
        const message = error.reason ?? error.message ?? error;
        return { success: false, data: message };
      } finally {
        setLoading(false);
      }
    },
    [signer]
  );

  // 返回所有可用的方法和状态
  return {
    loading,        // 加载状态
    signMessage,    // 消息签名方法
    transferNative  // 转账方法
  };
};