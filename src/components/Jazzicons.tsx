// 导入 Ant Design 的骨架屏组件
import { Skeleton } from "antd";
// 导入 Jazzicon 生成器和地址转换函数
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

/**
 * 为钱包地址生成独特的几何图案头像
 * @param seed - 钱包地址，用作生成图案的种子
 * @param size - 可选的图标尺寸（像素）
 * @returns JSX 元素 - 返回生成的头像或加载状态
 */
const Jazzicons = ({ seed, size }: { seed: string; size?: number }) => {
  // 如果没有提供地址，显示加载中的头像占位符
  if (!seed) return <Skeleton.Avatar active size={40} />;

  // 如果指定了尺寸，生成指定大小的头像
  if (size) return <Jazzicon seed={jsNumberForAddress(seed)} diameter={size} />;

  // 使用默认尺寸生成头像
  return <Jazzicon seed={jsNumberForAddress(seed)} />;
};

export default Jazzicons;