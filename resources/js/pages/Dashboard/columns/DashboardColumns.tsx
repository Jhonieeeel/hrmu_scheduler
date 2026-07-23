import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import leave from '@/routes/leave';
import { Leave, User } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import ViewData from '../components/ViewData';

type DashboardProp = {
    name: User['name'];
    cto: Leave[];
    leaves: Leave[];

    cto_count: number;
    leaves_count: number;
};

export const DashboardColumns: ColumnDef<DashboardProp>[] = [
    {
        accessorKey: 'name',
        header: () => (
            <div className="tracking text-xs uppercase">Employee Name</div>
        ),
        cell: ({ row }) => {
            const username = row.original.name;

            return <div>{username}</div>;
        },
    },
    {
        accessorKey: 'cto',
        header: () => (
            <div className="tracking text-xs uppercase">CTO Used</div>
        ),
        cell: ({ row }) => {
            const count = row.original.cto_count;

            return <div>{count}</div>;
        },
    },
    {
        accessorKey: 'leaves',
        header: () => (
            <div className="tracking text-xs uppercase">Leave Used</div>
        ),
        cell: ({ row }) => {
            const count = row.original.leaves_count;

            return <div>{count}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const data = row.original;

            return (
                <ViewData
                    name={data.name}
                    cto={data.cto}
                    leaves={data.leaves}
                />
            );
        },
    },
];
