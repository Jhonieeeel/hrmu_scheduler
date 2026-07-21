import { Spinner } from '@/components/ui/spinner';
import leave from '@/routes/leave';
import { Filters } from '@/types';
import { Button } from '@base-ui/react';
import { router, useForm } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import { useEffect } from 'react';

type ButtonProps = {
    filters: Filters;
    flash: {
        downloadUrl: string;
    };
};

export default function DownloadButton({ filters, flash }: ButtonProps) {
    console.log('Download BUtton', filters);

    const form = useForm({
        month: filters.month,
        year: filters.year,
    });

    function handleDownload() {
        form.setData({
            month: filters.month ?? '',
            year: filters.year ?? '',
        });

        form.get(leave.export().url);
    }

    useEffect(() => {
        if (flash?.downloadUrl) {
            window.location.assign(flash?.downloadUrl);
        }
    }, [flash?.downloadUrl]);

    return (
        <Button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground hover:bg-accent/80"
            type="button"
        >
            {form.processing ? (
                <Spinner className="h-4 w-4" />
            ) : (
                <FileSpreadsheet className="h-4 w-4" />
            )}
            {form.processing ? 'Downloading' : 'Download'}
        </Button>
    );
}
