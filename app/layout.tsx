/*
 * @LastEditTime: 2024-06-09 18:29:31
 * @LastEditors: Jack Zhuang 50353452+hotlong@users.noreply.github.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './globals.css';
import { headers } from 'next/headers'
import Builder6 from '@builder6/builder6.js';
import { RenderBuilderContent } from '@/components/builder6';


export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const headersList = headers()

  // 从请求头中获取主机名
  const host = headersList.get('host') || 'localhost';

  // 使用正则表达式提取前缀
  let projectId = process.env.NEXT_PUBLIC_B6_CDN_API_KEY;
  let componentId = '';

  if (host.endsWith("builder6.app")) {
    projectId = host.split('.')[0]
  }

  if (!projectId)  return (<>project not found</>);


  const endpointUrl = process.env.NEXT_PUBLIC_B6_API_URL
  const apiKey = process.env.NEXT_PUBLIC_B6_API_KEY
  
  const builder6 = new Builder6({endpointUrl, apiKey})
  var base = builder6.base("meta-builder6-com");
  
  let builderJson = {};
  const project = await base('b6_projects').find(projectId);
  console.log('Retrieved project', project?.id);
  const headerId = project?.fields.header as string;
  if (headerId){
    const header = await base('b6_components').find(headerId)
    console.log('Retrieved component', header?.id);
    if (header?.fields.builder) {
      try {
        builderJson = JSON.parse(header?.fields.builder as string);
        console.log('Retrieved builderJson', builderJson?.id);
      } catch(e) {
        console.error(e);
      }
    }
  }
  
  return (
    <html lang="zh">
      <head>   
      </head>
      <body>
        {builderJson && (
          <RenderBuilderContent content={builderJson} />
        )}
        {children}
      </body>
    </html>
  );
}
