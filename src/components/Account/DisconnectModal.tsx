// 导入 Ant Design 的图标和组件
import { SelectOutlined } from "@ant-design/icons";
// 导入 Web3React 钩子
import { useWeb3React } from "@web3-react/core";
import { Button, Card, Modal } from "antd";

// 导入区块链浏览器地址获取函数
import { getExplorer } from "data/networks";

// 导入地址显示组件
import Address from "./Address";

// 定义组件属性接口
interface ConnectModalProps {
  isModalOpen: boolean;                                        // 控制模态框显示状态
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // 设置模态框状态的函数
  disconnect: () => Promise<void>;                             // 断开钱包连接的函数
}

// 断开连接模态框组件
const DisconnectModal: React.FC<ConnectModalProps> = ({ isModalOpen, setIsModalOpen, disconnect }) => {
  // 从 Web3React 获取当前账户和链 ID
  const { account, chainId } = useWeb3React();

  return (
    <Modal
      open={isModalOpen}
      footer={null}  // 不显示底部按钮
      onCancel={() => setIsModalOpen(false)}  // 关闭模态框的回调
      styles={{ body: { width: "350px", padding: "15px", fontSize: "17px", fontWeight: "500" } }}
    >
      Account
      {/* 账户信息卡片 */}
      <Card
        style={{
          marginTop: "10px",
          borderRadius: "10px"
        }}
        styles={{ body: { padding: "15px" } }}
      >
        {/* 显示钱包地址，支持头像和复制功能 */}
        <Address avatar="left" size={6} copyable style={{ fontSize: "20px" }} />
        <div style={{ marginTop: "10px", padding: "0 10px" }}>
          {/* 如果有链 ID，显示区块浏览器链接 */}
          {chainId !== undefined && (
            <a href={`${getExplorer(chainId)}/address/${account}`} target="_blank" rel="noreferrer">
              <SelectOutlined style={{ marginRight: "5px" }} />
              View on Explorer
            </a>
          )}
        </div>
      </Card>
      {/* 断开连接按钮 */}
      <Button
        size="large"
        type="primary"
        style={{
          width: "100%",
          marginTop: "10px",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "500"
        }}
        onClick={() => disconnect()}  // 点击时调用断开连接函数
      >
        Disconnect Wallet
      </Button>
    </Modal>
  );
};

export default DisconnectModal;