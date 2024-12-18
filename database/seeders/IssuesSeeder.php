<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class IssuesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) { // Change 10 to the desired number of issues
            DB::table('issues')->insert([
                'title' => $faker->text(50),
                'description' => $faker->text(200),
                'created_by' => 1,
                'reference_id' => strtoupper($faker->lexify('????-????')), // Example reference
                'status' => 'open',
                'priority' => 'LOW',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }


    }
}
