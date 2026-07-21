import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarIcon, Clock3, Timer, TimerOffIcon } from 'lucide-react';
import { HOURS_TABLE, MINUTES_TABLE } from './constant/Conversion';
import { differenceInMinutes, format } from 'date-fns';
import { useState } from 'react';
import undertime from '@/routes/undertime';
import leave from '@/routes/leave';

type UndertimeProps = {
    users: User[];
};

export default function UndertimeForm({ users }: UndertimeProps) {
    const form = useForm({
        user_id: '',
        leave_type: 'vacation leave',
        event_type: 'deduction',
        event_tag: '',
        balance: 0,
        starts_at: '',
        ends_at: '',
    });

    const [time, setTime] = useState('08:00:00');
    const [open, setOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        const formattedStart = form.data.starts_at
            ? `${form.data.starts_at} 08:00:00`
            : '';

        const formattedEnd = form.data.ends_at
            ? `${form.data.ends_at} ${time}`
            : '';

        const totalMinutes = differenceInMinutes(
            new Date(formattedEnd),
            new Date(formattedStart),
        );

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const convertedHours = HOURS_TABLE[hours] ?? 0;
        const convertedMinutes = MINUTES_TABLE[minutes] ?? 0;

        const totalUndertime = Number(
            (convertedHours + convertedMinutes).toFixed(3),
        );

        form.setData({
            ...form.data,
            balance: -totalUndertime,
            starts_at: formattedStart,
            ends_at: formattedEnd,
        });

        form.submit(undertime.store(), {
            onSuccess: () => {
                form.reset();

                setTime('08:00:00');
            },
        });
    }

    return (
        <>
            <Head title="Undertime Form" />
            <div className="flex h-full w-full max-w-7xl flex-1 flex-col gap-4 space-y-4 overflow-x-auto rounded-xl md:p-14">
                <div className="mb-4 flex items-center gap-3">
                    <Link
                        className="text-muted-foreground hover:text-foreground"
                        href={leave.index()}
                    >
                        Users
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-semibold text-foreground">
                        Undertime Form
                    </span>
                </div>

                <div>
                    <div className="space-y-2">
                        <h1 className="flex items-center gap-4 text-4xl leading-tight font-bold tracking-tight text-foreground">
                            Undertime Form
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Monitor team leave entitlements, track utilization
                            trends, and manage pending requests across all
                            departments.
                        </p>
                    </div>
                </div>

                <FieldSet className="w-full max-w-2xl rounded-md shadow-md md:p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* User */}
                        <FieldGroup>
                            <Field>
                                <FieldLabel className="text-foreground">
                                    Employee Name
                                </FieldLabel>

                                <Combobox
                                    onValueChange={(value) => {
                                        form.setData('user_id', Number(value));
                                    }}
                                    items={users}
                                >
                                    <ComboboxInput
                                        value={
                                            users.find(
                                                (user) =>
                                                    user.id ===
                                                    form.data.user_id,
                                            )?.name ?? null
                                        }
                                        placeholder="Select employee"
                                        className="border-input focus:border-ring focus:ring-ring"
                                    />

                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No users found.
                                        </ComboboxEmpty>

                                        <ComboboxList>
                                            {(user) => (
                                                <ComboboxItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>

                                <FieldDescription className="text-muted-foreground">
                                    Select the employee involved in this report.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {/* Report Type */}
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Type of Report</FieldLabel>

                                <ToggleGroup
                                    type="single"
                                    value={form.data.event_tag}
                                    disabled={!form.data.user_id}
                                    onValueChange={(value) =>
                                        value &&
                                        form.setData('event_tag', value)
                                    }
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {/* Tardiness */}
                                    <ToggleGroupItem
                                        value="tardiness"
                                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-destructive/30 transition-all duration-300 hover:border-destructive/60 hover:bg-destructive/10 data-[state=on]:scale-[1.02] data-[state=on]:border-destructive data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground data-[state=on]:shadow-lg"
                                    >
                                        <Clock3 className="size-4" />
                                        <span className="font-medium">
                                            Tardiness
                                        </span>
                                    </ToggleGroupItem>

                                    {/* Undertime */}
                                    <ToggleGroupItem
                                        value="undertime"
                                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-brand-accent/30 transition-all duration-300 hover:border-brand-accent/60 hover:bg-brand-accent/10 data-[state=on]:scale-[1.02] data-[state=on]:border-brand-accent data-[state=on]:bg-brand-accent data-[state=on]:text-brand-accent-foreground data-[state=on]:shadow-lg"
                                    >
                                        <Timer className="size-4" />
                                        <span className="font-medium">
                                            Undertime
                                        </span>
                                    </ToggleGroupItem>
                                </ToggleGroup>

                                <FieldDescription>
                                    Choose the attendance issue type.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {/* Date and time */}
                        <FieldGroup>
                            <Field>
                                {/* Date */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <FieldLabel>Date</FieldLabel>

                                        <Popover
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    disabled={
                                                        !form.data.event_tag
                                                    }
                                                    className="w-full justify-start border-input text-left font-normal hover:border-brand-accent/50 hover:bg-brand-accent/5 hover:text-foreground"
                                                >
                                                    <CalendarIcon className="mr-2 size-4 text-brand-accent" />
                                                    {form.data.starts_at
                                                        ? form.data.starts_at
                                                        : 'Select date'}
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="rounded-xl border-border bg-popover shadow-xl">
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        form.data.starts_at
                                                            ? new Date(
                                                                  form.data
                                                                      .starts_at,
                                                              )
                                                            : undefined
                                                    }
                                                    defaultMonth={
                                                        form.data.starts_at
                                                            ? new Date(
                                                                  form.data
                                                                      .starts_at,
                                                              )
                                                            : undefined
                                                    }
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        form.setData(
                                                            'starts_at',
                                                            date
                                                                ? format(
                                                                      date,
                                                                      'yyyy-MM-dd',
                                                                  )
                                                                : '',
                                                        );

                                                        form.setData(
                                                            'ends_at',
                                                            date
                                                                ? format(
                                                                      date,
                                                                      'yyyy-MM-dd',
                                                                  )
                                                                : '',
                                                        );

                                                        setOpen(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <FieldLabel>Time</FieldLabel>

                                        <Input
                                            type="time"
                                            disabled={!form.data.ends_at}
                                            value={time}
                                            step="1"
                                            onChange={(e) =>
                                                setTime(e.target.value)
                                            }
                                            className="border-input bg-background focus:border-ring focus:ring-ring"
                                        />
                                    </div>
                                </div>

                                <FieldDescription>
                                    Select the date and duration.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {/* action */}
                        <FieldGroup>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>

                                <Button
                                    className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
                                    onClick={handleSubmit}
                                    disabled={form.processing}
                                >
                                    {form.processing && <Spinner />}
                                    Submit
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </FieldSet>
            </div>
        </>
    );
}
