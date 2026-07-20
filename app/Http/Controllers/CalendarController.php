<?php

namespace App\Http\Controllers;

use App\Actions\Leave\Calendar\CalendarIndexAction;
use App\Actions\Leave\Calendar\CalendarUpdateAction;
use App\Actions\Leave\CalendarDeleteAction;
use App\Data\LeaveData;
use App\Models\Leave;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index(CalendarIndexAction $action)
    {
        $events = $action();

        return inertia::render('Calendar/Index', [
            'calendarEvents' => $events,
        ]);
    }

    public function update(Leave $leave, LeaveData $data, CalendarUpdateAction $action): RedirectResponse
    {
        $action->handle($leave, $data);

        return redirect()->back();
    }


    public function destroy(Leave $leave, CalendarDeleteAction $action): RedirectResponse
    {
        $action->handle($leave);

        return redirect()->back();
    }
}
