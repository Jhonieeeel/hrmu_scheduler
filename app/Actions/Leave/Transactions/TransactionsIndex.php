<?php

namespace App\Actions\Leave\Transactions;

use App\Models\Leave;
use App\Models\User;
use Carbon\Carbon;

class TransactionsIndex
{

    public function transactions(Carbon $date, User $user)
    {
        return Leave::where('user_id', $user->id)
            ->whereNotIn('leave_type', ['monthly filing'])
            ->whereMonth('starts_at', $date->copy()->month)
            ->whereYear('starts_at', $date->copy()->year)
            ->paginate(10)
            ->withQueryString()
        ;
    }
}
