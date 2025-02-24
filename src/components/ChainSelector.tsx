// 导入 React 核心功能和类型
import { FC, useCallback, useEffect, useState } from "react";

// 导入 Ant Design 组件和图标
import { DownOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";

// 导入链数据和自定义 hooks
import { chainData } from "data/chainData";
import { useSwitchChain, useWindowSize } from "hooks";

// 定义组件样式
const styles = {
  item: {
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px"
  },
  button: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    border: "0",
    borderRadius: "10px"
  }
};

// 定义菜单项类型
type MenuItem = Required<MenuProps>["items"][number];

// 创建链图标标签的辅助函数
const createLabel = (logo: string, alt: string) => (
  <div style={{ display: "inline-flex", alignItems: "center" }}>
    <img src={logo} alt={alt} style={{ width: 25, height: 25, borderRadius: 10, marginRight: 5 }} />
  </div>
);

// 根据链数据创建下拉菜单项
const items: MenuProps["items"] = chainData.map((chain) => ({
  label: chain.label,
  key: chain.id,
  icon: createLabel(chain.logo, `${chain.label}_logo`)
}));

// 链选择器组件
const ChainSelector: FC = () => {
  // 获取切换链的函数
  const switchChain = useSwitchChain();
  // 获取当前链 ID 和活跃状态
  const { chainId, isActive } = useWeb3React();
  // 获取设备类型
  const { isTablet } = useWindowSize();
  // 管理选中的链状态
  const [selected, setSelected] = useState<{ item: MenuItem | null; label: JSX.Element | null }>({
    item: null,
    label: null
  });

  // 处理链切换的回调函数
  const handleChainChange = useCallback((chainId: string) => {
    const chain = chainData.find((chain) => chain.id === chainId);
    const selectedLabel = chain ? createLabel(chain.logo, `${chain.label}_logo`) : null;
    const selectedItem = items.find((item) => item?.key === chainId) || null;
    setSelected({ item: selectedItem, label: selectedLabel });
  }, []);

  // 当链 ID 变化时更新选中状态
  useEffect(() => {
    if (chainId) {
      handleChainChange(chainId.toString());
    }
  }, [chainId, handleChainChange]);

  // 处理菜单项点击事件
  const onClick: MenuProps["onClick"] = async ({ key }) => {
    try {
      await switchChain(Number(key));
    } catch (error) {
      console.error(`Failed to switch chains: ${error}`);
    }
  };

  // 如果没有链 ID 或未激活则不显示
  if (!chainId || !isActive) return null;

  return (
    <div>
      <Dropdown menu={{ items, onClick }}>
        <Button style={{ ...styles.button, ...styles.item }}>
          {/* 未选择链时显示提示文本 */}
          {!selected.item && <span style={{ marginLeft: "5px" }}>Select Chain</span>}
          {/* 根据设备类型显示不同的选中状态 */}
          {selected.item && isTablet ? (
            // 平板设备上只显示图标
            <div style={{ display: "flex", alignItems: "center", minWidth: "25px" }}>
              <span style={{ paddingTop: "5px" }}>{selected.label}</span>
            </div>
          ) : (
            // 其他设备显示图标和文本
            selected.label && (
              <div style={{ display: "flex", alignItems: "center", minWidth: "100px" }}>
                <span style={{ paddingTop: "5px" }}>{selected.label}</span>
                {/*  @ts-expect-error title is a valid object */}
                <span style={{ marginRight: "10px" }}>{selected.item?.label}</span>
              </div>
            )
          )}
          {/* 下拉箭头图标 */}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default ChainSelector;