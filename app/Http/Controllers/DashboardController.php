<?php

namespace App\Http\Controllers;

use App\Actions\Leave\Dashboard\DashboardList;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardList $dashboardList)
    {
        $requestStart = Carbon::parse($request->input('start', now()->startOfMonth()));
        $requestEnd = Carbon::parse($request->input('end', now()->endOfMonth()));

        return Inertia::render('Dashboard/Dashboard', [
            'dashboardItems' => $dashboardList->transactions($requestStart, $requestEnd),
            'filters' => [
                'start' => $requestStart->toDateString(),
                'end' => $requestEnd->toDateString(),
            ],
        ]);
    }
}
