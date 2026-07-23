import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Leave } from '@/types';
import { format } from 'date-fns';

type ViewDataProp = {
    name: string;
    cto: Leave[];
    leaves: Leave[];
};

export default function ViewData({
    name,
    cto = [],
    leaves = [],
}: ViewDataProp) {
    const hasHistory = cto.length > 0 || leaves.length > 0;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View History</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{name}&apos;s Leave History</DialogTitle>
                </DialogHeader>

                <div className="max-h-[50vh] space-y-6 overflow-y-auto pr-2">
                    {cto.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                CTO
                            </h3>
                            <div className="space-y-2">
                                {cto.map((data, index) => (
                                    <LeaveRow
                                        key={data.id ?? index}
                                        data={data}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {leaves.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Leaves
                            </h3>
                            <div className="space-y-2">
                                {leaves.map((leave, index) => (
                                    <LeaveRow
                                        key={leave.id ?? index}
                                        data={leave}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {!hasHistory && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            No leave history yet.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function LeaveRow({ data }: { data: Leave }) {
    return (
        <div className="flex items-center justify-between rounded-md border p-3">
            <div>
                <p className="text-sm font-medium">
                    {format(new Date(data.starts_at), 'MMM d')} –{' '}
                    {format(new Date(data.ends_at), 'MMM d')}
                </p>
                <p className="text-xs text-muted-foreground">
                    {data.leave_type}
                    {data.remarks ? ` · ${data.remarks}` : ''}
                </p>
            </div>
            <Badge variant={data.status ? 'default' : 'secondary'}>
                {data.status ? 'Approved' : 'Pending'}
            </Badge>
        </div>
    );
}
