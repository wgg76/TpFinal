![CI](https://github.com/wgg76/TpFinal/actions/workflows/ci.yml/badge.svg)

# Blockbuster Online

Este directorio contiene la API RESTful de Mini Netflix, construida con:

Node.js (v16+)

Express como framework HTTP

MongoDB y Mongoose para la base de datos

JSON Web Tokens (JWT) para autenticación

Integración con la API de OMDb para enriquecer datos de películas

📋 Requisitos previos

Node.js v16+ y npm

Una cuenta en MongoDB Atlas (o instancia local)

API key de OMDb (gratis con registro)

🔧 Configuración de variables de entorno

Crea un archivo .env en este directorio con estas variables:

# URI de conexión a MongoDB (Atlas o local)
MONGO_URI="mongodb+srv://usuario:password@cluster.mongodb.net/mi-db?retryWrites=true&w=majority"

# Clave secreta para firmar JWT
JWT_SECRET="una_clave_segura_y_larga"

# API Key de OMDb
OMDB_API_KEY="tu_api_key_omdb"

# Puerto en el que escuchará el servidor (opcional, default: 5000)
PORT=5000
Importante: No subas este archivo a tu repositorio público. Añade .env a tu .gitignore.

🚀 Instalación y arranque

# Desde la raíz del proyecto
cd backend
npm install

# Modo desarrollo (con nodemon)
npm run dev
# → Servidor corriendo en http://localhost:5000

# Modo producción
env NODE_ENV=production node src/server.js

📂 Estructura del proyecto

backend/
├── src/
│   ├── models/            # Esquemas Mongoose (User, Profile, Movie)
│   ├── routes/            # Rutas Express separadas por recurso
│   │   ├── auth.js
│   │   ├── profiles.js
│   │   └── movies.js
│   ├── middleware/        # Middlewares (requireAuth, requireAdmin)
│   ├── utils/             # Utilidades (integración OMDb, helpers)
│   ├── server.js          # Punto de entrada y configuración global
│   └── db.js              # Conexión y configuración de Mongoose
├── .env.example           # Ejemplo de variables de entorno
├── package.json
└── README.md              # Documentación de esta carpeta

🔐 Endpoints principales

Autenticación

POST /api/auth/register – Registrar nuevo usuario:

{ "email": "user@ejemplo.com", "password": "123456" }

🔐 Endpoints principales

Autenticación

POST /api/auth/register – Registrar nuevo usuario:

{ "email": "user@ejemplo.com", "password": "123456" }

POST /api/auth/login – Iniciar sesión, devuelve { token }.

Perfiles

GET /api/profiles – Listar perfiles (propios o todos si admin).

POST /api/profiles – Crear perfil: { name, dob }.

PUT /api/profiles/:id – Editar perfil.

DELETE /api/profiles/:id – Eliminar perfil.

Watchlist

POST /api/profiles/:id/watchlist – Añadir { itemId }.

DELETE /api/profiles/:id/watchlist/:itemId – Quitar.

Películas & Series

GET /api/movies – Listado paginado y filtrado: ?page=&limit=&type=&minRating=&yearFrom=&yearTo=.

GET /api/movies/:id – Detalle por ID (?refresh=true para forzar OMDb).

GET /api/movies/top-imdb – Top 10 ordenado por imdbRating.

POST /api/movies – (Admin) Crear.

PUT /api/movies/:id – (Admin) Actualizar.

DELETE /api/movies/:id – (Admin) Eliminar.

📝 Pruebas y calidad

Instala y configura ESLint y Prettier para mantener consistencia.

Agrega pruebas unitarias con Jest y Supertest para los endpoints clave.

📝 Licencia

MIT License © Walter Gerhardt