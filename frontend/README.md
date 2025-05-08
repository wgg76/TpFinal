![CI](https://github.com/wgg76/TpFinal/actions/workflows/ci.yml/badge.svg)

# Blockbuster Online · Backend

Una API REST con Express y MongoDB para gestionar usuarios, perfiles, películas y series, con autenticación JWT y panel de administración.

---

## 🛠 Tecnologías

- **Node.js** & **Express**  
- **MongoDB** con **Mongoose**  
- **JWT** para autenticación  
- **dotenv** para variables de entorno  
- **cors** para solicitudes desde el frontend  
- **nodemon** en desarrollo  

---

## 📥 Instalación

1. **Clona el repositorio**  
   ```bash
   git clone <URL_DEL_REPO> backend
   cd backend
Instala dependencias

bash
Copiar
Editar
npm install
Configura variables de entorno
Crea un archivo .env en la raíz con:

env
Copiar
Editar
MONGO_URI=<tu_URI_de_MongoDB>
JWT_SECRET=<una_clave_secreta_para_tokens>
TMDB_API_KEY=<tu_api_key_de_TMDB>  
PORT=5000
MONGO_URI: cadena de conexión a tu base de datos Mongo

JWT_SECRET: semilla para firmar tokens

TMDB_API_KEY: (opcional) clave para la ruta de tmdb

PORT: puerto donde correrá el servidor (por defecto 5000)

Arranca el servidor

Desarrollo (con reinicios automáticos):

bash
Copiar
Editar
npm run dev
Producción:

bash
Copiar
Editar
npm start
🚧 Rutas principales
Autenticación
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/refresh

Usuarios
GET /api/users – lista todos (requiere token)

PUT /api/users/:id/role – cambia rol (admin only)

Perfiles
GET /api/profiles – todos o propios

POST /api/profiles – crea nuevo

PUT /api/profiles/:id – actualiza

DELETE /api/profiles/:id – elimina

GET /api/profiles/:id/watchlist – favoritos

POST /api/profiles/:id/watchlist – agrega

DELETE /api/profiles/:id/watchlist/:itemId – quita

PUT /api/profiles/public/:publicId/role – cambiar rol de perfil (admin only)

Películas
GET /api/movies – listado paginado y filtros

GET /api/movies/:id – detalle (incrementa views)

POST /api/movies – crea (admin only)

PUT /api/movies/:id – actualiza (admin only)

DELETE /api/movies/:id – elimina (admin only)

Series
GET /api/series – listado paginado y filtros

GET /api/series/:id – detalle (incrementa views)

POST /api/series – crea (admin only; usa imdbID como _id)

PUT /api/series/:id – actualiza (admin only)

DELETE /api/series/:id – elimina (admin only)

Seed & TMDB
POST /api/seed – recarga MongoDB desde TMDB (admin only)

GET /api/tmdb/discover/movie – proxy a TMDB Discover

GET /api/tmdb/discover/tv – proxy a TMDB Discover

GET /api/tmdb/movie/:id/videos – trailers de TMDB

GET /api/tmdb/tv/:id/videos – trailers de TMDB

🔒 Seguridad & Middleware
requireAuth protege rutas que requieren token válido

requireAdmin valida rol admin antes de ciertas operaciones

CORS habilitado para el dominio del frontend

📂 Estructura de carpetas
bash
Copiar
Editar
backend/
├── models/          # Esquemas Mongoose (User, Profile, Movie, Series)
├── routes/          # Ruteadores Express
├── middleware/      # requireAuth, requireAdmin
├── utils/           # Helpers (nanoid, validaciones…)
├── server.js        # Punto de entrada, configuración global
├── .env             # Variables de entorno (no en repo)
└── package.json
📈 To-Do & Mejoras
Añadir tests automáticos

Validaciones más exhaustivas (Joi/Zod)

Paginación avanzada y búsqueda por texto

Despliegue en Heroku / Render / Railway

© Licencia

MIT License © Walter Gerhardt

