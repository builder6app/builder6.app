/*
 * @LastEditTime: 2024-06-16 21:37:28
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@/styles/tailwind.css'
import './globals.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="zh">
      <head>
        <link rel="icon" type="image/svg" href="/logo.svg"/>
      </head>
      <body>
          {children}
      </body>
    </html>
  );
}
