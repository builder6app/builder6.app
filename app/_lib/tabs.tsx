/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2024-06-03 10:03:32
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-06-16 11:44:01
 * @FilePath: /builder6/frontend/src/app/(interfaces)/interfaces/lib/data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    SidebarSection,
    SidebarItem,
    SidebarLabel
} from '@/components/sidebar';
import {
    TicketIcon,
    HomeIcon
} from '@heroicons/react/20/solid'


export async function getSidebarItemsSection(project: any) {
    const tabs: any = project?.tabs || [];
    const tabsConverted: any = [];
    for (var i = 0; i < tabs.length; i++) {
        tabsConverted.push(tabs[i]);
    }
    return (
        <SidebarSection>
            {
                tabsConverted.map((tab: any, tabIndex: number) => (
                    <SidebarItem href={tab.url} key={tabIndex} target={tab.is_new_window ? "_blank" : ""}>
                        <TicketIcon />
                        <SidebarLabel>{tab.name}</SidebarLabel>
                    </SidebarItem>
                ))
            }
        </SidebarSection>
    );
}

export async function getSidebarHomeSection(project: any) {
    return (
        <SidebarSection className="max-lg:hidden">
            <SidebarItem href="/">
                <HomeIcon />
                <SidebarLabel>{project?.name}</SidebarLabel>
            </SidebarItem>
        </SidebarSection>
    );
}