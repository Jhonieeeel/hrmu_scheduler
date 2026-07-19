<?php

namespace Database\Seeders;

use App\Models\Leave;
use App\Models\User;
use Database\Factories\LeaveFactory;
use Database\Factories\UserFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        foreach (UserFactory::ocdEmployees() as $index => $employee) {

            $user = User::factory()->create($employee);

            $balances = LeaveFactory::balances()[$index];

            foreach ($balances as $leaveType => $balance) {
                Leave::create([
                    'user_id' => $user->id,
                    'leave_type' => $leaveType,
                    'event_type' => 'accrual',
                    'event_tag' => 'accrual',
                    'balance' => $balance,
                    'starts_at' => '2023-01-01',
                    'ends_at' => '2023-01-31',
                ]);
            }

            Leave::create([
                'user_id' => $user->id,
                'leave_type' => 'monthly filing',
                'event_type' => 'filing',
                'event_tag' => 'filing',
                'balance' => 0,
                'status' => false,
                'starts_at' => '2023-01-01',
                'ends_at' => '2023-01-31'
            ]);
        }
    }
}
