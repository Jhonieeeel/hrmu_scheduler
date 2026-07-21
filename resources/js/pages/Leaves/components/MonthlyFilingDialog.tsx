import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import leave from '@/routes/leave';
import { Leave } from '@/types';
import { useForm } from '@inertiajs/react';
import { File } from 'lucide-react';

type FilingProp = {
    leaveData: Leave;
    children: React.ReactNode;
};

export default function MonthlyFilingDialog({
    leaveData,
    children,
}: FilingProp) {
    const form = useForm({
        id: leaveData.id,
        status: leaveData.status,
        remarks: '',
    });

    function handleStatus(e: React.FormEvent) {
        e.preventDefault();

        form.optimistic((props: Leave[]) => ({
            ...props,
            leaves: {
                ...props.leaves,
                data: props.leaves.data.map((leave: Leave) =>
                    leave.id === form.data.id
                        ? { ...leave, status: form.data.status }
                        : leave,
                ),
            },
        }));

        form.submit(leave.update(form.data.id), {
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleStatus}>
                    <DialogHeader className="mb-3">
                        <DialogTitle>Monthly Filing</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mb-3">
                        <Field>
                            <Label htmlFor="name-1">Monthly Status</Label>
                            <Switch
                                checked={Boolean(form.data.status)}
                                onCheckedChange={(value: Leave['status']) =>
                                    form.setData('status', value)
                                }
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Remarks</Label>
                            <Textarea
                                value={form.data.remarks}
                                onChange={(e) =>
                                    form.setData('remarks', e.target.value)
                                }
                                placeholder="Type your message here."
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mb-3">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing && <Spinner />}
                            {form.processing ? 'Saving' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
