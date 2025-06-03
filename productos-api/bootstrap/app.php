<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        
        $middleware->alias([
            'auth'     => \App\Http\Middleware\Authenticate::class,
            'auth:api' => \Tymon\JWTAuth\Http\Middleware\Authenticate::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $e) {
            if ($e instanceof ModelNotFoundException) {
                return response()->json([
                    'error' => 'Recurso no encontrado',
                    'codigo' => 404,
                    'meta' => [
                        'version' => '1.0',
                        'timestamp' => now()->toISOString()
                    ]
                ], 404);
            }
            return $response;
        });
    })
    ->create();