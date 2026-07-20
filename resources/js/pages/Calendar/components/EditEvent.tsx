import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { CalendarCheck, CalendarDays, CalendarIcon } from 'lucide-react';
import { calendarConfig } from '../constants/Constants';
import calendar from '@/routes/calendar';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { differenceInDays, format, isValid, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    user: User;
    user_id: number;
    status: boolean;
    calendarTitle: string;
    calendarTheme: {
        lightColors: {
            main: string;
            container: string;
            onContainer: string;
        };
    };
};

type Props = {
    calendarEvent: CalendarEvent;
    setMode: (mode: string) => void;
};

const leaveTypes = [
    'vacation leave',
    'sick leave',
    'force leave',
    'wellness leave',
];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return {
        date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }),
        time: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }),
    };
}

export default function EditEvent({ calendarEvent, setMode }: Props) {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    const form = useForm({
        user_id: calendarEvent.user_id,
        id: calendarEvent.id,
        leave_type: '',
        event_type: 'deduction',
        event_tag: 'leave',
        starts_at: '',
        ends_at: '',
        balance: 0,
        status: Boolean(calendarEvent.status),
    });

    const start = formatDate(calendarEvent.start);
    const end = formatDate(calendarEvent.end);

    function handleUpdate(e: React.SubmitEvent) {
        const days =
            differenceInDays(form.data.ends_at, form.data.starts_at) + 1;

        form.setData({
            ...form.data,
            balance: -days,
        });

        e.preventDefault();
        form.submit(calendar.update(Number(form.data.id)), {
            onSuccess: () => {},
            preserveState: true,
        });
    }

    return (
        <form onSubmit={handleUpdate}>
            {/* Leave type select */}
            <div className="border-b px-5 py-3.5">
                <Label className="mb-1.5 block text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    Leave type
                </Label>
                <p className="mb-1.5 text-xs text-muted-foreground">
                    Currently:{' '}
                    <span className="font-medium text-foreground capitalize">
                        {calendarEvent.calendarTitle}
                    </span>
                </p>
                <Select
                    value={form.data.leave_type}
                    onValueChange={(value) => form.setData('leave_type', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {leaveTypes.map((data, index) => {
                            const swatch =
                                calendarConfig[data]?.lightColors?.main ??
                                'var(--muted-foreground)';
                            return (
                                <SelectItem key={index} value={data}>
                                    <span className="flex items-center gap-2 capitalize">
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ backgroundColor: swatch }}
                                        />
                                        {data}
                                    </span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                {form.errors.leave_type && (
                    <p className="mt-1 text-xs text-destructive">
                        {form.errors.leave_type}
                    </p>
                )}
            </div>

            <FieldGroup className="grid grid-cols-2 gap-4 px-5 py-4">
                {/* starts_at */}
                <Field>
                    <FieldLabel htmlFor="starts-at-trigger">
                        Start Date
                    </FieldLabel>
                    <Popover open={startOpen} onOpenChange={setStartOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id="starts-at-trigger"
                                variant="outline"
                                disabled={!form.data.leave_type}
                                className="group w-full justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-brand-accent group-hover:text-accent-foreground" />
                                <span
                                    className={cn(
                                        'truncate',
                                        !form.data.starts_at &&
                                            'text-muted-foreground group-hover:text-accent-foreground',
                                    )}
                                >
                                    {form.data.starts_at &&
                                    isValid(
                                        parse(
                                            form.data.starts_at,
                                            'yyyy-MM-dd',
                                            new Date(),
                                        ),
                                    )
                                        ? format(
                                              parse(
                                                  form.data.starts_at,
                                                  'yyyy-MM-dd',
                                                  new Date(),
                                              ),
                                              'PPP',
                                          )
                                        : 'Select start date'}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden border-border bg-popover p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={
                                    form.data.starts_at
                                        ? parse(
                                              form.data.starts_at,
                                              'yyyy-MM-dd',
                                              new Date(),
                                          )
                                        : undefined
                                }
                                defaultMonth={
                                    form.data.starts_at
                                        ? parse(
                                              form.data.starts_at,
                                              'yyyy-MM-dd',
                                              new Date(),
                                          )
                                        : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    form.setData(
                                        'starts_at',
                                        date ? format(date, 'yyyy-MM-dd') : '',
                                    );
                                    form.setData(
                                        'ends_at',
                                        date ? format(date, 'yyyy-MM-dd') : '',
                                    );
                                    setStartOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <FieldDescription className="text-muted-foreground">
                        Starting date of leave.
                    </FieldDescription>
                </Field>

                {/* ends_at */}
                <Field>
                    <FieldLabel htmlFor="ends-at-trigger">End Date</FieldLabel>
                    <Popover open={endOpen} onOpenChange={setEndOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id="ends-at-trigger"
                                disabled={!form.data.starts_at}
                                variant="outline"
                                className="group w-full justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-brand-accent group-hover:text-accent-foreground" />
                                <span className="truncate">
                                    {form.data.ends_at &&
                                    isValid(
                                        parse(
                                            form.data.ends_at,
                                            'yyyy-MM-dd',
                                            new Date(),
                                        ),
                                    )
                                        ? format(
                                              parse(
                                                  form.data.ends_at,
                                                  'yyyy-MM-dd',
                                                  new Date(),
                                              ),
                                              'PPP',
                                          )
                                        : 'Select end date'}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden border-border bg-popover p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={
                                    form.data.ends_at
                                        ? parse(
                                              form.data.ends_at,
                                              'yyyy-MM-dd',
                                              new Date(),
                                          )
                                        : undefined
                                }
                                defaultMonth={
                                    form.data.ends_at
                                        ? parse(
                                              form.data.ends_at,
                                              'yyyy-MM-dd',
                                              new Date(),
                                          )
                                        : undefined
                                }
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    form.setData(
                                        'ends_at',
                                        date ? format(date, 'yyyy-MM-dd') : '',
                                    );
                                    setEndOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <FieldDescription className="text-muted-foreground">
                        Ending date of leave.
                    </FieldDescription>
                </Field>
            </FieldGroup>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-5 py-3.5">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        form.reset();
                        setMode('view');
                    }}
                >
                    Back
                </Button>
                <Button type="submit" size="sm" disabled={form.processing}>
                    {form.processing ? 'Saving...' : 'Save changes'}
                </Button>
            </div>
        </form>
    );
}
