<?php

namespace App\Http\Controllers;

use App\Actions\Leave\Balance\HasAccrualAction;
use App\Actions\Leave\Balance\MonthlyAccrualAction;
use App\Actions\Leave\Balance\ReplayBalanceAction;
use App\Actions\Leave\Export\ExportPdfAction;
use App\Actions\Leave\Transactions\LeaveAction;
use App\Actions\Leave\Transactions\TransactionsIndex;
use App\Data\LeaveData;
use App\Models\Leave;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $leaves = Leave::query()->with('user:id,name')
            ->where('leave_type', 'monthly filing');

        if ($request->filled('year') && $request->filled('month')) {

            $date = Carbon::create(
                (int) $request->year,
                (int) $request->month,
                1
            );

            info("have params");
            info($date->copy()->startOfMonth());
            info($date->copy()->endOfMonth());

            $leaves->whereBetween('starts_at', [
                $date->copy()->startOfMonth(),
                $date->copy()->endOfMonth()
            ]);
        } else {

            $date = Carbon::create(
                now()->year,
                now()->month,
                1
            );

            info($date->copy()->startOfMonth());
            info($date->copy()->endOfMonth());

            $leaves->whereBetween('starts_at', [
                $date->copy()->startOfMonth(),
                $date->copy()->endOfMonth()
            ]);
        }

        return Inertia::render('Leaves/Index', [
            'leaves' => $leaves->paginate(10)->withQueryString(),
            'filters' => $request->only(['year', 'month'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::select(['id', 'name'])->get();
        return Inertia::render("Leaves/FileLeaveForm", [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, LeaveData $leaveData, LeaveAction $action)
    {
        $action($leaveData);

        return back()->with('message', 'Filed Leave Successfully');
    }

    public function accrual(LeaveData $data, MonthlyAccrualAction $action)
    {
        $action->handleAccrual($data);

        return to_route("leave.index")->with('message', 'Monthly Accrual Created Successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(
        Request $request,
        User $user,
        ReplayBalanceAction $balanceAction,
        TransactionsIndex $transactionAction,
        HasAccrualAction $hasAccrualAction
    ) {
        $month = $request->input("month", now()->month);
        $year = $request->input("year", now()->year);

        $date = Carbon::create($year, $month, 1);

        $balances = $balanceAction->UserBalance($date, $user);
        $transactions = $transactionAction->transactions($date, $user);
        $hasAccrual = $hasAccrualAction->checkUserStatus($user, $date);

        return Inertia::render("Leaves/UserBalance", [
            'balances' => $balances,
            'user' => $user,
            'transactions' => $transactions,
            'hasAccrual' => $hasAccrual,
            'filters' => $request->only(['year', 'month', 'user_id'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leave $leave)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Leave $leave)
    {
        $validated = $request->validate([
            'status' => ['required', 'boolean'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        $leave->update([
            'status' => $validated['status'],
            'remarks' => $validated['remarks']
        ]);

        return back()->with('message', 'Monthly Filing Updated Successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leave)
    {
        $leave->delete();

        return back()->with('message', 'Leave Balance Deleted Successfully');
    }

    public function export(Request $request, ExportPdfAction $exportAction, ReplayBalanceAction $balanceAction)
    {
        $month = $request->input("month", now()->month);
        $year = $request->input("year", now()->year);

        $date = Carbon::create($year, $month, 1);
        $users = User::select(['id', 'name'])->get();

        $usersBalance = $balanceAction->UsersBalances($date, $users);
        $exportUrl = $exportAction->exportPdf($usersBalance);

        return to_route(
            'leave.index',
            $request->only(['year', 'month'])
        )->with('downloadUrl', $exportUrl);
    }
}
