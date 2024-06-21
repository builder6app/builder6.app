/*
 * @Author: baozhoutao baozhoutao@hotoa.com
 * @Date: 2024-06-19 14:37:27
 * @LastEditors: baozhoutao baozhoutao@hotoa.com
 * @LastEditTime: 2024-06-21 09:44:53
 * @Description: 
 */
'use client';
import { BuilderComponent, useIsPreviewing } from '@builder6/react';
import DefaultErrorPage from 'next/error';
import '@builder6/widgets';

interface BuilderPageProps {
  content: any;
  data: any
}

export function RenderBuilderContent({ content, data }: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();
  console.log(`RenderBuilderContent data`, data, content)
  if (content || isPreviewing) {
    return (
      <BuilderComponent 
        content={content}
        data={data}
        model="page"/>
    );
  }

  return <DefaultErrorPage statusCode={404} />;
}
