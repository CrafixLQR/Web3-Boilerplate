// 导入 Web3React 钩子用于获取区块链连接状态
import { useWeb3React } from "@web3-react/core";
// 导入 Ant Design 组件
import { Divider, Typography } from "antd";
const { Title } = Typography;

// 导入自定义窗口大小钩子
import { useWindowSize } from "hooks";

// 导入显示面板的子组件
import { Infos, SignMessage, Status, TransferEth } from "./components";

// 定义组件样式
const styles = {
  container: {
    width: "80%",           // 容器宽度
    minWidth: "330px",      // 最小宽度
    maxWidth: "900px",      // 最大宽度
    textAlign: "center",    // 文本居中
    margin: "auto",         // 居中显示
    padding: "20px 0",      // 上下内边距
    borderRadius: "10px",   // 圆角
    boxShadow: "0px 0px 30px 30px rgba(30, 136, 229, 0.2)"  // 阴影效果
  },
  content: {
    width: "85%",          // 内容区域宽度
    margin: "auto",        // 居中显示
    fontSize: "17px"       // 字体大小
  },
  action: {
    display: "inline-flex",  // 内联弹性布局
    flexWrap: "wrap",        // 允许换行
    justifyContent: "center", // 居中对齐
    gap: "20px"              // 元素间距
  }
} as const;

// 定义组件属性接口
type DisplayPaneProps = {
  isDarkMode: boolean;  // 深色模式标志
};

// 显示面板组件
const DisplayPane: React.FC<DisplayPaneProps> = ({ isDarkMode }) => {
  // 获取区块链连接状态
  const { chainId, isActivating, isActive } = useWeb3React();
  // 获取设备类型
  const { isTablet } = useWindowSize();

  return (
    <div
      style={{
        ...styles.container,
        // 根据深色模式设置边框
        border: isDarkMode ? "1px solid rgba(152, 161, 192, 0.24)" : "none",
        // 根据设备类型调整宽度
        width: isTablet ? "90%" : "80%"
      }}
    >
      <Title>Display Info</Title>
      <div style={styles.content}>
        {/* 显示连接状态 */}
        <Status isActivating={isActivating} isActive={isActive} />
        {/* 显示链信息 */}
        <Infos chainId={chainId} />

        {/* 仅在连接激活时显示操作区域 */}
        {isActive && (
          <>
            <Divider />
            <div style={styles.action}>
              {/* 消息签名组件 */}
              <SignMessage />
              {/* 在非平板设备上显示垂直分隔线 */}
              {!isTablet && <Divider type="vertical" style={{ fontSize: "120px !important" }} />}
              {/* ETH 转账组件 */}
              <TransferEth />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayPane;