/*
 * @LastEditTime: 2024-06-12 14:38:03
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@/styles/tailwind.css'
import BuilderJS from '@builder6/builder6.js' 

import { RenderBuilderContent } from '@/components/builder6';
import LiquidTemplate from '@/components/liquid-template';
import { headers } from 'next/headers';

interface PageProps {
  params: {
    spaceId: string;
    projectId: string;
    page: string[];
  };
  children: React.ReactNode;
}

const NAV_DEFAULT = `
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 border-b"
        style="backdrop-filter: saturate(180%) blur(20px);background: var(--localnav-background-stuck, rgba(251,251,253,0.8)); transition: background 0.5s cubic-bezier(0.28, 0.11, 0.32, 1);">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" class="flex items-center">
                <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">{{name}}</span>
            </a>
            <div class="flex lg:hidden">
                <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    {% for tab in tabs %}
                    <li>
                        <a href="{{ tab.url }}" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">{{ tab.name }}</a>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    </nav>
`

const endpointUrl = process.env.B6_CLOUD_API
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET

const bjs = new BuilderJS({endpointUrl, apiKey});
const metaBase = bjs.base("meta-builder6-com");


export default async function AppLayout( { params, children }: PageProps) {

  
  const headersList = headers()

  // 从请求头中获取主机名，开发环境可配置环境变量
  const host = process.env.NEXT_PUBLIC_B6_HOST_OVERRIDE || headersList.get('host');

  // 使用正则表达式提取前缀
  let domainName = host?.split('.')[0] || "";
  const domain: any = await metaBase('b6_domains').find(domainName);
  console.log('Retrieved domain', domain.id);
  if (!domain) return (<>domain not found</>);

  const {project_id, space} = domain.fields;

  // 使用正则表达式提取前缀
  let projectId = project_id;
  const baseId = "meta-builder6-com";
  // const baseId = `spc-${params.spaceId}`;

  if (!projectId) return (<>projectId not found</>);

  let headerJson = {};

  const base = await bjs.base(baseId);
  
  const project = await base('b6_projects').find(projectId); 
  if (!project) return (<>project not found:{projectId}</>);

  const headerId = project?.fields.header as string;   
  if (headerId) {
    const header = await base('b6_components').find(headerId);
    if (header?.fields.builder) {
      try {
        headerJson = JSON.parse(header?.fields.builder as string);
        // console.log('Retrieved builderJson', builderJson);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const enable_tabs = project?.fields.enable_tabs;
  const tabs = project?.fields.tabs;

  return (
    <>
        {headerJson && (
          <RenderBuilderContent content={headerJson} />
        )}
        {enable_tabs && tabs && (
          <LiquidTemplate template={NAV_DEFAULT} 
            data={{...project.fields}} 
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              width: '100%',
              height: '52px',
              minWidth: '1280px',
              zIndex: 9997
            }}
          />
        )}
        {children}
    </>
  );
}
