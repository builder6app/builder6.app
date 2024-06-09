/*
 * @LastEditTime: 2024-06-06 21:50:02
 * @LastEditors: liaodaxue
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { builder } from '@builder6/sdk';
import Head from 'next/head';
import { headers } from 'next/headers'

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
  let projectId = process.env.NEXT_PUBLIC_B6_CDN_API_KEY || '';
  if (host.endsWith("builder6.app")) {
    projectId = host.split('.')[0]
  }

  // Replace with your Public API Key
  builder.init(projectId);

  const pageId = (props?.params?.page?.join('/') || '');
  const content = await builder
    .get('page', {
      entry: pageId,
      query: {
        data: {
          myCustomField: 'someValue',
          someNumber: { $ne: 2 }
        }
      },
      userAttributes: {
        urlPath: '/' + (props?.params?.page?.join('/') || ''),
      },
      prerender: false,
    })
    .toPromise();

  console.log(content)

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