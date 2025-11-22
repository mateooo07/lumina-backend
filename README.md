# Lumina Lámparas - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Estudiante:** Mateo Pavoni   
**Curso / Comisión:** Backend I / 76615

API REST para la gestión de productos y carritos de compra del e-commerce Lumina Lámparas.

## Contenido

- [Instalación](#-instalación-rápida)
- [Estructura](#-estructura-del-proyecto)
- [Endpoints](#-endpoints)
- [Testing](#-testing-con-postman)
- [Ejemplos](#-ejemplos-de-uso)

## Instalación Rápida

```bash
# 1. Crear directorio
mkdir lumina-backend
cd lumina-backend

# 2. Inicializar proyecto
npm init -y

# 3. Instalar dependencias
npm install express

# 4. Instalar dependencias de desarrollo
npm install -D nodemon

# 5. Crear estructura de carpetas
mkdir -p src/managers src/routes src/data

# 6. Copiar los archivos del proyecto

# 7. Iniciar servidor
npm run dev
```

## Estructura del Proyecto

```
lumina-backend/
│
├── src/
│   ├── managers/
│   │   ├── ProductManager.js      # Gestión de productos
│   │   └── CartManager.js         # Gestión de carritos
│   │
│   ├── routes/
│   │   ├── products.router.js     # Rutas de productos
│   │   └── carts.router.js        # Rutas de carritos
│   │
│   ├── data/
│   │   ├── products.json          # Almacenamiento de productos
│   │   └── carts.json             # Almacenamiento de carritos
│   │
│   └── app.js                     # Servidor principal
│
├── .gitignore
├── package.json
└── README.md
```

## Configuración package.json

```json
{
  "name": "lumina-backend",
  "version": "1.0.0",
  "description": "Backend para Lumina Lámparas e-commerce",
  "main": "src/app.js",
  "type": "module",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "keywords": ["express", "api", "ecommerce", "rest"],
  "author": "Mateo Pavoni",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Endpoints

### Products `/api/products`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/` | Lista todos los productos | - |
| GET | `/:pid` | Obtiene un producto por ID | - |
| POST | `/` | Crea un nuevo producto | JSON |
| PUT | `/:pid` | Actualiza un producto | JSON |
| DELETE | `/:pid` | Elimina un producto | - |

### Carts `/api/carts`

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/` | Crea un nuevo carrito | - |
| GET | `/:cid` | Obtiene un carrito por ID | - |
| POST | `/:cid/product/:pid` | Agrega producto al carrito | - |

## Formato de Respuestas

### Respuesta Exitosa
```json
{
  "status": "success",
  "payload": { ... },
  "message": "Operación exitosa"
}
```

### Respuesta de Error
```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

### 2. Flujo de Testing Recomendado

#### A. Gestión de Productos

```bash
# 1. Crear un producto
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "title": "Lámpara LED Moderna",
  "description": "Lámpara de techo con diseño minimalista",
  "code": "LED-001",
  "price": 15990,
  "stock": 25,
  "category": "modernas",
  "thumbnails": ["img1.jpg"]
}

# 2. Listar todos los productos
GET http://localhost:8080/api/products

# 3. Obtener producto específico
GET http://localhost:8080/api/products/1

# 4. Actualizar producto
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "price": 14990,
  "stock": 30
}

# 5. Eliminar producto
DELETE http://localhost:8080/api/products/1
```

#### B. Gestión de Carritos

```bash
# 1. Crear un carrito
POST http://localhost:8080/api/carts

# 2. Ver carrito
GET http://localhost:8080/api/carts/1

# 3. Agregar producto al carrito (primera vez)
POST http://localhost:8080/api/carts/1/product/1

# 4. Agregar mismo producto (incrementa cantidad)
POST http://localhost:8080/api/carts/1/product/1

# 5. Ver carrito actualizado
GET http://localhost:8080/api/carts/1
```

## Ejemplos de Uso

### Crear Producto Completo

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Colgante Industrial Loft",
    "description": "Metal envejecido con diseño de jaula",
    "code": "IND-002",
    "price": 22450,
    "status": true,
    "stock": 15,
    "category": "vintage",
    "thumbnails": ["loft1.jpg", "loft2.jpg"]
  }'
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "id": 1,
    "title": "Colgante Industrial Loft",
    "description": "Metal envejecido con diseño de jaula",
    "code": "IND-002",
    "price": 22450,
    "status": true,
    "stock": 15,
    "category": "vintage",
    "thumbnails": ["loft1.jpg", "loft2.jpg"]
  },
  "message": "Producto creado exitosamente"
}
```

### Agregar Producto a Carrito

```bash
# Primera vez - Crea entrada con quantity: 1
curl -X POST http://localhost:8080/api/carts/1/product/1

# Segunda vez - Incrementa quantity a 2
curl -X POST http://localhost:8080/api/carts/1/product/1
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2
      }
    ]
  },
  "message": "Producto agregado al carrito exitosamente"
}
```

## Validaciones Implementadas

### ProductManager

**Campos Requeridos**
- title
- description
- code
- price
- stock
- category

**Validaciones de Tipo**
- price: número > 0
- stock: número ≥ 0
- status: boolean (opcional, default: true)
- thumbnails: array (opcional, default: [])

**Validaciones de Unicidad**
- code: no puede repetirse
- id: autogenerado, nunca se repite

**Operaciones Seguras**
- No se puede modificar el ID en updates
- No se puede crear productos con códigos duplicados

### CartManager

**Gestión Automática**
- IDs autogenerados
- Incremento automático de cantidad si el producto ya existe
- Carritos inicializados con array vacío

## Manejo de Errores

### Códigos de Estado HTTP

| Código | Situación |
|--------|-----------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

### Ejemplos de Errores

```json
// Campo requerido faltante
{
  "status": "error",
  "message": "Campos requeridos faltantes: title, price"
}

// Código duplicado
{
  "status": "error",
  "message": "Ya existe un producto con el código: LED-001"
}

// Producto no encontrado
{
  "status": "error",
  "message": "Producto con id 99 no encontrado"
}
```

## Persistencia de Datos

Los datos se almacenan en archivos JSON:

### products.json
```json
[
  {
    "id": 1,
    "title": "Lámpara LED Moderna",
    "description": "Lámpara de techo minimalista",
    "code": "LED-001",
    "price": 15990,
    "status": true,
    "stock": 25,
    "category": "modernas",
    "thumbnails": ["img1.jpg"]
  }
]
```

### carts.json
```json
[
  {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2
      }
    ]
  }
]
```
## Logs del Servidor

El servidor muestra logs útiles en la consola:

```bash
Servidor corriendo en http://localhost:8080
Endpoints disponibles:
   - GET    http://localhost:8080/api/products
   - POST   http://localhost:8080/api/products
   - GET    http://localhost:8080/api/products/:pid
   - PUT    http://localhost:8080/api/products/:pid
   - DELETE http://localhost:8080/api/products/:pid
   - POST   http://localhost:8080/api/carts
   - GET    http://localhost:8080/api/carts/:cid
   - POST   http://localhost:8080/api/carts/:cid/product/:pid

Producto creado: Lámpara LED Moderna (ID: 1)
Producto actualizado: ID 1
Carrito creado: ID 1
Producto 1 agregado al carrito 1
```

## Webgrafía

- [Express Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Postman Learning](https://learning.postman.com/)
- [REST API Best Practices](https://restfulapi.net/)
