<?php

use App\Http\Controllers\LeaveController;
use App\Http\Controllers\UndertimeController;
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
});

require __DIR__ . '/settings.php';
