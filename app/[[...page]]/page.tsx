/*
 * @LastEditTime: 2024-06-16 11:45:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
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
}

const endpointUrl = process.env.B6_CLOUD_API
const apiKey = process.env.B6_CLOUD_PROJECT_SECRET

const bjs = new BuilderJS({endpointUrl, apiKey});
const metaBase = bjs.base("meta-builder6-com");

const getPage = async (pageUrl: string) => {

  const headersList = headers()

  // 从请求头中获取主机名
  const host = headersList.get('host') || 'localhost';

  // 使用正则表达式提取前缀
  let domainName = host?.split('.')[0] || "";
  const domain: any = await metaBase('b6_domains').find(domainName);
  if (!domain) return (<>domain not found</>);

  const {project_id, space} = domain;

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

 
export default async function Page({ params }: PageProps) {

  const pageUrl = '/' + (params.page?.join('/') || '');
  try {

    const page = await getPage(pageUrl) as any;

    if (page && page.builder) {
      const builderJson = JSON.parse(page.builder)
      builderJson.name = page.name;
      return (
        <>
          {/* Render the Builder page */}
          <RenderBuilderContent content={builderJson}/>
        </>
      );
    }

  } catch (error) {
    console.error(error);
  }

  return notFound();
}