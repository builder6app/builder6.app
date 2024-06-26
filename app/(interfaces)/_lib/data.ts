/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 10:03:32
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-13 11:00:31
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/lib/data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

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