<?php
namespace App\Http\Controllers;
// app/Http/Controllers/CategoriaController.php

use App\Models\Categoria;
use Illuminate\Http\JsonResponse;

class CategoriaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Categoria::all());
    }
}
