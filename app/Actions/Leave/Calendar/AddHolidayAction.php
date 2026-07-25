<?php

namespace App\Actions\Leave\Calendar;

use App\Data\HolidayData;
use App\Models\Holiday;

class AddHolidayAction
{
    public function __invoke(HolidayData $holidayData): void
    {
        Holiday::create($holidayData->toArray());
    }
}
