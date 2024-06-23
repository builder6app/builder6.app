/*
 * @LastEditTime: 2024-06-23 14:54:19
 * @LastEditors: baozhoutao baozhoutao@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import React from 'react';
import { builder, Builder } from '@builder6/sdk';
import Head from 'next/head';
import { headers } from 'next/headers'
import BuilderJS from '@builder6/builder6.js' 

import { RenderBuilderContent } from '@/components/builder6';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { adminBjs, getDomain, getProjectById, getProjectPageByUrl } from '@/lib/interfaces';


interface PageProps {
  params: {
    page: string[];
  };
  searchParams: any
}

const getPageInitCtx = (params: any, searchParams:any, page: any)=>{
  return {
    params: params,
    searchParams: searchParams,
    base: adminBjs.base(`spc-${page.space}`)
  }
}

const runPageInitFunction = async (params: any, searchParams: any, page: any)=>{
  if (!page.enabled_init) return {data: {}}
  const ctx = getPageInitCtx(params, searchParams, page);
  const dynamicAsyncFunction = eval(`(async function(params, searchParams, base) { ${page.init_function} })`);
  const result = await dynamicAsyncFunction(ctx.params, ctx.searchParams, ctx.base)
  return result
}


export async function generateMetadata({ params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  
  const domain = await getDomain() as any;

  const pageUrl = '/' + (params.page?.join('/') || '');
  const baseId = `spc-${domain.space}`;

  const project = await getProjectById(baseId, domain.project_id);
  if (!project) return {};

  const page = await getProjectPageByUrl(baseId, project._id as string, pageUrl);
  if (!page) return {};
  return  {
    title: `${page.name} - ${project.name}`,
    // description: page.description || project.description
  }
}

const unpkgUrl = process.env.B6_UNPKG_URL || 'https://unpkg.steedos.cn';
const amisVersion = process.env.B6_AMIS_VERSION || '6.5.0';
const amisTheme = process.env.B6_AMIS_THEME|| 'antd';

 
export default async function Page({ params, searchParams }: PageProps) {

  const domain = await getDomain() as any;
  if (!domain) return notFound();

  const pageUrl = '/' + (params.page?.join('/') || '');
  const baseId = `spc-${domain.space}`;

  const project = await getProjectById(baseId, domain.project_id);
  if (!project) return notFound();

  try {

    const page = await getProjectPageByUrl(baseId, project._id as string, pageUrl) as any;
    if (!page) return notFound();
    const { data = {} } = await runPageInitFunction(params, searchParams, page); 

    if (page && page.builder) {
      const builderJson = JSON.parse(page.builder)
      builderJson.name = page.name;
      return (
        <>

          <script src={`${unpkgUrl}/amis@${amisVersion}/sdk/sdk.js`}></script>
          <link rel="stylesheet" href={`${unpkgUrl}/amis@${amisVersion}/sdk/${amisTheme}.css`} />
          <link rel="stylesheet" href={`${unpkgUrl}/@salesforce-ux/design-system@2.24.3/css/icons/base/index.css`}/>

          {/* Render the Builder page */}
          <RenderBuilderContent content={builderJson} data={data}/>
        </>
      );
    }

  } catch (error) {
    console.error('error', error);
  }

  return notFound();
}