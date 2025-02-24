// 导入 Web3React 相关
import { useWeb3React, Web3ReactHooks } from "@web3-react/core";
import { Typography } from "antd";
const { Paragraph } = Typography;

// 导入工具和自定义 hooks
import { CHAINS } from "data/networks";
import { useNativeBalance, useWindowSize } from "hooks";
import { getEllipsisTxt, parseBigNumberToFloat } from "utils/formatters";

// 定义组件样式
const styles = {
  display: {
    paddingBlock: "0 15px",
    display: "flex",
    flexDirection: "column"
  },
  statusText: {
    fontSize: "17px"
  },
  statusValue: {
    fontWeight: 800
  }
} as const;

// 信息显示组件，接收链 ID 作为属性
const Infos = ({ chainId }: { chainId: ReturnType<Web3ReactHooks["useChainId"]> }) => {
  // 获取账户和提供者信息
  const { account, provider } = useWeb3React();
  // 获取原生代币余额
  const balance = useNativeBalance(provider, account);
  // 获取设备类型
  const { isTablet } = useWindowSize();

  // 如果没有链 ID 则不显示
  if (chainId === undefined) return null;
  // 获取链名称
  const name = chainId ? CHAINS[chainId]?.name : undefined;

  return (
    <Typography style={styles.display}>
      {/* 显示账户地址，平板设备显示缩略地址 */}
      <Paragraph style={styles.statusText}>
        Address:{" "}
        {!isTablet ? (
          <span style={styles.statusValue}>{account}</span>
        ) : (
          <span style={styles.statusValue}>{account && getEllipsisTxt(account, 4)}</span>
        )}
      </Paragraph>

      {/* 显示链信息 */}
      <Paragraph style={styles.statusText}>
        {name ? (
          <>
            Chain:{" "}
            <span style={styles.statusValue}>
              {name} ({chainId})
            </span>
          </>
        ) : (
          <>
            Chain Id: <b>{chainId}</b>
          </>
        )}
      </Paragraph>

      {/* 显示账户余额 */}
      <Paragraph style={styles.statusText}>
        Balance:{" "}
        <span style={styles.statusValue}>{balance ? `Ξ ${parseBigNumberToFloat(balance).toFixed(4)}` : 0}</span>
      </Paragraph>
    </Typography>
  );
};

export default Infos;