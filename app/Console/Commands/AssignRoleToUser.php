<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignRoleToUser extends Command
{
 /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'role:assign {userId} {roleName}';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign a role to a user by their ID';
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('userId');
        $roleName = $this->argument('roleName');

        // Find the user by ID
        $user = User::find($userId);

        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return Command::FAILURE;
        }

        // Check if the role exists
        $role = Role::where('name', $roleName)->first();

        if (!$role) {
            $this->error("Role '{$roleName}' does not exist.");
            return Command::FAILURE;
        }

        // Assign the role to the user
        $user->assignRole($roleName);
        $this->info("Role '{$roleName}' has been assigned to user with ID {$userId}.");

        return Command::SUCCESS;
    }
}
