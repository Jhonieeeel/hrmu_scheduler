<?php

namespace App\Actions\Leave;

use App\Models\Leave;

class CalendarDeleteAction
{
    public function handle(Leave $leave): bool
    {
        return $leave->delete();
    }
}
