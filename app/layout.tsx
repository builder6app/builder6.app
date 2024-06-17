/*
 * @LastEditTime: 2024-06-16 21:37:28
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@/styles/tailwind.css'
import './globals.css';
import { headers } from 'next/headers'
import BuilderJS from '@builder6/builder6.js' 
import { RenderBuilderContent } from '@/components/builder6';
import { getSidebarItemsSection, getSidebarHomeSection } from './_lib/tabs';
import { SidebarLayout } from '@/components/sidebar-layout'
import { Navbar } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader
} from '@/components/sidebar'
import Script from 'next/script';
import { builder, Builder } from '@builder6/sdk';
import { isEmpty } from 'lodash';


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
