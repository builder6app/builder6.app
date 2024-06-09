/*
 * @LastEditTime: 2024-06-06 22:01:28
 * @LastEditors: liaodaxue
 * @customMade: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client';
import { BuilderComponent, useIsPreviewing } from '@builder6/react';
import DefaultErrorPage from 'next/error';

interface BuilderPageProps {
  content: any;
}

export function RenderBuilderContent({ content }: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  if (content || isPreviewing) {
    return <BuilderComponent 
      content={content} 
      model="page" 
    />;
  }

  return <DefaultErrorPage statusCode={404} />;
}
