import calendar from '@/routes/calendar';
import leave from '@/routes/leave';
import { Head, Link } from '@inertiajs/react';
import { EventProp, User } from '@/types';
import LeaveCalendar from './components/LeaveCalendar';

type CalendarProp = {
    calendarEvents: EventProp[];
    users: User[];
};

export default function Index({ calendarEvents, users }: CalendarProp) {
    return (
        <>
            <Head title="Calendar" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 space-y-4 overflow-x-auto rounded-xl md:p-14">
                <div className="mb-4 flex items-center gap-3">
                    <Link
                        className="text-muted-foreground hover:text-foreground"
                        href={leave.index()}
                    >
                        Users
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-semibold text-foreground">
                        Calendar Schedule
                    </span>
                </div>

                <div>
                    <div className="space-y-2">
                        <h1 className="flex items-center gap-4 text-4xl leading-tight font-bold tracking-tight text-foreground">
                            Calendar Scheduling
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Monitor team leave entitlements, track utilization
                            trends, and manage pending requests across all
                            departments.
                        </p>
                    </div>
                </div>
                <div>
                    <LeaveCalendar
                        users={users}
                        calendarEvents={calendarEvents}
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Calendar',
            href: calendar.index(),
        },
    ],
};
