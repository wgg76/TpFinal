![CI](https://github.com/wgg76/TpFinal/actions/workflows/ci.yml/badge.svg)

Mini Netflix Fullstack

Mini Netflix es una aplicación web fullstack que simula una plataforma de streaming tipo "mini Netflix", desarrollada con React en el frontend y Node.js/Express + MongoDB en el backend. Permite:

📋 Registro e Inicio de sesión con JWT.

👤 Gestión de perfiles: creación, edición, eliminación.

🎬 Catálogo de Películas y Series con:

Búsqueda por título y filtros avanzados (calificación, rango de años).

Paginación y ruteo dinámico.

Detalle con datos enriquecidos de OMDb.

⭐ Watchlist: añadir/quitar favoritos por perfil.

🎖 Ranking IMDb: Top 10 ordenado por IMDb.

🏗️ Arquitectura del proyecto

/  (raíz)
├── frontend/        # Aplicación React + Vite + TailwindCSS
├── backend/         # API REST con Node.js, Express y MongoDB
└── README.md        # Vista global del proyecto

frontend/

src/ contiene componentes, páginas, contextos y servicios.

services/api.js un cliente unificado para todas las peticiones.

Formularios migrados a react-hook-form + Yup.

backend/

src/routes/ define endpoints seguros con JWT.

src/models/ esquemas Mongoose (User, Profile, Movie).

Conexión a MongoDB, consumo de OMDb y validaciones.

🚀 Instalación y arranque#

Clonar repositorio

git clone <repo-url>
cd <repo-root>

Backend

cd backend
npm install
# Crear un .env con:
#   MONGO_URI=tu_mongo_atlas_uri
#   JWT_SECRET=una_clave_segura
#   OMDB_API_KEY=tu_api_key_omdb
npm run start    # o npm run dev (con nodemon)

Frontend

cd frontend
npm install
# En .env.local (opcional): VITE_API_URL="https://api-tu-dominio.com/api"
npm run dev     # levanta Vite en http://localhost:5173

🔧 Variables de entorno

Variable

Descripción

MONGO_URI

URI de conexión a MongoDB (Mongo Atlas)

JWT_SECRET

Clave secreta para firma de tokens JWT

OMDB_API_KEY

API Key de OMDb

VITE_API_URL

URL base de la API para el frontend (opt.)

📝 Uso y ejemplos

Autenticación

# Registro
curl -X POST https://tu-api.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "email": "user@ejemplo.com", "password": "123456" }'

# Login
echo '{ "email":"user@ejemplo.com", "password":"123456" }' \
  | curl https://tu-api.com/auth/login -H 'Content-Type: application/json' -d @-

  Perfiles

  # Listar perfiles (con token)
curl -H "Authorization: Bearer <token>" https://tu-api.com/profiles

# Crear perfil
echo '{ "name":"Adulto", "dob":"1990-05-10" }' \
  | curl -X POST https://tu-api.com/profiles -H 'Authorization: Bearer <token>' -d @-

  Watchlist

  # Añadir a watchlist
curl -X POST https://tu-api.com/profiles/<profileId>/watchlist \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{ "itemId":"<movieId>" }'

# Quitar de watchlist
curl -X DELETE https://tu-api.com/profiles/<profileId>/watchlist/<itemId> \
  -H 'Authorization: Bearer <token>'

  Listado con filtros

  # Películas tipo "movie" con rating ≥ 7.5 y año entre 2000 y 2010
echo "GET /movies?type=movie&minRating=7.5&yearFrom=2000&yearTo=2010" \
  | curl "https://tu-api.com/movies?type=movie&minRating=7.5&yearFrom=2000&yearTo=2010" -H 'Authorization: Bearer <token>'

  🎯 Despliegue

Backend: Deploy en Railway o Heroku, configurando variables seguras en su dashboard.

Frontend: Deploy en Vercel o Netlify, apuntando VITE_API_URL a la URL de tu backend.

CORS: Asegúrate de permitir las rutas de tu frontend en el servidor.

🙌 Contribuciones

¡Eres bienvenido a mejorar este proyecto! Abre un Pull Request y describe tu propuesta.

📜 Licencia

MIT License © Walter Gerhardt