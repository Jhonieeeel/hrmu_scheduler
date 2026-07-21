import { User } from '@/types';
import { createViewMonthGrid } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import '@schedule-x/theme-default/dist/index.css';
import { useEffect, useState } from 'react';
import 'temporal-polyfill/global';
import CustomEventModal from './CustomEventModal';
import { calendarConfig } from '../constants/Constants';
import '@schedule-x/theme-shadcn/dist/index.css';
import LeaveFormDialog from './LeaveFormDialog';
import { cn } from '@/lib/utils';

type EventProp = {
    id: number;
    title: string;
    end: Temporal.PlainDate;
    start: Temporal.PlainDate;
    user_id: number;
    user: User;
    status: boolean;
    calendarTitle: string;
    calendarId: string;
};

type LeaveCalendarProps = {
    calendarEvents: EventProp[];
    users: User[];
};

export default function LeaveCalendar({
    calendarEvents,
    users,
}: LeaveCalendarProps) {
    const eventService = useState(() => createEventsServicePlugin())[0];

    const [open, setOpen] = useState(false);

    const [event, setEvent] = useState<EventProp>({
        id: 0,
        title: '',
        start: '',
        end: '',
        user: [],
        status: false,
        user_id: 0,
        calendarTitle: '',
        calendarTheme: '',
    });

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');

    const calendar = useCalendarApp({
        views: [createViewMonthGrid()],
        events: [],
        calendars: calendarConfig,
        theme: 'shadcn',
        monthGridOptions: {
            nEventsPerDay: 50,
        },
        callbacks: {
            onEventClick(event) {
                setEvent({
                    id: event.id,
                    title: event.calendarTitle ?? '',
                    start: event.start.toString(),
                    end: event.end.toString(),
                    user_id: event.user_id,
                    user: event.user,
                    calendarTitle: event.calendarTitle,
                    calendarTheme: calendarConfig[event.calendarId],
                });

                setOpen(true);
            },
            onClickDate(date) {
                setOpenDialog((value) => !value);
                setSelectedDate(date.toString());
            },
        },
        plugins: [eventService],
    });

    useEffect(() => {
        if (calendarEvents && calendarEvents.length > 0) {
            const formatted = calendarEvents.map((event) => ({
                ...event,
                start: Temporal.PlainDate.from(event.start),
                end: Temporal.PlainDate.from(event.end),
            }));
            eventService.set(formatted);
        }
    }, [calendarEvents]);

    return (
        <div className="max-w-auto mx-auto">
            <div
                className={cn(
                    'transition-opacity duration-200',
                    openDialog && 'pointer-events-none opacity-40',
                )}
            >
                <ScheduleXCalendar calendarApp={calendar} />
            </div>

            {event && (
                <CustomEventModal
                    tModal
                    open={open}
                    onOpenChange={setOpen}
                    calendarEvent={event}
                />
            )}

            {users && openDialog && (
                <LeaveFormDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    date={selectedDate}
                    users={users}
                />
            )}
        </div>
    );
}
