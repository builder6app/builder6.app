/*
 * @LastEditTime: 2024-06-21 10:49:03
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


interface PageProps {
  params: {
    page: string[];
  };
  searchParams: any
}

const endpointUrl = process.env.B6_CLOUD_API
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET

const bjs = new BuilderJS({endpointUrl, apiKey});
const metaBase = bjs.base("meta-builder6-com");

const getPage = async (pageUrl: string) => {
  const headersList = headers()

  // 从请求头中获取主机名，开发环境可配置环境变量
  const host = process.env.NEXT_PUBLIC_B6_HOST_OVERRIDE || headersList.get('host');

  // 使用正则表达式提取前缀
  let domainName = host?.split('.')[0] || "";
  const domain: any = await metaBase('b6_domains').find(domainName);
  console.log('Retrieved domain', domain.id);
  if (!domain) return (<>domain not found</>);

  const {project_id, space} = domain.fields;

  const base = await bjs.base(`spc-${space}`);

  const pages = await base("b6_pages").select({
    'filterByFormula': `AND(url === "${pageUrl}", project_id === "${project_id}")`
  }).firstPage();

  if (!pages || pages.length === 0) {
    return null;
  }
  
  const page = pages[0].fields as {name: string, builder: any};

  return page;
}

const getPageInitCtx = (params: any, searchParams:any, page: any)=>{
  return {
    params: params,
    searchParams: searchParams,
    base: bjs.base(`spc-${page.space}`)
  }
}

const runPageInitFunction = async (params: any, searchParams: any, page: any)=>{
  const ctx = getPageInitCtx(params, searchParams, page);
  const fun: any = new Function('params', 'searchParams', 'base', page.init_function)
  const result = fun(ctx.params, ctx.searchParams, ctx.base) || {}
  return result
}


export async function generateMetadata({ params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  
  const pageUrl = '/' + (params.page?.join('/') || '');

  const page = await getPage(pageUrl) as any;
  return {
    title: page?.name,
    // openGraph: {
    //   images: ['/some-specific-page-image.jpg', ...previousImages],
    // },
  }
}

const unpkgUrl = Builder.settings["unpkgUrl"] || 'https://unpkg.steedos.cn';
const amisVersion = Builder.settings["amisVersion"] || '6.5.0';
const amisTheme = Builder.settings["amisTheme"] || 'antd';

 
export default async function Page({ params, searchParams }: PageProps) {

  const pageUrl = '/' + (params.page?.join('/') || '');
  try {

    const page = await getPage(pageUrl) as any;
    // console.log('Retrieved page', page.name, page.builder)
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