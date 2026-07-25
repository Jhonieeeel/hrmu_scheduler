<?php


namespace App\Data;

use Spatie\LaravelData\Data;

class HolidayData extends Data
{
    public function __construct(
        public string   $holiday_name,
        public int   $day,
        public ?int  $month,
    ) {}
}
