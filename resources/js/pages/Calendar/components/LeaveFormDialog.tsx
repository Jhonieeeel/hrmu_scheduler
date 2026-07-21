import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import DatePicker from '@/pages/reusable-components/DatePicker';
import SelectCombobox from '@/pages/reusable-components/SelectCombobox';
import calendar from '@/routes/calendar';
import leave from '@/routes/leave';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { differenceInDays, isBefore, parseISO } from 'date-fns';

type DialogFormProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    date: string;
    users: User[];
};

const event_types = [
    { id: 1, leave_type: 'Vacation Leave' },
    { id: 2, leave_type: 'Sick Leave' },
    { id: 3, leave_type: 'Force Leave' },
    { id: 4, leave_type: 'Wellness Leave' },
    { id: 5, leave_type: 'CTO' },
    { id: 6, leave_type: 'Offset' },
];

export default function LeaveFormDialog({
    open,
    onOpenChange,
    date,
    users,
}: DialogFormProps) {
    const form = useForm({
        user_id: 0,
        leave_type: '',
        event_type: 'deduction',
        event_tag: 'cto',
        starts_at: date,
        ends_at: date,
        balance: 0,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (
            form.data.leave_type !== 'cto' &&
            form.data.leave_type !== 'offset'
        ) {
            return;
        }

        const startDate = parseISO(form.data.starts_at);
        const endDate = parseISO(form.data.ends_at);

        if (isBefore(endDate, startDate)) {
            form.setError('ends_at', 'End date cannot be before start date');
            return;
        }

        const days = differenceInDays(endDate, startDate) + 1;

        form.transform((data) => ({
            ...data,
            balance: -days,
        }));

        form.submit(leave.store(), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog modal={false} open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader className="mb-2">
                        <DialogTitle>File Leave</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="employee_id">
                                Employee Name
                            </FieldLabel>
                            <SelectCombobox
                                items={users.map((u) => ({
                                    value: u.id,
                                    label: u.name,
                                }))}
                                value={form.data.user_id}
                                onValueChange={(value) =>
                                    form.setData('user_id', Number(value))
                                }
                                placeholder="Select an employee"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="leave_type">
                                Leave type
                            </FieldLabel>
                            <SelectCombobox
                                items={event_types.map((u) => ({
                                    value: u.leave_type.toLowerCase(),
                                    label: u.leave_type,
                                }))}
                                value={form.data.leave_type}
                                onValueChange={(value) =>
                                    form.setData('leave_type', value)
                                }
                                placeholder="Select leave type"
                            />
                        </Field>
                        <Field>
                            <FieldLabel>Start Date</FieldLabel>
                            <DatePicker
                                value={form.data.starts_at}
                                disabled={!form.data.leave_type}
                                placeholder="Select start date"
                                onChange={(date) => {
                                    form.setData('starts_at', date);
                                    form.setData('ends_at', date);
                                }}
                            />
                        </Field>
                        <Field>
                            <FieldLabel>End Date</FieldLabel>
                            <DatePicker
                                value={form.data.ends_at}
                                disabled={!form.data.leave_type}
                                placeholder="Select end date"
                                onChange={(date) => {
                                    form.setData('ends_at', date);
                                }}
                            />
                            <small className="text-xxs text-red-600 dark:text-red-300">
                                {form.errors.ends_at}
                            </small>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <Button type="submit">
                            {form.processing ? <Spinner /> : ''}
                            {form.processing ? 'Saving' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
