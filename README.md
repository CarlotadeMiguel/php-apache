# Sistema de Gestión de Productos - API Laravel + Frontend React

![Stack Tecnológico](https://img.shields.io/badge/Stack-Laravel%20%7C%20React%20%7C%20AWS%20EC2%20%7C%20JWT-blue)

Aplicación completa para gestión de productos con backend API RESTful en Laravel y frontend en React, diseñada para despliegue profesional en infraestructura AWS.

## Características Principales

### Backend (Laravel 12)
- ✅ API RESTful con endpoints CRUD para productos
- 🔐 Autenticación JWT para acceso seguro
- 🛡️ Validación de datos y manejo de errores HTTP
- 🗄️ Sistema de migraciones y seeders para base de datos
- 🌐 Configuración CORS para desarrollo frontend
- 📈 Paginación de resultados
- 🔗 Relaciones entre productos y categorías

### Frontend (React 18)
- 🖥️ Interfaz responsive con React Bootstrap
- 🔄 Consumo de API mediante Axios
- 🔐 Gestión de sesiones con localStorage
- 🚀 Enrutamiento dinámico con React Router
- 📱 Experiencia de usuario optimizada
- 🛠️ Formularios interactivos con validación
- ⚠️ Manejo profesional de errores

### Infraestructura
- ☁️ Configuración para despliegue en AWS EC2
- 🔧 Virtual Hosts optimizados en Apache
- 🛡️ Configuración de seguridad básica
- ⚡ Optimización de caché para archivos estáticos
- 📊 Logging centralizado de acceso/errores

## Requisitos Técnicos

- Servidor Ubuntu 22.04 LTS (recomendado)
- PHP 8.2+
- Node.js 18.x+
- Composer 2.x
- Apache 2.4
- SQLite/MySQL 8.0+

## Instalación Local

### 1. Clonar repositorio
```bash
git clone -b develop https://github.com/CarlotadeMiguel/php-apache.git
cd php-apache
```

### 2. Configurar backend
```bash
cd productos-api
cp .env.example .env
composer install
php artisan key:generate
php artisan jwt:secret

# Configurar DB en .env (SQLite por defecto)
touch database/database.sqlite
php artisan migrate --seed
```

### 3. Configurar base de datos (SQLite - Más simple)
```bash
touch database/database.sqlite
php artisan migrate
php artisan db:seed
```

**¡Eso es todo!** El seeder creará automáticamente:
- ✅ **1 usuario**: `test@example.com` / `test123`
- ✅ **3 categorías** de ejemplo
- ✅ **15 productos** realistas asociados a las categorías

### 3. Crear productos a mano 

## Crear usuario de prueba
```bash
cd productos-api
php artisan tinker

# En Tinker:
\App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('test123')
]);
```

## Crear categorías y productos
```bash
# En Tinker:
$cat1 = \App\Models\Categoria::create(['nombre' => 'Electrónica']);
$cat2 = \App\Models\Categoria::create(['nombre' => 'Ropa']);

\App\Models\Producto::create([
    'nombre' => 'Smartphone',
    'descripcion' => 'Teléfono inteligente',
    'precio' => 299.99,
    'stock' => 50,
    'categoria_id' => $cat1->id,
]);
```

### 4. Configurar frontend
```bash
cd ../productos-front
npm install
npm run build
```

### 5. Variables de entorno

#### Backend (.env)
```env
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:tu_clave_generada
JWT_SECRET=tu_jwt_secret_generado

DB_CONNECTION=sqlite
DB_DATABASE=/ruta/completa/a/database.sqlite

CORS_ALLOWED_ORIGINS=*
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Ejecución en Desarrollo

### Backend
```bash
cd productos-api
php artisan serve --port=8000
```

### Frontend
```bash
cd productos-front
npm start
```

Acceder a: http://localhost:3000

## Despliegue en Producción (AWS EC2)

### 1. Preparar servidor
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install apache2 php8.2 libapache2-mod-php8.2 php8.2-mbstring php8.2-xml php8.2-zip php8.2-sqlite3 unzip

# Instalar Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### 2. Configurar Virtual Hosts
```bash
# Backend API
sudo nano /etc/apache2/sites-available/productos-api.conf
sudo nano /etc/apache2/sites-available/productos-front.conf

# Habilitar sitios
sudo a2ensite productos-api productos-front
sudo a2enmod rewrite headers
sudo systemctl reload apache2
```

### 3. Configurar permisos
```bash
sudo chown -R www-data:www-data /var/www/productos-api/storage
sudo chown -R www-data:www-data /var/www/productos-api/bootstrap/cache
sudo chmod -R 775 /var/www/productos-api/storage
sudo chmod -R 775 /var/www/productos-api/bootstrap/cache
```

### 4. Optimizar Laravel para producción
```bash
cd /var/www/productos-api
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Estructura de Directorios

```
php-apache/
├── productos-api/          # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductoController.php
│   │   │   └── CategoriaController.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Producto.php
│   │       └── Categoria.php
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   └── routes/
│       └── api.php
│
├── productos-front/        # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── ProductosLista.jsx
│   │   │   └── ProductoForm.jsx
│   │   ├── App.jsx
│   │   └── api.js
│   └── build/              # Build de producción
│
└── deploy/                 # Scripts de despliegue
    └── apache-config/      # Configuraciones de Apache
```

## API Endpoints

| Endpoint | Método | Descripción | Autenticación |
|----------|--------|-------------|---------------|
| `/api/login` | POST | Iniciar sesión | No |
| `/api/productos` | GET | Listar productos | Sí |
| `/api/productos` | POST | Crear producto | Sí |
| `/api/productos/{id}` | GET | Obtener producto | Sí |
| `/api/productos/{id}` | PUT | Actualizar producto | Sí |
| `/api/productos/{id}` | DELETE | Eliminar producto | Sí |
| `/api/categorias` | GET | Listar categorías | No |


### Ejemplo de respuesta API
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Smartphone",
      "descripcion": "Teléfono inteligente",
      "precio": "299.99",
      "stock": 50,
      "categoria_id": 1,
      "categoria": {
        "id": 1,
        "nombre": "Electrónica"
      }
    }
  ],
  "meta": {
    "version": "1.0",
    "timestamp": "2025-06-04T18:20:40.000000Z",
    "pagination": {
      "total": 15,
      "per_page": 10,
      "current_page": 1,
      "last_page": 2
    }
  }
}
```

## Uso de la Aplicación

### Credenciales por defecto
- **Email**: `test@example.com`
- **Contraseña**: `test123`

### Flujo de trabajo
1. **Acceder** a la URL del frontend
2. **Iniciar sesión** con las credenciales por defecto
3. **Visualizar** la lista de productos generados automáticamente
4. **Crear, editar o eliminar** productos según necesidades
5. **Navegar** entre categorías y gestionar el inventario
## Solución de Problemas

### Error de permisos en SQLite
```bash
sudo chown www-data:www-data /var/www/productos-api/database/database.sqlite
sudo chmod 664 /var/www/productos-api/database/database.sqlite
```

### Error de CORS
- Verificar configuración en `config/cors.php`
- Asegurar que el middleware CORS esté habilitado en `bootstrap/app.php`

### Error 404 en rutas de React
- Verificar que `mod_rewrite` esté habilitado
- Revisar configuración del Virtual Host del frontend

## Tecnologías Utilizadas

- **Backend**: Laravel 12, JWT Auth, SQLite
- **Frontend**: React 18, Axios, React Router, React Bootstrap
- **Servidor**: Apache 2.4, Ubuntu 22.04
- **Cloud**: AWS EC2
- **Herramientas**: Composer, NPM, Git

## Contribución

1. Haz fork del proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza commits descriptivos (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Distribuido bajo licencia MIT. Ver [LICENSE](LICENSE) para más información.

## Autor

**Carlota de Miguel** - [GitHub](https://github.com/CarlotadeMiguel)

---

*Desarrollado como parte de la práctica integral de implementación de API RESTful con Laravel, cliente React y despliegue en AWS EC2.*