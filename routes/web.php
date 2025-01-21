<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Auth\ProviderController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ImageScannerController;
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



Route::get('/help', action: [ChatbotController::class, 'index'])->name('help.index');



Route::prefix('api')->group(function () {
    Route::post('/chat', action: [ChatbotController::class, 'sendChat'])->name('api.sendChat');

});

Route::middleware('auth')->group(function () {
    Route::get('/recipe', function () {
        return Inertia::render('RecipeMaker');

    });

    Route::get('/image-scanner', function () {
        return Inertia::render('ImageScanner');
    });

    Route::post('/image-scanner/scan', [ImageScannerController::class, 'scanImage'])->middleware(['auth'])->name('image-scanner.scan');
    Route::post('/recipe/generate', [RecipeController::class, 'generateRecipe'])->middleware(['auth'])->name('recipe.generate');
    Route::patch('/theme', action: [ProfileController::class, 'updateTheme'])->name('profile.updateTheme');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', action: [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/delete_profile_picture', [ProfileController::class, 'removeProfilePic'])->name('profile.deletepic');
    Route::post('/upload_profilepicture', [ProfileController::class, 'upload'])->name('profile.uploadpic');
    Route::post('/issues/update-assignee', [IssueController::class, 'updateAssignee'])->name('issues.update-assignee');

    Route::middleware('role:developer')->group(function () {
        Route::get('/developer/issues/', [IssueController::class, 'indexDeveloper'])->name('developer.issues.index');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/issues/', [IssueController::class, 'index'])->name('issues.index');
    });


});

Route::patch('/issues/{issue}/status', [IssueController::class, 'updateStatus'])->name('issues.update.status');

require __DIR__.'/auth.php';
