import leave from '@/routes/leave';
import { Filters, Leave, Pagination, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar1Icon, CalendarDays, Clock, Plus } from 'lucide-react';
import FilterButton from './components/FilterButton';
import { UserTransactionColumns } from './components/columns/UserTransactionColumns';
import { DataTable } from '../Table/DataTable';
import BalanceCard from './components/BalanceCard';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import undertime from '@/routes/undertime';

type UserBalanceProps = {
    balances: [
        {
            leave_type: string;
            estimated: number;
            current: number;
            previous: number;
            used: number;
        },
    ];
    transactions: Pagination<Leave>;
    filters: Filters;
    user: User;
};

export default function UserBalance({
    filters,
    transactions,
    balances,
    user,
}: UserBalanceProps) {
    function handleFilter(key: keyof Filters, value: string | null) {
        const newFilters = {
            ...filters,
            [key]: value || undefined,
        };

        router.get(leave.show(user.id).url, newFilters, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="User Balance" />
            <div className="flex h-full flex-1 flex-col gap-4 space-y-4 overflow-x-auto rounded-xl md:p-14">
                {/* breadcrumbs */}
                <div className="mb-4 flex items-center gap-3">
                    <Link
                        className="text-muted-foreground hover:text-foreground"
                        href={leave.index()}
                    >
                        Users
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-semibold text-foreground">
                        {user.name}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-brand-accent uppercase">
                            <Calendar1Icon className="h-4 w-4" />
                            Month Name
                        </h3>

                        <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground">
                            {user.name} Balance
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Monitor team leave entitlements, track utilization
                            trends, and manage pending requests across all
                            departments.
                        </p>
                    </div>

                    {/* Forms */}
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90">
                                    <Plus className="h-4 w-4" />
                                    New Request
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={leave.create()}>
                                        <CalendarDays className="h-4 w-4" />
                                        Leave Form
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={undertime.create()}>
                                        <Clock className="h-4 w-4" />
                                        Undertime Form
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <FilterButton
                            filters={filters}
                            handleFilterChange={handleFilter}
                        />
                    </div>
                </div>

                <div className="grid w-full grid-cols-3 gap-8">
                    {balances.map((balance) => (
                        <BalanceCard key={balance.leave_type} data={balance} />
                    ))}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border">
                    {transactions.data && (
                        <DataTable
                            leaves={transactions}
                            data={transactions.data ?? []}
                            columns={UserTransactionColumns}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

UserBalance.layout = {
    breadcrumbs: [
        {
            title: 'User Balance',
        },
    ],
};
