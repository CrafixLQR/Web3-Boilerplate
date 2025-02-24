// 导入 Web3React 核心连接器初始化函数
import { initializeConnector } from "@web3-react/core";
// 导入网络连接器
import { Network } from "@web3-react/network";

// 导入网络 RPC URL 配置
import { URLS } from "data/networks";

// 初始化网络连接器
// Network 连接器用于直接与区块链节点通信，不需要钱包
// urlMap: URLS 提供了不同链的 RPC 端点映射
export const [network, hooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: URLS }));