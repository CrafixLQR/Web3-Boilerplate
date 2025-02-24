// 导入各种钱包连接器类型
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Network } from "@web3-react/network";
import { WalletConnect } from "@web3-react/walletconnect-v2";

// 导入各个钱包的连接器实例和对应的 hooks
import { coinbaseWallet, hooks as coinbaseWalletHooks } from "./coinbaseWallet";
import { hooks as metaMaskHooks, metaMask } from "./metaMask";
import { hooks as networkHooks, network } from "./network";
import { hooks as walletConnectHooks, walletConnect } from "./walletConnect";

// 创建连接器数组，每个元素包含连接器实例和对应的 hooks
const connectors: [MetaMask | WalletConnect | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks]
];

export default connectors;