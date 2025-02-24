import React from "react";

// Web3React 核心提供者，用于管理 Web3 连接状态
import { Web3ReactProvider } from "@web3-react/core";
import { createRoot } from "react-dom/client";

// 导入根组件
import App from "./App";
// 导入所有 Web3 连接器配置（包括 MetaMask、WalletConnect 等）
import connectors from "./connectors";

// 创建 React 18 的根节点
const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // 开启严格模式，用于捕获潜在问题
  <React.StrictMode>
    {/* Web3ReactProvider 提供全局的 Web3 连接状态管理 */}
    <Web3ReactProvider connectors={connectors}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>
);