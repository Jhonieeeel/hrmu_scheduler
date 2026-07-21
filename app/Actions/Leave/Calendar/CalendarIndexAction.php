<?php

namespace App\Actions\Leave\Calendar;

use App\Models\Leave;
use Carbon\Carbon;

class CalendarIndexAction
{
    public function __invoke()
    {
        return Leave::query()
            ->with('user:id,name')
            ->where('event_type', 'deduction')
            ->whereIn('event_tag', ['leave', 'vacation leave', 'cto', 'offset'])
            ->select([
                'id',
                'user_id',
                'leave_type',
                'starts_at',
                'ends_at',
            ])
            ->get()
            ->map(function ($leave) {
                return [
                    'id'            => (string) $leave->id,
                    'user_id'       => $leave->user_id,
                    'title'         => $leave->user->name,
                    'start'         => Carbon::parse($leave->starts_at)->format('Y-m-d'),
                    'end'           => Carbon::parse($leave->ends_at)->format('Y-m-d'),
                    'user'          => $leave->user,
                    'calendarTitle' => $leave->leave_type,
                    'calendarId'    => $leave->leave_type,
                ];
            });
    }
}
