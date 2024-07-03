/*
 * @LastEditTime: 2024-06-12 14:38:03
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@/styles/tailwind.css'

import { RenderBuilderContent } from '@/components/builder6';
import { defaultMainMenu, getComponentByApiName, getComponentById, getDomain, getProjectById } from '@/lib/interfaces';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    spaceId: string;
    projectId: string;
    page: string[];
  };
  children: React.ReactNode;
}


export default async function AppLayout( { params, children }: PageProps) {

  const domain = await getDomain() as any;
  if (!domain) return notFound();

  const {project_id, space, hiddenHeader, hiddenFooter} = domain;

  console.log('layout', params)

  const baseId = `spc-${space}`;

  let project = await getProjectById(baseId, project_id);
  if (!project) return notFound();

  
  let headerContent = null;
  if(project.header){
    headerContent = await getComponentById(baseId, project.header as string);
  }
  let mainMenuContent = project?.enable_tabs && (await getComponentByApiName(baseId, "main-menu") || defaultMainMenu);
  let footerContent = null;
  if(project.footer){
    footerContent = await getComponentById(baseId, project.footer as string);
  }
  
  return (
    <>
        {headerContent && (
          <RenderBuilderContent content={headerContent} />
        )}
        {mainMenuContent && (
          <div className='sticky z-10 top-0 left-0 w-full'>
            <RenderBuilderContent content={mainMenuContent} data={{...project}}/>
          </div>
        )}
        {children}
        {footerContent && (
          <RenderBuilderContent content={footerContent} />
        )}
    </>
  );
}
