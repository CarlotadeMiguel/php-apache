<?php
namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    // Listar todos los productos (GET /api/productos)
    public function index(): JsonResponse
    {
        $productos = Producto::with('categoria')->paginate(10);
        
        return response()->json([
            'data' => $productos->items(),
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString(),
                'pagination' => [
                    'total' => $productos->total(),
                    'per_page' => $productos->perPage()
                ]
            ]
        ], 200);
    }

    // Crear un nuevo producto (POST /api/productos)
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id'
        ]);

        $producto = Producto::create($validated);

        return response()->json([
            'data' => $producto->load('categoria'),
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ], 201);
    }

    // Mostrar detalle de un producto (GET /api/productos/{id})
    public function show($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        return response()->json([
            'data' => $producto,
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ], 200);
    }

    // Actualizar producto completo (PUT /api/productos/{id})
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id'
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($validated);
        return response()->json([
            'data' => $producto,
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ], 200);
    }

    // Actualizar producto parcial (PATCH /api/productos/{id})
    public function patch(Request $request, $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);

        $rules = [
            'nombre'      => 'sometimes|required|string|max:255',
            'descripcion' => 'sometimes|nullable|string',
            'precio'      => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'categoria_id' => 'sometimes|required|exists:categorias,id'
        ];
        $validated = $request->validate($rules);

        $producto->update($validated);
        return response()->json([
            'data' => $producto,
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ], 200);
    }

    // Eliminar producto (DELETE /api/productos/{id})
    public function destroy($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();
        return response()->json(null, 204);
    }
}