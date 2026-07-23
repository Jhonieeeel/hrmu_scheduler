import { Head, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import dashboard from '@/routes/dashboard';
import { Filters, Leave, User } from '@/types';
import { useEffect, useState } from 'react';
import DateRangePicker from './components/DateRangePicker';
import { addDays, endOfMonth, format, parseISO, startOfMonth } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar1Icon } from 'lucide-react';
import { DataTable } from '../Table/DataTable';
import { DashboardColumns } from './columns/DashboardColumns';

type DashboardProps = {
    filters: {
        start: string;
        end: string;
    };
    dashboardItems: [name: User, cto: Leave[], leaves: Leave[]];
};

export default function Dashboard({ filters, dashboardItems }: DashboardProps) {
    const today = new Date();

    const [date, setDate] = useState<DateRange | undefined>({
        from: parseISO(filters.start) ?? startOfMonth(today),
        to: parseISO(filters.end) ?? endOfMonth(today),
    });

    console.log(dashboardItems);

    const handleFilter = (range: DateRange | undefined) => {
        setDate(range);

        router.get(
            dashboard.index().url,
            {
                start: range?.from
                    ? format(range.from, 'yyyy-MM-dd')
                    : undefined,
                end: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const startMonth = format(new Date(filters.start), 'MMM');
    const endMonth = format(new Date(filters.end), 'MMM');

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl md:p-14">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-widest text-brand-accent uppercase">
                            <Calendar1Icon className="h-4 w-4" />
                            {startMonth === endMonth
                                ? startMonth
                                : `${startMonth} - ${endMonth}`}
                        </h3>

                        <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground">
                            Dashboard Overview
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground"></p>
                    </div>

                    <DateRangePicker
                        date={date}
                        setDate={setDate}
                        handleFilter={handleFilter}
                    />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <DataTable
                        data={dashboardItems.data}
                        columns={DashboardColumns}
                        leaves={dashboardItems.links}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard.index(),
        },
    ],
};
