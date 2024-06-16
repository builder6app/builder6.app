/*
 * @LastEditTime: 2024-06-16 11:36:04
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { builder, Builder } from '@builder6/sdk';
import Head from 'next/head';
import { headers } from 'next/headers'

import { bjs, base, getProjectId } from '@/lib/b6BuilderDB';
import { RenderBuilderContent } from '@/components/builder6';


interface PageProps {
  params: {
    page: string[];
  };
}

export default async function Page(props: PageProps) {
  const headersList = headers()

  // 从请求头中获取主机名
  const host = headersList.get('host') || 'localhost';

  // 使用正则表达式提取前缀
  let projectId = await getProjectId(host);

  // Replace with your Public API Key
  builder.init(projectId);
  Builder.overrideHost = process.env.NEXT_PUBLIC_B6_CDN_URL;
  console.log("======projectId===11===", projectId, host);

  const pageId = (props?.params?.page?.join('/') || '');
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/' + (props?.params?.page?.join('/') || ''),
      },
      prerender: false,
    })
    .toPromise();
  console.log(content?.id)

  return (
    <>
      <Head>
        <title>{content?.data.title}</title>
      </Head>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} />
    </>
  );
}