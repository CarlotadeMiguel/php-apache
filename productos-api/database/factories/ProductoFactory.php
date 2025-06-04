<?php

namespace Database\Factories;

use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    protected $model = Producto::class;

    public function definition()
    {
        return [
            'nombre' => $this->faker->words(2, true),
            'descripcion' => $this->faker->sentence(),
            'precio' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(1, 100),
            'categoria_id' => Categoria::factory(),
        ];
    }
}
