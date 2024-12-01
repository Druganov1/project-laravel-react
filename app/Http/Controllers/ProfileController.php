<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\JsonResponse;
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }


    public function updateTheme(Request $request): RedirectResponse
    {
        $request->validate([
            'theme' => ['required', 'in:light,dark'],
        ]);

        $request->user()->update($request->only('theme'));

        return Redirect::back();
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }


    public function removeProfilePic(Request $request)
    {

        $user = $request->user();

        $user->profile_pic_b64 = null;
        $user->save();
        return Redirect::back();

    }



    public function upload(Request $request): JsonResponse
    {
        $request->validate(
            [
                'profile_pic' => ['required', 'image', 'mimes:jpg,png', 'max:2048'],
            ],
            [
                'profile_pic.image' => 'Het bestand moet een afbeelding zijn.',
                'profile_pic.mimes' => 'Alleen de volgende bestandsvormen zijn toegestaan: JPG & PNG.',
                'profile_pic.max' => 'Het bestand mag niet groter zijn dan 2MB.',
            ]
        );
        $user = $request->user();

        $imageFile = $request->file('profile_pic');

        // Initialize the ImageManager with the GD driver
        $manager = new ImageManager(new Driver());

        // Read the uploaded image
        $image = $manager->read($imageFile->getRealPath());

        // Resize the image proportionally to 300px width
        $image->scale(width: 300);

        // Convert to JPEG and set quality to 75%
        $compressedImage = $image->toJpeg(quality: 75);

        // Encode as Base64
        $imageData = base64_encode($compressedImage);

        // Save Base64 in the database
        $user->profile_pic_b64 = $imageData;
        $user->save();

        return response()->json([
            'message' => 'Profile picture uploaded successfully.',
            'profile_pic_b64' => $imageData, // Include the encoded image data
        ]);
    }
}
