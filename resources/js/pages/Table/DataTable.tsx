'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Leave, Pagination } from '@/types';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    leaves: Pagination<Leave>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    leaves,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader className="bg-sidebar">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="border-sidebar-border"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="font-semibold text-sidebar-foreground"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="hover:bg-accent/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {leaves.last_page > 1 && (
                <div className="m-4">
                    {leaves.links.map((link, index) => {
                        if (!link.url) {
                            return (
                                <span
                                    key={index}
                                    className="px-3 py-2 text-sm"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        }

                        return (
                            <Link
                                href={link.url}
                                key={index}
                                prefetch
                                className={cn(
                                    'rounded-md border px-3 py-2 text-sm transition-colors',
                                    link.active
                                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                                        : 'bg-brand text-brand-foreground hover:bg-brand/90 active:bg-brand/80',
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
