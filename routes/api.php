<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/test', function () {
    return response()->json(['message' => 'API working from Laravel!']);
});

// Or with v1 prefix
Route::prefix('v1')->group(function () {
    Route::get('/test', function () {
        return response()->json(['message' => 'API working with v1 prefix!']);
    });
});

Route::post('/test-form', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'message' => 'required|string'
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Form submitted successfully!',
        'data' => $validated,
        'timestamp' => now()
    ]);
});
