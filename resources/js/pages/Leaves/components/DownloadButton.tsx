import { Button } from '@base-ui/react';
import { FileSpreadsheet, Filter } from 'lucide-react';
import React from 'react';

export default function DownloadButton() {
    function handleDownload() {}

    return (
        <Button
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground hover:bg-accent/80"
            type="button"
        >
            <FileSpreadsheet className="h-4 w-4" />
            Download
        </Button>
    );
}
