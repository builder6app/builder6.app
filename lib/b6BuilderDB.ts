/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-12 10:18:37
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-16 09:41:36
 */
import BuilderJS from '@builder6/builder6.js' 

const NEXT_PUBLIC_B6_CDN_API_KEY = process.env.NEXT_PUBLIC_B6_CDN_API_KEY;
const NEXT_PUBLIC_B6_APP_HOST = process.env.NEXT_PUBLIC_B6_APP_HOST;

const endpointUrl = process.env.NEXT_PUBLIC_B6_API_URL
const apiKey = process.env.NEXT_PUBLIC_B6_API_KEY

export const bjs = new BuilderJS({endpointUrl, apiKey});
export const base = bjs.base("meta-builder6-com");

// export const getProjectId = (host?: string) => {
//   console.log("===getProjectId===host===", host)
//   // 使用正则表达式提取前缀
//   let projectId = NEXT_PUBLIC_B6_CDN_API_KEY;

//   if (host?.endsWith("builder6.app")) {
//     projectId = host.split('.')[0]
//   }
//   return projectId;
// }

export const getProjectId = async (host?: string) => {
  // console.log("===getProjectId===host===", host)
  // 使用正则表达式提取前缀
  if (!host?.endsWith("builder6.app")) {
    host = NEXT_PUBLIC_B6_APP_HOST;
  }

  let projectId = "";

  let firstPath = host?.split('.')[0] || "";
  // console.log("===getProjectId===firstPath===", firstPath)
  let match = firstPath.match(/^app-(.*)/);
  if (match) {
    // 获取'app-'后面的字符串
    projectId = match[1];
  } else {
    let projectDomain = firstPath;
    // 根据projectDomain从db中查到对应的domain，获取其projectId
    if (projectDomain) {
      const cloudDomain: any = await base('b6_domains').find(projectDomain);
      // console.log("===getProjectId===cloudDomain===", cloudDomain)
      if (!cloudDomain) {
        throw new Error(`Domain: ${projectDomain} Not Found!`);
      }
      projectId = cloudDomain.fields?.project_id;
    }
  }
  // console.log("===getProjectId===projectId===", projectId)
  return projectId;
}
