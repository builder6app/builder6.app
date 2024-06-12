/*
 * @LastEditTime: 2024-06-12 16:46:20
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@/styles/tailwind.css'
import './globals.css';
import { headers } from 'next/headers'
import Builder6 from '@builder6/builder6.js';
import { RenderBuilderContent } from '@/components/builder6';
import { getRecord, getProjectId } from '@/lib/b6BuilderDB';
import { getProject, getPage, getComponent } from './_lib/data';
import { getSidebarItemsSection, getSidebarHomeSection } from './_lib/tabs';
import { SidebarLayout } from '@/components/sidebar-layout'
import { Navbar } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader
} from '@/components/sidebar'


export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const headersList = headers()

  // 从请求头中获取主机名
  const host = headersList.get('host') || 'localhost';

  // 使用正则表达式提取前缀
  let projectId = getProjectId(host);

  if (!projectId) return (<>projectId not found</>);

  let builderJson = {};
  // const project = await base('b6_projects').find(projectId);
  const project: any = await getProject(projectId);
  if (!project) return (<>project not found:{projectId}</>);
  console.log('Retrieved project', project?.id);

  const headerId = project?.fields.header as string;
  if (headerId) {
    const header = await getComponent(headerId)
    console.log('Retrieved component', header?.id);
    if (header?.fields.builder) {
      try {
        builderJson = JSON.parse(header?.fields.builder as string);
        // console.log('Retrieved builderJson', builderJson);
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

  return (
    <html lang="zh">
      <head>
      </head>
      <body>
        {builderJson && (
          <RenderBuilderContent content={builderJson} />
        )}
        {
          enable_tabs ?
            (
              <SidebarLayout
                topOffset={80}
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
