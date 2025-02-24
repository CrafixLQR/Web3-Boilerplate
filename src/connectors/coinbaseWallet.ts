import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";
import { URLS } from "data/networks";

// 添加默认 RPC URL 作为后备
const DEFAULT_URL = "https://mainnet.infura.io/v3/your-api-key";

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: URLS[1]?.[0] || DEFAULT_URL,  // 使用可选链操作符并提供默认值
        appName: "Web3-Boilerplate"
      }
    })
);