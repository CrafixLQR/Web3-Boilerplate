// 导入 React 核心功能和类型
import React, { CSSProperties, useEffect, useState } from "react";

// 导入 Web3React 钩子和 Ant Design 组件
import { useWeb3React } from "@web3-react/core";
import { Skeleton } from "antd";

// 导入地址格式化工具
import { getEllipsisTxt } from "utils/formatters";

// 导入头像组件
import Jazzicons from "../Jazzicons";

// 定义组件样式
const styles = {
  addressBox: {
    height: "36px",
    display: "flex",
    gap: "5px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    alignItems: "center",
    justifyContent: "space-around"
  },
  address: {
    display: "inline-flex",
    alignItems: "center",
    gap: "1rem"
  }
};

// 定义组件属性接口
export interface AddressProps {
  style: CSSProperties | undefined;  // 自定义样式
  avatar: string;                    // 头像位置（'left' 或 'right'）
  size: number | undefined;          // 地址显示长度
  copyable: boolean;                 // 是否可复制
}

// 地址显示组件
const Address: React.FC<AddressProps> = (props) => {
  // 获取当前连接的账户
  const { account } = useWeb3React();
  // 管理地址状态
  const [address, setAddress] = useState<string>();
  // 管理复制按钮点击状态
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // 当账户变化时更新地址
  useEffect(() => {
    if (account !== undefined) setAddress(account);
  }, [account]);

  // 处理复制按钮点击效果
  useEffect(() => {
    if (isClicked === true)
      setTimeout(() => {
        setIsClicked(false);
      }, 5000);  // 5秒后重置复制状态
  }, [isClicked]);

  // 地址未加载时显示骨架屏
  if (address === undefined) return <Skeleton paragraph={{ rows: 1, width: "100%" }} title={false} active />;

  return (
    <div style={{ ...styles.addressBox, ...props.style }}>
      <div style={styles.address}>
        {/* 左侧头像 */}
        {props.avatar === "left" && <Jazzicons seed={address} />}
        {/* 显示完整或截断的地址 */}
        <p>{props.size ? getEllipsisTxt(address, props.size) : address}</p>
      </div>
      {/* 右侧头像 */}
      {props.avatar === "right" && <Jazzicons seed={address} />}
      {/* 复制功能 */}
      {props.copyable && (isClicked ? <Check /> : <Copy address={address} setIsClicked={setIsClicked} />)}
    </div>
  );
};

export default Address;

// 复制按钮属性接口
interface CopyProps {
  address: string;                                           // 要复制的地址
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>; // 设置点击状态的函数
}

// 复制按钮组件（SVG 图标）
const Copy: React.FC<CopyProps> = ({ address, setIsClicked }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="#1780FF"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ cursor: "pointer" }}
    onClick={() => {
      navigator.clipboard.writeText(address);  // 复制地址到剪贴板
      setIsClicked(true);                     // 设置点击状态
    }}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15 3v4a1 1 0 0 0 1 1h4" />
    <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
    <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
    <title id="copy-address">Copy Address</title>
  </svg>
);

// 复制成功检查标记组件（SVG 图标）
const Check: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="#21BF96"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
    <title id="copied-address">Copied!</title>
  </svg>
);