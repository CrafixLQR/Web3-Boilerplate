// 导入 React 的 FC (Function Component) 类型
import { FC } from "react";

// 导入 Ant Design 组件
import { Button, Layout } from "antd";

// 导入主题模式相关的图片资源
import dark_mode from "assets/images/dark_mode.png";
import light_mode from "assets/images/light_mode.png";
// 导入项目 Logo 图片
import web3Boilerplate_logo from "assets/images/web3Boilerplate_logo.png";
import web3Boilerplate_logo_dark from "assets/images/web3Boilerplate_logo_dark.png";
// 导入自定义组件
import ConnectAccount from "components/Account/ConnectAccount";
import ChainSelector from "components/ChainSelector";
// 导入自定义 Hook
import { useWindowSize } from "hooks";

// 从 Layout 中解构出 Header 组件
const { Header } = Layout;

// 定义头部样式
const styles = {
  header: {
    position: "fixed",         // 固定定位
    display: "flex",           // 弹性布局
    alignItems: "center",      // 垂直居中
    justifyContent: "space-between", // 两端对齐
    width: "100%",            // 宽度占满
    backgroundColor: "transparent", // 透明背景
    paddingTop: "15px",       // 顶部内边距
    zIndex: 1                 // 层级
  },
  headerRight: {
    display: "flex",          // 弹性布局
    gap: "10px",             // 元素间距
    alignItems: "center",     // 垂直居中
    paddingRight: "10px",     // 右侧内边距
    fontSize: "15px",         // 字体大小
    fontWeight: "600"         // 字体粗细
  }
} as const;

// 定义组件属性类型
type CustomHeaderProps = {
  isDarkMode: boolean;  // 当前主题模式
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>; // 主题切换函数
};

// 自定义头部组件
const CustomHeader: FC<CustomHeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  // 使用自定义 Hook 获取设备类型
  const { isTablet } = useWindowSize();

  // 主题切换处理函数
  const toggleColorMode = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return (
    // Header 组件，根据设备类型设置不同的内边距
    <Header style={{ ...styles.header, padding: isTablet ? "15px 5px 0 5px" : "15px 20px 0 20px" }}>
      {/* Logo 组件 */}
      <Logo isDarkMode={isDarkMode} />
      {/* 右侧功能区 */}
      <div style={styles.headerRight}>
        {/* 链选择器 */}
        <ChainSelector />
        {/* 账户连接按钮 */}
        <ConnectAccount />
        {/* 主题切换按钮 */}
        <Button
          shape="round"
          ghost
          onClick={toggleColorMode}
          style={{ height: "42px", padding: "5px 7px 0 10px", border: "none" }}
        >
          <img src={isDarkMode ? light_mode : dark_mode} alt="color mode" width="25px" />
        </Button>
      </div>
    </Header>
  );
};

export default CustomHeader;

// Logo 组件属性类型
type LogoProps = {
  isDarkMode: boolean;
};

// Logo 组件
export const Logo: FC<LogoProps> = ({ isDarkMode }) => {
  // 使用自定义 Hook 获取设备类型
  const { isTablet } = useWindowSize();

  return (
    // 根据设备类型设置不同的上边距
    <div style={{ paddingTop: isTablet ? "25px" : "40px" }}>
      <img
        // 根据主题模式选择不同的 Logo
        src={isDarkMode ? web3Boilerplate_logo_dark : web3Boilerplate_logo}
        alt="web3Boilerplate_logo"
        // 根据设备类型设置不同的宽度
        width={isTablet ? "70px" : "90px"}
      />
    </div>
  );
};