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
    <nav class="min-h-[52px] bg-white/80 text-gray-800 px-4 lg:px-6 py-2.5 border-b backdrop-saturate-150 backdrop-blur-lg bg-opacity-80 transition-colors duration-500 ease-in-out">
        <div class="flex flex-wrap justify-between lg:justify-normal items-center mx-auto max-w-screen-xl">
            <a href="/" class="flex items-center lg:pr-6">
                <span class="self-center text-xl font-semibold whitespace-nowrap ">{{name}}</span>
            </a>
            <div class="flex lg:hidden">
                <button data-collapse-toggle="mobile-menu-nav" type="button" class="inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 aria-controls="mobile-menu-nav" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
            <div class="hidden justify-left items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-nav">
                <ul class="flex flex-col mt-4 font-sm lg:flex-row lg:space-x-8 lg:mt-0 lg:border-l lg:pl-6">
                    {% for tab in tabs %}
                    <li>
                        <a href="{{ tab.url }}" class="block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0">{{ tab.name }}</a>
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
  // const baseId = "meta-builder6-com";
  const baseId = `spc-${space}`;

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
              zIndex: 9997
            }}
          />
        )}
        {children}
    </>
  );
}
