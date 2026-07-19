import { Head, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import leave from '@/routes/leave';
import { Filters, Leave, Pagination } from '@/types';
import FilterButton from './components/FilterButton';
import { DataTable } from '../Table/DataTable';
import { MonthlyFilingColumns } from './components/columns/MonthlyFilingColumns';
import { Calendar1Icon } from 'lucide-react';

type LeaveProps = {
    leaves: Pagination<Leave>;
    filters: Filters;
};

export default function Index({ leaves, filters }: LeaveProps) {
    function handleFilter(key: keyof Filters, value: string | null) {
        const newFilters = {
            ...filters,
            [key]: value || undefined,
        };

        router.get(leave.index().url, newFilters, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <>
            <Head title="Leaves" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl md:p-14">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-brand-accent uppercase">
                            <Calendar1Icon className="h-4 w-4" />
                            Month Name
                        </h3>

                        <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground">
                            Monthly Filing Overview
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Monitor team leave entitlements, track utilization
                            trends, and manage pending requests across all
                            departments.
                        </p>
                    </div>

                    <div>
                        <FilterButton
                            filters={filters}
                            handleFilterChange={handleFilter}
                        />
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border">
                    {leaves.data && (
                        <DataTable
                            leaves={leaves}
                            data={leaves.data ?? []}
                            columns={MonthlyFilingColumns}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Leaves',
            href: leave.index(),
        },
    ],
};
