import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { CalendarIcon, Filter } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';

type DateRangeProp = {
    date: DateRange;
    setDate: Dispatch<SetStateAction<DateRange | undefined>>;
    handleFilter: (range: DateRange | undefined) => void;
};

export default function DateRangePicker({
    date,
    setDate,
    handleFilter,
}: DateRangeProp) {
    const handleReset = () => {
        const today = new Date();

        const defaultRange: DateRange = {
            from: startOfMonth(today),
            to: endOfMonth(today),
        };

        setDate(defaultRange);
        handleFilter(defaultRange);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Filter className="h-4 w-4 text-accent" />
                    Filter by
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-88 rounded-xl p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-accent" />
                        <span className="font-medium">Filters</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground"
                    >
                        Clear
                    </Button>
                </div>

                {/* Body */}
                <div className="space-y-4 p-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Date Range
                        </label>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 w-full justify-start font-normal hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />

                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(
                                                    date.from,
                                                    'MMM dd, yyyy',
                                                )}{' '}
                                                –{' '}
                                                {format(
                                                    date.to,
                                                    'MMM dd, yyyy',
                                                )}
                                            </>
                                        ) : (
                                            format(date.from, 'MMM dd, yyyy')
                                        )
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Select a date range
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="start"
                                className="w-auto rounded-xl p-0"
                            >
                                <Calendar
                                    mode="range"
                                    selected={date}
                                    defaultMonth={date?.from}
                                    onSelect={handleFilter}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t bg-muted/40 px-4 py-3">
                    <Button variant="ghost" onClick={handleReset}>
                        Reset
                    </Button>

                    <Button>Apply</Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
