<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('test123'),
        ]);

        // Crear 3 categorías
        $categorias = Categoria::factory(3)->create();

        // Crear 5 productos para cada categoría
        $categorias->each(function ($categoria) {
            Producto::factory(5)->create([
                'categoria_id' => $categoria->id,
            ]);
        });
    }
}
