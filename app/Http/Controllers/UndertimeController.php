<?php

namespace App\Http\Controllers;

use App\Actions\Leave\Transactions\UndertimeAction;
use App\Data\LeaveData;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UndertimeController extends Controller
{
    public function create()
    {
        $users = User::select(['id', 'name'])->get();

        return Inertia::render("Leaves/UndertimeForm", [
            'users' => $users
        ]);
    }

    public function store(LeaveData $data, UndertimeAction $action)
    {
        $action($data);

        return to_route('undertime.create')->with('message', 'Undertime filed Successfully');
    }
}
