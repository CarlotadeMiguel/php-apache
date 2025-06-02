<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'categoria_id' // Nuevo campo relacional
    ];

      // Relación con categoría
      public function categoria(): BelongsTo
      {
          return $this->belongsTo(Categoria::class);
      }
}