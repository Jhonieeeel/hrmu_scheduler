<?php

namespace App\Actions\Leave\Balance;

use App\Models\Leave;
use App\Models\User;
use Carbon\Carbon;

class HasAccrualAction
{

    public function checkUserStatus(User $user, Carbon $date): bool
    {
        $start = $date->copy()->startOfMonth();
        $end = $date->copy()->endOfMonth();

        $hasMonthlyFiling = Leave::query()
            ->whereBelongsTo($user)
            ->where('leave_type', 'monthly filing')
            ->where('status', true)
            ->whereBetween('starts_at', [$start, $end])
            ->exists();

        $hasAccrual = Leave::query()
            ->whereBelongsTo($user)
            ->whereIn('leave_type', [
                'vacation leave',
                'sick leave',
                'force leave',
            ])
            ->where('event_type', 'accrual')
            ->whereBetween('starts_at', [$start->copy()->addMonthNoOverflow(), $end->copy()->addMonthNoOverflow()])
            ->exists();

        return $hasMonthlyFiling && !$hasAccrual;
    }
}
