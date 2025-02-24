// 导入 Web3React 类型
import type { Web3ReactHooks } from "@web3-react/core";
// 导入 Ant Design 组件
import { Typography } from "antd";
const { Paragraph } = Typography;

// 定义组件样式
const styles = {
  display: {
    paddingBlock: "15px 0px"  // 上下内边距
  },
  statusText: {
    fontSize: "17px"  // 状态文本大小
  },
  statusValue: {
    fontWeight: 800   // 状态值字体粗细
  }
} as const;

// 状态显示组件，接收激活中和已激活状态作为属性
const Status = ({
  isActivating,
  isActive
}: {
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>;
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
}) => {
  // 定义状态映射对象，包含不同状态对应的显示文本
  const statusMapping = {
    isActivating: "🟡 Connecting",    // 连接中状态
    isActive: "🟢 Connected",         // 已连接状态
    default: "⚪️ Disconnected"        // 未连接状态
  };

  // 根据当前状态确定显示文本
  let status = statusMapping.default;
  if (isActivating) {
    status = statusMapping.isActivating;
  } else if (isActive) {
    status = statusMapping.isActive;
  }

  return (
    <div style={styles.display}>
      <Typography>
        <Paragraph style={styles.statusText}>
          Account status: <span style={styles.statusValue}>{status}</span>
        </Paragraph>
      </Typography>
    </div>
  );
};

export default Status;