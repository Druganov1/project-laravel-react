<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Auth\ProviderController;



Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::controller(ProviderController::class)->group(function () {
    Route::get('/auth/{provider}/redirect', 'redirect');
    Route::get('/auth/{provider}/callback', 'callback');
});

Route::get('/helloworld', function () {
    return Inertia::render('HelloWorld');

});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');

})->name('dashboard');

Route::get('/settings', function () {
    return Inertia::render('Settings');

});

Route::get('/help', function () {
    return Inertia::render('Help');

});

Route::middleware('auth')->group(function () {
    Route::patch('/theme', action: [ProfileController::class, 'updateTheme'])->name('profile.updateTheme');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', action: [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/delete_profile_picture', [ProfileController::class, 'removeProfilePic'])->name('profile.deletepic');
    Route::post('/upload_profilepicture', [ProfileController::class, 'upload'])->name('profile.uploadpic');

});


require __DIR__.'/auth.php';
