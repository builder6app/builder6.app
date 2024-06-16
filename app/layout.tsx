/*
 * @LastEditTime: 2024-06-16 15:32:34
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


const endpointUrl = process.env.B6_CLOUD_API
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET

const bjs = new BuilderJS({endpointUrl, apiKey});
const metaBase = bjs.base("meta-builder6-com");


export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const headersList = headers()

  // 从请求头中获取主机名，开发环境可配置环境变量
  const host = process.env.NEXT_PUBLIC_B6_HOST_OVERRIDE || headersList.get('host');

  // 使用正则表达式提取前缀
  let domainName = host?.split('.')[0] || "";
  const domain: any = await metaBase('b6_domains').find(domainName);
  if (!domain) return (<>domain not found</>);

  const {project_id, space} = domain;

  const spaceBase = bjs.base(`spc-${space}`);
  let builderJson = {};
  const project: any = await spaceBase('b6_projects').find(project_id);
  if (!project) return (<>project not found:{project_id}</>);

  const headerId = project?.fields.header as string;
  if (headerId) {
    const header = await spaceBase('b6_components').find(headerId);
    console.log('Retrieved component', header?.id);
    if (header?.fields.builder) {
      try {
        builderJson = JSON.parse(header?.fields.builder as string);
        console.log('Retrieved builderJson', builderJson);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const enable_tabs = project?.fields.enable_tabs;
  let sidebarItemsSection, sidebarHomeSection;
  if (enable_tabs) {
    sidebarItemsSection = await getSidebarItemsSection(project?.fields);
    sidebarHomeSection = await getSidebarHomeSection(project?.fields);
  }

  const unpkgUrl = Builder.settings["unpkgUrl"] || 'https://unpkg.steedos.cn';
  const amisVersion = Builder.settings["amisVersion"] || '6.5.0';
  const amisTheme = Builder.settings["amisTheme"] || 'antd';

  return (
    <html lang="zh">
      <head>
        <Script src={`${unpkgUrl}/amis@${amisVersion}/sdk/sdk.js`} strategy="beforeInteractive" />
        <link rel="stylesheet" href={`${unpkgUrl}/amis@${amisVersion}/sdk/${amisTheme}.css`} />
      </head>
      <body>
        {builderJson && (
          <RenderBuilderContent content={builderJson} />
        )}
        {
          enable_tabs ?
            (
              <SidebarLayout
                topOffset={ isEmpty(builderJson) ? 0 : 80}
                className="abc"
                navbar={
                  <Navbar>
                  </Navbar>
                }
                sidebar={
                  <Sidebar>
                    <SidebarHeader>
                      {sidebarHomeSection}
                    </SidebarHeader>
                    <SidebarBody>
                      {sidebarItemsSection}
                    </SidebarBody>
                  </Sidebar>
                }
              >
                {/* The page content */}
                {children}
              </SidebarLayout>
            ) :
            (children)
        }
      </body>
    </html>
  );
}
