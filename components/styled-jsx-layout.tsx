/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-09 15:30:47
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-09 15:41:03
 */
import StyledJsxRegistry from './registry';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StyledJsxRegistry>{children}</StyledJsxRegistry>;
}