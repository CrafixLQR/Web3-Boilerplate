// 导入 Node.js 的 Buffer 用于处理二进制数据
// Web3.js 需要 Buffer 支持
import { Buffer } from "buffer";

// 导入 React 的 useState Hook 用于状态管理
import { useState } from "react";

// 导入 Ant Design 的核心组件
import { Layout, ConfigProvider, theme } from "antd";

// 导入自定义组件
import DisplayPane from "components/displayPane/DisplayPane";
import { CustomHeader, MainContent, CustomFooter } from "layout";

// 导入全局样式
import "styles/App.css";

// 定义全局布局样式
const styles = {
  layout: {
    width: "100vw",      // 视窗宽度
    height: "100vh",     // 视窗高度
    overflow: "auto",    // 内容溢出时显示滚动条
    fontFamily: "Sora, sans-serif"  // 使用 Sora 字体
  }
} as const;

function App() {
  // 从 antd 的 theme 中解构出主题算法
  const { defaultAlgorithm, darkAlgorithm } = theme;
  // 创建主题状态，默认使用深色模式
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // 为 window 对象添加 Buffer 支持
  // 这是 Web3.js 需要的全局变量
  if (!window.Buffer) window.Buffer = Buffer;

  return (
    // Ant Design 的主题配置提供者
    <ConfigProvider
      theme={{
        // 根据 isDarkMode 状态切换深色/浅色主题
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm
      }}
    >
      {/* 使用 Ant Design 的布局组件 */}
      <Layout style={styles.layout}>
        {/* 自定义头部组件，传入主题控制属性 */}
        <CustomHeader isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        {/* 主要内容区域 */}
        <MainContent>
          {/* 展示面板组件，传入主题状态 */}
          <DisplayPane isDarkMode={isDarkMode} />
        </MainContent>
        {/* 自定义页脚组件 */}
        <CustomFooter />
      </Layout>
    </ConfigProvider>
  );
}

export default App;