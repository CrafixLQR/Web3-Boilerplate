import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

// 初始化 MetaMask 连接器，配置相对简单因为 MetaMask 注入了全局对象
export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));