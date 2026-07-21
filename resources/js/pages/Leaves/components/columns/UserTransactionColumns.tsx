import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import leave from '@/routes/leave';
import { Leave } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    Calendar,
    CalendarMinus2,
    CalendarOff,
    ClockArrowDown,
    icons,
    LucideIcon,
    MoreHorizontal,
    Plane,
    Trash,
    TrendingDown,
} from 'lucide-react';

import {
    differenceInMinutes,
    format,
    isSameDay,
    isSameMonth,
    isSameYear,
    parseISO,
} from 'date-fns';

const leaveIcons: Record<string, LucideIcon> = {
    'sick leave': CalendarOff,
    'vacation leave': Plane,
    'force leave': CalendarMinus2,
    tardiness: ClockArrowDown,
    undertime: TrendingDown,
};

function getLeaveIcon(leaveType: string, eventTag: string): LucideIcon {
    const key = (leaveType || eventTag).toLowerCase();
    return leaveIcons[key] ?? Calendar;
}

export const UserTransactionColumns: ColumnDef<Leave>[] = [
    {
        accessorKey: 'leave_type',
        header: () => (
            <div className="text-left text-[11px] font-medium tracking-wider uppercase">
                Leave Type
            </div>
        ),
        cell: ({ row }) => {
            const { leave_type, event_tag, event_type } = row.original;

            const isAttendance =
                event_tag === 'tardiness' || event_tag === 'undertime';

            const label = isAttendance ? event_tag : leave_type;

            const SelectedIcon = getLeaveIcon(leave_type, event_tag);

            let badgeClass = '';

            if (event_type === 'accrual') {
                badgeClass =
                    'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300';
            } else if (event_tag === 'leave' || event_type === 'deduction') {
                badgeClass =
                    'border-destructive/20 bg-destructive/10 text-destructive';
            } else {
                badgeClass = 'border-accent/20 bg-accent/10 text-accent';
            }

            return (
                <div
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${badgeClass}`}
                >
                    <SelectedIcon className="h-3.5 w-3.5" />
                    {label}
                </div>
            );
        },
    },
    {
        accessorKey: 'balance',
        header: () => (
            <div className="text-left text-[11px] font-medium tracking-wider uppercase">
                Transaction
            </div>
        ),
        cell: ({ row }) => {
            const balance = row.original.balance;
            const isAccrual = row.original.event_type === 'accrual';
            const sign = isAccrual ? '+' : '';

            return (
                <div
                    className={`text-left text-sm font-medium tabular-nums ${
                        isAccrual ? 'text-green-700' : 'text-destructive'
                    }`}
                >
                    {sign}
                    {balance}
                </div>
            );
        },
    },
    {
        accessorKey: 'starts_at',
        header: () => (
            <div className="text-left text-[11px] font-medium tracking-wider uppercase">
                Date info
            </div>
        ),
        cell: ({ row }) => {
            const startsAt = parseISO(row.original.starts_at);
            const endsAt = parseISO(row.original.ends_at);

            let dateLabel = '';

            if (isSameDay(startsAt, endsAt)) {
                dateLabel = format(startsAt, 'MMM d, yyyy');
            } else if (
                isSameMonth(startsAt, endsAt) &&
                isSameYear(startsAt, endsAt)
            ) {
                dateLabel = `${format(startsAt, 'MMM d')}-${format(endsAt, 'd, yyyy')}`;
            } else if (isSameYear(startsAt, endsAt)) {
                dateLabel = `${format(startsAt, 'MMM d')}-${format(endsAt, 'MMM d, yyyy')}`;
            } else {
                dateLabel = `${format(startsAt, 'MMM d, yyyy')}-${format(endsAt, 'MMM d, yyyy')}`;
            }

            return (
                <span className="text-sm text-muted-foreground">
                    {dateLabel}
                </span>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const leaveData = row.original;

            const leaveForm = useForm();

            function handleDelete(e: React.MouseEvent) {
                e.preventDefault();

                leaveForm.submit(leave.destroy(leaveData.id), {
                    preserveState: true,
                });
            }

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
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-destructive hover:text-accent-foreground focus:text-destructive"
                        >
                            {leaveForm.processing ? (
                                <Spinner />
                            ) : (
                                <Trash size={14} className="text-destructive" />
                            )}
                            {leaveForm.processing ? 'Deleting..' : 'Delete'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
