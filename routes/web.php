<?php

use App\Http\Controllers\LeaveController;
use App\Http\Controllers\UndertimeController;
use App\Http\Controllers\CalendarController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Leave
    Route::get('leaves', [LeaveController::class, 'index'])->name('leave.index');
    Route::get('leaves/{user}/balance', [LeaveController::class, 'show'])->name('leave.show');

    // filing undertime/leave,
    Route::get("leaves/undertime", [UndertimeController::class, 'create'])->name('undertime.create');
    Route::post("leaves/undertime", [UndertimeController::class, "store"])->name("undertime.store");
    Route::get("leaves/leave", [LeaveController::class, 'create'])->name('leave.create');
    Route::post("leaves/leave", [LeaveController::class, 'store'])->name('leave.store');


    // calendar
    Route::get("calendar", [CalendarController::class, 'index'])->name('calendar.index');
    Route::put("calendar/{leave}/update", [CalendarController::class, 'update'])->name('calendar.update');
    Route::delete("calendar/{leave}/delete", [CalendarController::class, "destroy"])->name("calendar.destroy");
});

require __DIR__ . '/settings.php';
