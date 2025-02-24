// 导入 React 的 useCallback 钩子用于性能优化
import { useCallback } from "react";

// 导入 Ant Design 组件
import { Modal, Divider, message } from "antd";

// 导入钱包图标资源
import coinbase_Logo from "assets/images/coinbase_Logo.png";
import metamask_Logo from "assets/svg/metamask_Logo.svg";
import walletconnect_Logo from "assets/svg/walletconnect_Logo.svg";
// 导入钱包连接器和相关钩子
import { hooks as coinbaseWallethooks, coinbaseWallet } from "connectors/coinbaseWallet";
import { getName } from "connectors/getConnectorName";
import { hooks as metaMaskhooks, metaMask } from "connectors/metaMask";
import { hooks as walletConnecthooks, walletConnect } from "connectors/walletConnect";

// 导入自定义连接按钮组件
import ConnectButton from "./ConnectButton";

// 定义模态框标题样式
const styles = {
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
interface ConnectModalProps {
  isModalOpen: boolean;  // 控制模态框显示状态
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;  // 设置模态框状态的函数
}

// 从各个钱包的 hooks 中解构出激活状态检查钩子
const { useIsActivating: useMMIsActivating } = metaMaskhooks;    // MetaMask
const { useIsActivating: useWCIsActivating } = walletConnecthooks;  // WalletConnect
const { useIsActivating: useCBIsActivating } = coinbaseWallethooks;  // Coinbase

// 连接钱包模态框组件
const ConnectModal: React.FC<ConnectModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  // 初始化消息提示 API
  const [messageApi, contextHolder] = message.useMessage();
  // 获取各钱包的激活状态
  const isMMActivating = useMMIsActivating();
  const isWCActivating = useWCIsActivating();
  const isCBActivating = useCBIsActivating();

  // 处理钱包连接的回调函数
  const activateConnector = useCallback(async (label: string) => {
    try {
      switch (label) {
        case "MetaMask":
          await metaMask.activate();  // 激活 MetaMask
          window.localStorage.setItem("connectorId", getName(metaMask));  // 保存连接器 ID
          break;

        case "WalletConnect":
          await walletConnect.activate();  // 激活 WalletConnect
          window.localStorage.setItem("connectorId", getName(walletConnect));
          break;

        case "Coinbase Wallet":
          await coinbaseWallet.activate();  // 激活 Coinbase 钱包
          window.localStorage.setItem("connectorId", getName(coinbaseWallet));
          break;

        default:
          break;
      }
    } catch (error) {
      // 连接失败时显示错误消息
      messageApi.error("Failed to connect wallet. Please try again.");
    }
  }, []);

  return (
    <>
      {contextHolder}  {/* 消息提示的上下文 */}
      <Modal
        open={isModalOpen}
        footer={null}  // 不显示底部按钮
        width={280}
        styles={{ body: { padding: "15px", fontSize: "17px", fontWeight: "500" } }}
        onCancel={() => setIsModalOpen(false)}  // 关闭模态框的回调
      >
        <div style={styles.modalTitle}>Connect Your Wallet</div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* MetaMask 连接按钮 */}
          <ConnectButton
            label="MetaMask"
            image={metamask_Logo}
            onClick={() => activateConnector("MetaMask")}
            loading={isMMActivating}
          />

          {/* WalletConnect 连接按钮 */}
          <ConnectButton
            label="WalletConnect"
            image={walletconnect_Logo}
            onClick={() => activateConnector("WalletConnect")}
            loading={isWCActivating}
          />

          {/* Coinbase Wallet 连接按钮 */}
          <ConnectButton
            label="Coinbase Wallet"
            image={coinbase_Logo}
            onClick={() => activateConnector("Coinbase Wallet")}
            loading={isCBActivating}
          />
          <Divider />
          {/* 帮助链接 */}
          <div style={{ margin: "auto", fontSize: "15px", marginBottom: "15px" }}>
            Need help installing a wallet?{" "}
            <a
              href="https://metamask.zendesk.com/hc/en-us/articles/360015489471-How-to-Install-MetaMask-Manually"
              target="_blank"
              rel="noopener"
            >
              Click here
            </a>
          </div>

          {/* 免责声明 */}
          <div style={{ margin: "auto", fontSize: "10px" }}>
            Wallets are provided by External Providers and by selecting you agree to Terms of those Providers. Your
            access to the wallet might be reliant on the External Provider being operational.
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConnectModal;