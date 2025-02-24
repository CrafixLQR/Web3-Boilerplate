import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect-v2";

import { CHAINS } from "data/networks";

// 获取主网和其他可选链
const [mainnet, ...optionalChains] = Object.keys(CHAINS).map(Number);

// 初始化 WalletConnect 连接器
export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        // WalletConnect v2 需要的项目 ID
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID ?? "",
        // 设置支持的链
        chains: [mainnet],
        optionalChains,
        // 显示二维码模态框
        showQrModal: true,
        // dApp 元数据
        metadata: {
          name: "Web3 Boilerplate",
          description: "Clean Web3 Boilerplate using the latest stack out there...",
          url: "https://web3-boilerplate.netlify.app/",
          icons: ["favicon.ico"]
        }
      }
    })
);