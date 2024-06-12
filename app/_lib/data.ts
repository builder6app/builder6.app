/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 10:03:32
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-12 11:09:20
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/lib/data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getRecord } from '@/lib/b6BuilderDB'

const PROJECT_OBJECT = "b6_projects";
const PAGE_OBJECT = "b6_pages";
const COMPONENT_OBJECT = "b6_components";

export async function getProject(id: string) {
    try {
        const result = await getRecord(PROJECT_OBJECT, id);
        return result;
    } catch (error) {
        return null
    }
}

export async function getPage(id: string) {
    try {
        const result = await getRecord(PAGE_OBJECT, id);
        return result;
    } catch (error) {
        return null;
    }
}

export async function getComponent(id: string) {
    try {
        const result = await getRecord(COMPONENT_OBJECT, id);
        return result;
    } catch (error) {
        return null;
    }
}

export function getPageSchema(page: any) {
    try {
        if (page?.amis_schema) {
            return JSON.parse(page.amis_schema)
        }
        else {
            return {}
        }
    } catch (error) {
        console.log("===getPageSchema====error=====", error);
        return {}
    }
}