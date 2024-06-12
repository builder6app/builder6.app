/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-12 10:18:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-12 11:00:31
 */
import Builder6 from '@builder6/builder6.js';

const NEXT_PUBLIC_B6_CDN_API_KEY = process.env.NEXT_PUBLIC_B6_CDN_API_KEY;

const endpointUrl = process.env.NEXT_PUBLIC_B6_API_URL
const apiKey = process.env.NEXT_PUBLIC_B6_API_KEY

export const builder6 = new Builder6({endpointUrl, apiKey})
export const base = builder6.base("meta-builder6-com");

export const getProjectId = (host?: string)=>{
  // 使用正则表达式提取前缀
  let projectId = NEXT_PUBLIC_B6_CDN_API_KEY;

  if (host?.endsWith("builder6.app")) {
    projectId = host.split('.')[0]
  }
  return projectId;
}

export const getRecord = async (tableId: string, id: string)=>{
    try {
        return await base(tableId).find(id);
    } catch (error: any) {
        console.error(`getRecord error`, error.message)
        return null
    }
}