// 导入 React 相关钩子和类型
import { MouseEvent, useState } from "react";

// 导入 Web3React 钩子
import { useWeb3React } from "@web3-react/core";
// 导入 Ant Design 组件
import { Button, InputNumber, message } from "antd";

// 导入自定义钩子和工具函数
import { useNativeBalance, useWriteContract } from "hooks";
import { getEllipsisTxt, parseBigNumberToFloat } from "utils/formatters";

// 导入地址输入组件
import AddressInput from "../../AddressInput";

// 定义组件样式
const styles = {
  buttonTransfer: {
    display: "flex",
    margin: "15px 0"
  }
} as const;

// ETH 转账组件
const TransferEth: React.FC = () => {
  // 获取 Web3React 上下文中的账户和提供者
  const { account, provider } = useWeb3React();
  // 初始化消息提示 API
  const [messageApi, contextHolder] = message.useMessage();
  // 获取转账相关的状态和方法
  const { loading, transferNative } = useWriteContract();
  // 获取当前账户的原生代币余额
  const balance = useNativeBalance(provider, account);
  // 管理转账金额状态
  const [amount, setAmount] = useState<number | null>();
  // 管理接收地址状态
  const [receiver, setReceiver] = useState<string>();

  // 处理转账操作
  const handleTransfer = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    // 验证接收地址
    if (!receiver) {
      messageApi.error("The receiver address is missing. Please check your input.");
      return;
    }

    // 验证转账金额不为零
    if (amount === 0) {
      messageApi.error("The amount can't be 0. Make sure your balance is positive, and double check your input.");
      return;
    }

    // 验证转账金额存在
    if (!amount) {
      messageApi.error("The amount is missing. Please double check your input.");
      return;
    }

    // 执行转账操作
    const { success, data } = await transferNative(receiver, amount);

    // 处理转账结果
    if (success) {
      messageApi.success(
        `Success! Transaction Hash: ${getEllipsisTxt(data?.transactionHash ?? "Transactions Hash missing.", 8)}`
      );
    } else {
      messageApi.error(`An error occurred: ${data}`);
    }
  };

  return (
    <>
      {/* 消息提示的上下文 */}
      {contextHolder}
      <div style={{ width: "40%", minWidth: "250px" }}>
        {/* 接收地址输入框 */}
        <AddressInput onChange={setReceiver} address={receiver} />
        <div style={{ display: "inline-flex", gap: "10px", width: "100%" }}>
          {/* 转账金额输入框 */}
          <InputNumber
            value={amount}
            onChange={setAmount}
            placeholder="Amount to transfer"
            min={0}  // 最小值为 0
            max={balance ? parseBigNumberToFloat(balance) : 0}  // 最大值为当前余额
            style={{ width: "100%", height: "80%", marginBlock: "auto" }}
          />

          {/* 转账按钮 */}
          <div style={styles.buttonTransfer}>
            <Button 
              type="primary" 
              shape="round" 
              onClick={handleTransfer} 
              loading={loading}  // 加载状态
              disabled={loading}  // 禁用状态
            >
              Transfer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferEth;