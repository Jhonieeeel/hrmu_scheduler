import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Calendar1,
    FolderGit2,
    LayoutGrid,
    PlaneIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import leave from '@/routes/leave';
import calendar from '@/routes/calendar';
import dashboard from '@/routes/dashboard';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Leaves',
        href: leave.index(),
        icon: PlaneIcon,
    },
    {
        title: 'Calendar',
        href: calendar.index(),
        icon: Calendar1,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
