// 导入 React 相关类型和钩子
import { FC, MouseEvent, ReactElement, SetStateAction, useState } from "react";

// 导入 Ant Design 组件
import { Button, Input, message } from "antd";

// 导入自定义合约操作钩子和工具函数
import { useWriteContract } from "hooks";
import { getEllipsisTxt } from "utils/formatters";

// 定义组件样式
const styles = {
  buttonSign: {
    margin: "15px auto"  // 签名按钮的外边距
  }
} as const;

// 消息签名组件
const SignMessage: FC = (): ReactElement => {
  // 初始化消息提示 API
  const [messageApi, contextHolder] = message.useMessage();
  // 获取合约写入相关的状态和方法
  const { loading, signMessage } = useWriteContract();
  // 管理待签名消息的状态
  const [messageAuth, setMessageAuth] = useState<string>("");

  // 处理消息输入变化
  const handleMessageChange = (e: { target: { value: SetStateAction<string> } }) => {
    setMessageAuth(e.target.value);
  };

  // 处理消息签名
  const handleSignMessage = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    // 调用签名方法并获取结果
    const { success, data } = await signMessage(messageAuth);

    // 根据签名结果显示不同的提示信息
    if (success) {
      messageApi.success(`Success! Transaction Hash: ${getEllipsisTxt(data, 8)}`);
    } else {
      messageApi.error(`An error occurred: ${data}`);
    }
  };

  return (
    <>
      {/* 消息提示的上下文 */}
      {contextHolder}
      <div style={{ width: "40%", minWidth: "250px" }}>
        {/* 消息输入框 */}
        <Input
          allowClear          // 允许清除输入
          value={messageAuth}  // 输入值
          onChange={handleMessageChange}  // 变化处理函数
          type="textarea"     // 文本域类型
          placeholder="Input message to sign"  // 占位文本
        />
        {/* 签名按钮 */}
        <Button 
          type="primary" 
          shape="round" 
          style={styles.buttonSign} 
          onClick={handleSignMessage} 
          loading={loading}  // 加载状态
        >
          Sign Message
        </Button>
      </div>
    </>
  );
};

export default SignMessage;