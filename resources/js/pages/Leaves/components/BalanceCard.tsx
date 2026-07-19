import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    CalendarDays,
    Stethoscope,
    TrendingDown,
    Wallet,
} from 'lucide-react';

type LeaveCardProps = {
    data: {
        leave_type: string;
        previous: number;
        current: number;
        used: number;
        estimated: number | null;
    };
};

const leaveConfig: Record<
    string,
    {
        icon: LucideIcon;
        colorClass: string;
        dotClass: string;
    }
> = {
    'vacation leave': {
        icon: CalendarDays,
        colorClass: 'text-chart-3',
        dotClass: 'bg-chart-3',
    },
    'sick leave': {
        icon: Stethoscope,
        colorClass: 'text-chart-4',
        dotClass: 'bg-chart-4',
    },
    'force leave': {
        icon: AlertTriangle,
        colorClass: 'text-destructive',
        dotClass: 'bg-destructive',
    },
};

export default function BalanceCard({ data }: LeaveCardProps) {
    const config =
        leaveConfig[data.leave_type] ?? leaveConfig['vacation leave'];

    const Icon = config.icon;

    const isForceLeave = data.leave_type === 'force leave';

    const balanceColor = isForceLeave
        ? 'text-muted-foreground'
        : 'text-brand-accent';

    const footerColor = isForceLeave ? 'text-destructive' : 'text-brand-accent';

    const unused = isForceLeave
        ? data.current.toFixed(1)
        : (data.estimated ?? 0).toFixed(3);

    return (
        <Card className="w-full overflow-hidden py-0">
            <div className={`h-1 w-full ${config.dotClass}`} />

            <CardHeader className="space-y-1 border-b border-border pt-4 pb-4">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground capitalize">
                    <Icon className={`size-4 ${config.colorClass}`} />
                    {data.leave_type}
                </CardTitle>

                <CardDescription>
                    {isForceLeave ? 'Fixed allocation' : 'Monthly accrual'}
                </CardDescription>

                <div>
                    {isForceLeave ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Fixed: 5 days
                        </span>
                    ) : (
                        <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs font-medium text-brand-accent">
                            +1.25 next mo.
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                <p className={`text-3xl font-semibold ${balanceColor}`}>
                    {data.current.toFixed(3)}
                </p>

                <p className="mb-4 text-xs text-muted-foreground">
                    Current balance
                </p>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wallet className="size-4" />
                            Previous
                        </div>

                        <span className="font-medium text-foreground">
                            {data.previous.toFixed(3)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wallet className="size-4" />
                            Current
                        </div>

                        <span className="font-medium text-foreground">
                            {data.current.toFixed(3)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingDown className="size-4" />
                            Used
                        </div>

                        <span className="font-medium text-destructive">
                            -{data.used.toFixed(0)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border">
                <span className="text-sm font-medium text-foreground">
                    {isForceLeave
                        ? 'Unused (deducts VL)'
                        : 'Estimated next month'}
                </span>

                <span className={`text-base font-semibold ${footerColor}`}>
                    {unused}
                </span>
            </CardFooter>
        </Card>
    );
}
