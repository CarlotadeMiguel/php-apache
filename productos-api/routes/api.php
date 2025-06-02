
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\AuthController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::get('productos', [ProductoController::class, 'index']);
Route::get('productos/{producto}', [ProductoController::class, 'show']);


// Rutas protegidas por JWT
Route::middleware('auth:api')->group(function () {
    Route::apiResource('productos', ProductoController::class)->except(['index', 'show']);
});
