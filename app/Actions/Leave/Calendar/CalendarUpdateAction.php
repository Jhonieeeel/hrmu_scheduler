<?php

namespace App\Actions\Leave\Calendar;

use App\Data\LeaveData;
use App\Models\Leave;
use Carbon\Carbon;

class CalendarUpdateAction
{
    public function handle(Leave $leave, LeaveData $data): Leave
    {
        $leave->update($data->toArray());

        return $leave->fresh();
    }
}
