import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OpenMD2Card - Markdown 转卡片生成器',
  description: '将 Markdown 文本转换为精美的卡片图像',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}