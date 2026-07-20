import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import leave from '@/routes/leave';
import { User } from '@/types';
import { Form, Head, Link, useForm, usePage } from '@inertiajs/react';

import { differenceInDays, format, isValid, parse } from 'date-fns';
import { CalendarIcon, InfoIcon } from 'lucide-react';
import React, { useState } from 'react';

type LeaveProps = {
    users: User[];
};

type LeaveFormProps = {
    user_id: number;
    leave_type: string;
    event_type: string;
    event_tag?: string;
    starts_at: string;
    ends_at: string;
    balance: number;
};

type EventType = {
    id: number;
    leave_type: string;
};

const event_types: EventType[] = [
    { id: 1, leave_type: 'Vacation Leave' },
    { id: 2, leave_type: 'Sick Leave' },
    { id: 3, leave_type: 'Force Leave' },
    { id: 4, leave_type: 'Wellness Leave' },
];

export default function FileLeaveForm() {
    const { users } = usePage<LeaveProps>().props;

    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    const form = useForm<LeaveFormProps>({
        user_id: 0,
        leave_type: '',
        event_type: 'deduction',
        event_tag: 'leave',
        starts_at: '',
        ends_at: '',
        balance: 0,
    });

    function handleSubmit(e: React.SubmitEvent) {
        const days =
            differenceInDays(form.data.ends_at, form.data.starts_at) + 1;

        form.setData({
            ...form.data,
            balance: -days,
        });

        e.preventDefault();
        form.submit(leave.store(), {
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <>
            <Head title="File Leave" />
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
                        File Leave Form
                    </span>
                </div>

                <div>
                    <div className="space-y-2">
                        <h1 className="flex items-center gap-4 text-4xl leading-tight font-bold tracking-tight text-foreground">
                            File Leave Form
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
                                <FieldLabel htmlFor="username">
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
                                            users?.find(
                                                (user) =>
                                                    user.id ===
                                                    form.data.user_id,
                                            )?.name ?? null
                                        }
                                        placeholder="Select an employee"
                                        className="border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
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
                                    Choose an employee to file a leave.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {/* Leave Type */}
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Leave Type</FieldLabel>
                                <Combobox
                                    items={event_types}
                                    onValueChange={(val) => {
                                        form.setData(
                                            'leave_type',
                                            String(val).toLowerCase(),
                                        );
                                        if (
                                            String(val).toLowerCase() ===
                                            'force leave'
                                        )
                                            form.setData(
                                                'event_tag',
                                                'vacation leave',
                                            );
                                    }}
                                >
                                    <ComboboxInput
                                        disabled={!form.data.user_id}
                                        placeholder="Select an event"
                                        className="border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No events found.
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem
                                                    key={item.id}
                                                    value={item.leave_type}
                                                >
                                                    {item.leave_type}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </Field>
                        </FieldGroup>

                        {/* Date */}
                        <FieldGroup className="grid grid-cols-2 gap-4">
                            {/* starts_at */}
                            <Field>
                                <FieldLabel htmlFor="starts-at-trigger">
                                    Start Date
                                </FieldLabel>
                                <Popover
                                    open={startOpen}
                                    onOpenChange={setStartOpen}
                                >
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
                                                              form.data
                                                                  .starts_at,
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
                                                setStartOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FieldDescription className="text-muted-foreground">
                                    Starting date to leave.
                                </FieldDescription>
                            </Field>

                            {/* ends at */}
                            <Field>
                                <FieldLabel htmlFor="ends-at-trigger">
                                    End Date
                                </FieldLabel>
                                <Popover
                                    open={endOpen}
                                    onOpenChange={setEndOpen}
                                >
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
                                                    date
                                                        ? format(
                                                              date,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
                                                );
                                                setEndOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FieldDescription className="text-muted-foreground">
                                    Ending date to leave.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        {/* Alert */}
                        <Field>
                            <Alert className="border-brand-accent/30 bg-brand-accent/10">
                                <InfoIcon className="text-brand-accent" />
                                <AlertTitle className="text-foreground">
                                    Check your balance first
                                </AlertTitle>
                                <AlertDescription className="text-muted-foreground">
                                    Make sure you have sufficient balance before
                                    submitting. Once submitted, requests are
                                    typically processed within 48 hours.
                                </AlertDescription>
                            </Alert>
                        </Field>

                        {/* Button */}
                        <FieldGroup>
                            <div className="flex w-full items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="hover:bg-accent hover:text-accent-foreground"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    data-test="login-button"
                                    className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
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
