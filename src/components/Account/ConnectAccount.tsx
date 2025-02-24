// 导入 React 核心功能
import React, { useCallback, useState } from "react";

// 导入 Web3React 钩子
import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";

// 导入钱包连接器
import { metaMask } from "connectors/metaMask";
import { walletConnect } from "connectors/walletConnect";
// 导入自定义钩子和工具函数
import { useWindowSize } from "hooks";
import { getEllipsisTxt } from "utils/formatters";

// 导入子组件
import ConnectModal from "./ConnectModal";
import DisconnectModal from "./DisconnectModal";
import Jazzicons from "../Jazzicons";

// 定义组件样式
const styles = {
  account: {
    height: "42px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    border: " 1px solid rgba(152, 161, 192, 0.24)"  // 账户按钮边框样式
  },
  button: {
    height: "40px",
    padding: "0 20px",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: "0.2px",
    fontSize: "15px",
    margin: "20px 20px",
    border: "none"
  },
  modalTitle: {
    marginBottom: "20px",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px"
  }
} as const;

// 定义组件属性接口
interface WantedChain {
  chain?: number;  // 可选的链 ID
}

// 连接账户组件
const ConnectAccount: React.FC<WantedChain> = () => {
  // 获取 Web3React 上下文中的账户信息
  const { account } = useWeb3React();
  // 获取设备类型信息
  const { isTablet } = useWindowSize();
  // 管理断开连接模态框的状态
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  // 管理连接钱包模态框的状态
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // 断开钱包连接的处理函数
  const disconnect = useCallback(async () => {
    // 获取当前使用的连接器
    const connector = metaMask || walletConnect;
    // 关闭所有模态框
    setIsModalVisible(false);
    setIsAuthModalOpen(false);
    // 清除本地存储的连接器 ID
    localStorage.removeItem("connectorId");
    // 调用连接器的断开方法
    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
    // 处理特殊的钱包关闭方法
    // @ts-expect-error close can be returned by wallet
    if (connector?.close) {
      // @ts-expect-error close can be returned by wallet
      await connector.close();
    }
  }, []);

  return (
    <>
      {/* 根据账户状态显示不同的内容 */}
      {account === undefined ? (
        // 未连接钱包时显示连接按钮
        <div>
          <Button shape="round" type="primary" style={styles.button} onClick={() => setIsAuthModalOpen(true)}>
            Connect Wallet
          </Button>
          {/* 连接钱包的模态框 */}
          <ConnectModal isModalOpen={isAuthModalOpen} setIsModalOpen={setIsAuthModalOpen} />
          <br />
        </div>
      ) : (
        // 已连接钱包时显示账户信息
        <>
          <Button style={styles.account} onClick={() => setIsModalVisible(true)}>
            {/* 显示截断的账户地址 */}
            {account && typeof account === "string" && (
              <p style={{ marginRight: "5px" }}>{getEllipsisTxt(account, isTablet ? 3 : 6)}</p>
            )}
            {/* 显示账户头像 */}
            <Jazzicons seed={account} />
          </Button>

          {/* 断开连接的模态框 */}
          <DisconnectModal isModalOpen={isModalVisible} setIsModalOpen={setIsModalVisible} disconnect={disconnect} />
        </>
      )}
    </>
  );
};

export default ConnectAccount;