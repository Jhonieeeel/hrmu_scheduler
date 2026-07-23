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
import { Leave } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import MonthlyFilingDialog from '../MonthlyFilingDialog';

export const MonthlyFilingColumns: ColumnDef<Leave>[] = [
    {
        accessorKey: 'user.name',
        header: () => (
            <div className="tracking text-xs uppercase">Employe Name</div>
        ),
    },
    {
        accessorKey: 'status',
        header: () => <div className="tracking text-xs uppercase">Status</div>,
        cell: ({ row }) => {
            const status = row.original.status;

            const badgeColor = status
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';

            return (
                <Badge className={`${badgeColor}`}>
                    {status ? 'Completed' : 'Pending'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user_id = row.original.user_id;

            const leaveData = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={leave.show(user_id)}>View Balance</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <MonthlyFilingDialog leaveData={leaveData}>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                Filing
                            </DropdownMenuItem>
                        </MonthlyFilingDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
