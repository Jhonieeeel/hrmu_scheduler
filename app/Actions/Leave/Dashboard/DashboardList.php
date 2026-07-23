<?php

namespace App\Actions\Leave\Dashboard;

use App\Models\Leave;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class DashboardList
{
    public function transactions(?Carbon  $startingDate, ?Carbon $endingDate)
    {
        $users = User::query()
            ->whereHas('leave', function ($query) use ($startingDate, $endingDate) {
                $query->whereBetween('starts_at', [$startingDate, $endingDate]);
            })
            ->paginate(10);

        $users->getCollection()->transform(function ($user) use ($startingDate, $endingDate) {
            $records = $user->leave()
                ->whereBetween('starts_at', [$startingDate, $endingDate])
                ->get();

            return [
                'name' => $user->name,

                'cto' => $records
                    ->whereIn('leave_type', ['cto', 'offset'])
                    ->values(),
                'cto_count' => $records
                    ->where('leave_type', 'cto')->count(),

                'leaves' => $records
                    ->where('event_type', 'deduction')
                    ->whereIn('event_tag', [
                        'leave',
                        'vacation leave',
                    ])
                    ->values(),

                'leaves_count' => $records
                    ->where('event_type', 'deduction')
                    ->whereIn('event_tag', [
                        'leave',
                        'vacation leave',
                    ])->count()
            ];
        });

        return $users;

        // $transactions = Leave::query()
        //     ->with('user:id,name')
        //     ->whereBetween('starts_at', [$startingDate, $endingDate])
        //     ->get()
        //     ->groupBy('user_id');

        // return $transactions->map(function ($records) {
        //     return [
        //         'name' => $records->first()->user->name,

        //         'cto' => $records
        //             ->where('leave_type', 'cto')
        //             ->values(),

        //         'leaves' => $records
        //             ->where('event_type', 'deduction')
        //             ->whereIn('event_tag', [
        //                 'leave',
        //                 'vacation leave',
        //                 'cto',
        //                 'offset',
        //             ])
        //             ->values(),
        //     ];
        // })->values();
    }
}
