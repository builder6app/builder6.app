import BuilderJS from '@builder6/builder6.js' 
import { headers } from 'next/headers';


export const endpointUrl = process.env.B6_CLOUD_API
export const apiKey = process.env.B6_CLOUD_PROJECT_SECRET
export const adminBjs = new BuilderJS({endpointUrl, apiKey});

export const getProjectById = async (baseId: string, project_id:string) => {

  const base = await adminBjs.base(baseId);


  try {

    const project = (await base('b6_projects').find(project_id)).fields;
    console.log('Retrieved project', project._id, project.name);
    return project

  } catch (e) {
    console.log(e)
    return null
  }
}
  
export const getProjectBySlug = async (baseId: string, projectSlug:string) => {

  const base = await adminBjs.base(baseId);


  const projects = await base('b6_projects').select({
    'filterByFormula': `slug === "${projectSlug}"`
  }).firstPage();
  

  if (!projects || projects.length === 0) {
    return null;
  }

  const project = projects[0].fields;
  console.log('Retrieved project', project._id, project.name);

  return project
}
  
export const getProjectPageByUrl = async (baseId: string, projectId:string, pageUrl: string) => {

  const base = await adminBjs.base(baseId);

  const pages = await base("b6_pages").select({
    'filterByFormula': `AND(url === "${pageUrl}", project_id === "${projectId}")`
  }).firstPage();

  if (!pages || pages.length === 0) {
    return null;
  }
  
  const page = pages[0].fields
  console.log('Retrieved page', page._id, page.name);
  return page
}

  
export const getPageBlocks = async (baseId: string, pageId:string) => {

  const base = await adminBjs.base(baseId);

  const blocks = await base("b6_blocks").select({
    'filterByFormula': `page_id === "${pageId}"`
  }).firstPage();

  if (!blocks || blocks.length === 0) {
    return null;
  }
  
  console.log('Retrieved blocks', pageId, blocks.length);
  return blocks.map(block => block.fields) as any;
}
  
export const getComponentByApiName = async (baseId: string, api_name : string) => {

  const base = await adminBjs.base(baseId);

  const components = await base('b6_components').select({
    'filterByFormula': `api_name === "${api_name}"`
  }).firstPage();

  if (components && components.length === 1) {
    try {
      console.log('Retrieved components', components[0]?.fields._id);
      return JSON.parse(components[0]?.fields.builder as string);
      // console.log('Retrieved builderJson', builderJson);
    } catch (e) {
      console.error(e);
    }
  }

  return null
}

export const getComponentById = async (baseId: string, componentId : string) => {

  const base = await adminBjs.base(baseId);

  try {
    const component = (await base('b6_components').find(componentId));
  
    console.log('Retrieved component', component?.fields._id);
    return JSON.parse(component?.fields.builder as string);
  } catch (e) {
    console.error(e);
  }

  return null
}

function getDomainName() {
  const headersList = headers()
  // 从请求头中获取主机名，开发环境可配置环境变量
  const host = process.env.NEXT_PUBLIC_B6_HOST_OVERRIDE || headersList.get('host') || '';

  const domainParts = host.split('.');
  const domainName = domainParts[0];

  if (host.endsWith('.builder6.app')) {
    // 使用特定算法处理 .builder6.app 域名
    return domainName; // 这里可以替换为你需要的算法
  } else {
    // 返回完整域名
    return host;
  }
}

export const getDomain = async () => {

  const metaBase = adminBjs.base("meta-builder6-com");
  
  // 使用正则表达式提取前缀
  let domainName = getDomainName();
  if (!domainName) return null;
  
  const domain: any = await metaBase('b6_domains').find(domainName);
  console.log('Retrieved domain', domain.id);
  if (!domain) return null;
  return domain.fields;

}
export const defaultMainMenu = {
  "id": "1ff1c787-1b59-48ef-ac0c-04cc45848d57",
  "data": {
    "cssCode": ".builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.sr-only) {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border-width: 0\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.mx-auto) {\n    margin-left: auto;\n    margin-right: auto\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.ml-1) {\n    margin-left: 0.25rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.mt-4) {\n    margin-top: 1rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.block) {\n    display: block\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.flex) {\n    display: flex\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.inline-flex) {\n    display: inline-flex\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.hidden) {\n    display: none\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.size-6) {\n    width: 1.5rem;\n    height: 1.5rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.min-h-\\[52px\\]) {\n    min-height: 52px\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.w-full) {\n    width: 100%\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.max-w-screen-xl) {\n    max-width: 1280px\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.flex-col) {\n    flex-direction: column\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.flex-wrap) {\n    flex-wrap: wrap\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.items-center) {\n    align-items: center\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.justify-between) {\n    justify-content: space-between\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.self-center) {\n    align-self: center\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.whitespace-nowrap) {\n    white-space: nowrap\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.rounded-lg) {\n    border-radius: 0.5rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.border-b) {\n    border-bottom-width: 1px\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.border-gray-100) {\n    --tw-border-opacity: 1;\n    border-color: rgb(243 244 246 / var(--tw-border-opacity))\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.bg-white\\/80) {\n    background-color: rgb(255 255 255 / 0.8)\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.p-2) {\n    padding: 0.5rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.px-4) {\n    padding-left: 1rem;\n    padding-right: 1rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.py-2) {\n    padding-top: 0.5rem;\n    padding-bottom: 0.5rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.py-3) {\n    padding-top: 0.75rem;\n    padding-bottom: 0.75rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.pl-3) {\n    padding-left: 0.75rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.pr-4) {\n    padding-right: 1rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.text-lg) {\n    font-size: 1.125rem;\n    line-height: 1.75rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.text-sm) {\n    font-size: 0.875rem;\n    line-height: 1.25rem\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.font-semibold) {\n    font-weight: 600\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.text-gray-800) {\n    --tw-text-opacity: 1;\n    color: rgb(31 41 55 / var(--tw-text-opacity))\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.backdrop-blur-lg) {\n    --tw-backdrop-blur: blur(16px);\n    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n            backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.backdrop-saturate-150) {\n    --tw-backdrop-saturate: saturate(1.5);\n    -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n            backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.transition-colors) {\n    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    transition-duration: 150ms\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.duration-500) {\n    transition-duration: 500ms\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.ease-in-out) {\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.hover\\:bg-gray-100:hover) {\n    --tw-bg-opacity: 1;\n    background-color: rgb(243 244 246 / var(--tw-bg-opacity))\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.hover\\:bg-gray-50:hover) {\n    --tw-bg-opacity: 1;\n    background-color: rgb(249 250 251 / var(--tw-bg-opacity))\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.focus\\:outline-none:focus) {\n    outline: 2px solid transparent;\n    outline-offset: 2px\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.focus\\:ring-2:focus) {\n    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)\n}\n.builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.focus\\:ring-gray-200:focus) {\n    --tw-ring-opacity: 1;\n    --tw-ring-color: rgb(229 231 235 / var(--tw-ring-opacity))\n}\n@media (min-width: 1024px) {\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:order-1) {\n        order: 1\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:mt-0) {\n        margin-top: 0px\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:flex) {\n        display: flex\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:hidden) {\n        display: none\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:w-auto) {\n        width: auto\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:flex-row) {\n        flex-direction: row\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:justify-normal) {\n        justify-content: normal\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:space-x-8 > :not([hidden]) ~ :not([hidden])) {\n        --tw-space-x-reverse: 0;\n        margin-right: calc(2rem * var(--tw-space-x-reverse));\n        margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)))\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:border-0) {\n        border-width: 0px\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:border-l) {\n        border-left-width: 1px\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:border-black\\/10) {\n        border-color: rgb(0 0 0 / 0.1)\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:p-0) {\n        padding: 0px\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:px-6) {\n        padding-left: 1.5rem;\n        padding-right: 1.5rem\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:pl-6) {\n        padding-left: 1.5rem\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:pr-6) {\n        padding-right: 1.5rem\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:hover\\:bg-transparent:hover) {\n        background-color: transparent\n    }\n    .builder-component-1ff1c787-1b59-48ef-ac0c-04cc45848d57 :is(.lg\\:hover\\:text-primary-700:hover) {\n        --tw-text-opacity: 1;\n        color: rgb(29 78 216 / var(--tw-text-opacity))\n    }\n}\n  ",
    "blocks": [
      {
        "@type": "@builder.io/sdk:Element",
        "@version": 2,
        "layerName": "Page",
        "id": "builder-d9a31c73-5321-40a2-bad4-33bed7fbab21",
        "component": {
          "name": "Builder6:Liquid",
          "options": {
            "template": `
<nav
  class="min-h-[52px] bg-white/80 text-gray-800 text-sm px-4 lg:px-6 py-3 backdrop-saturate-150 backdrop-blur-lg transition-colors duration-500 ease-in-out">
  <div class="flex flex-wrap justify-between lg:justify-normal items-center mx-auto max-w-screen-xl">
      <a href="/" class="flex items-center lg:pr-6">
          <span class="self-center text-lg font-semibold whitespace-nowrap ">{{name}}</span>
      </a>
      <div class="flex lg:hidden">
          <button data-collapse-toggle="mobile-menu-nav" type="button" class="inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 aria-controls="mobile-menu-nav" aria-expanded="false">
                  <span class="sr-only">Open main menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
              </button>
      </div>
      <div class="hidden justify-left items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-nav">
          <ul
              class="flex flex-col mt-4 font-sm lg:flex-row lg:space-x-8 lg:mt-0 lg:border-l lg:border-black/10 lg:pl-6">
              {% for tab in tabs %}
              <li>
                  <a href="{{ tab.url }}"
                      class="block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0">{{
                      tab.name }}</a>
              </li>
              {% endfor %}
          </ul>
      </div>
  </div>
</nav>
            `,
            "data": {}
          }
        },
        "responsiveStyles": {
          "large": {
            "display": "flex",
            "flexDirection": "column",
            "position": "relative",
            "flexShrink": "0",
            "boxSizing": "border-box"
          }
        }
      }
    ]
  }
}