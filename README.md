<<<<<<< HEAD
![CI](https://github.com/wgg76/TpFinal/actions/workflows/ci.yml/badge.svg)


# Mini Netflix Fullstack

Mini Netflix es una aplicación web fullstack que simula una plataforma de streaming tipo “mini Netflix”, desarrollada con React en el frontend y Node.js/Express + MongoDB en el backend.

## Prerequisitos

* **Node.js** >= 16
* **npm** >= 8

## Estructura del proyecto

```bash
/  (raíz)
├── frontend/        # Aplicación React + Vite + TailwindCSS y README propio
├── backend/         # API REST con Node.js, Express, MongoDB y README propio
└── README.md        # Esta visión global del proyecto
```

## Tecnologías principales

* **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Router
* **Backend**: Node.js, Express, MongoDB, Mongoose, JWT (accessToken 2 h / refreshToken 7 d)
* **API externa**: OMDb (sinopsis extendida y ratings)
* **Notificaciones**: react-toastify, SweetAlert2

## Clonar el repositorio

```bash
git clone <repo-url>
cd <repo-root>
```

## Instalación y arranque

### Backend

```bash
cd backend
npm install
# Crear .env con las variables:
#   MONGO_URI=tu_mongo_atlas_uri
#   JWT_SECRET=una_clave_segura
#   OMDB_API_KEY=tu_api_key_omdb
#   YT_API_KEY=tu_youtube_data_api_key (opcional)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Crear .env con las variables:
#   VITE_API_URL=http://localhost:5000/api
#   VITE_OMDB_API_KEY=tu_api_key_omdb
npm run dev
```

## Variables de entorno

| Variable            | Descripción                                   |
| ------------------- | --------------------------------------------- |
| `MONGO_URI`         | URI de conexión a MongoDB Atlas               |
| `JWT_SECRET`        | Clave secreta para firma de tokens JWT        |
| `OMDB_API_KEY`      | API Key de OMDb                               |
| `YT_API_KEY`        | YouTube Data API Key (opcional para trailers) |
| `VITE_API_URL`      | URL base de la API para el frontend           |
| `VITE_OMDB_API_KEY` | API Key de OMDb para el frontend              |

## Roadmap

* Modo oscuro
* Comentarios y valoraciones de usuarios
* Integración con TMDb para trailers
* Notificaciones en tiempo real (Socket.io)

## Contribuciones

¡Bienvenido a contribuir! Abre un Pull Request describiendo tu propuesta.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE) © Walter Gerhardt

https://blockbuster-online-tpfinal.onrender.com
=======
![CI](https://github.com/wgg76/TpFinal/actions/workflows/ci.yml/badge.svg)


Este documento te guiará para configurar, ejecutar y entender a fondo el proyecto Blockbuster Online, tu plataforma de películas y series con perfiles, watchlist, puntuaciones y panel de administración.

📖 Descripción
Blockbuster Online es una aplicación Full-Stack que permite a los usuarios:

Crear y gestionar múltiples perfiles (niños, estándar, admin).

Explorar catálogos de películas y series traídos de TMDB y de tu propia base MongoDB.

Agregar/quitar de favoritos (watchlist) por perfil.

Visualizar un ranking combinado (películas + series) por puntuación IMDb.

Panel de administración para recargar datos desde TMDB (“seed”), gestionar usuarios y perfiles, descargar reportes de vistas, etc.

🚀 Tecnologías
Backend: Node.js, Express, Mongoose (MongoDB)

Frontend: React, Vite, Tailwind CSS, React Router

Autenticación: JWT

Validación: Yup + React Hook Form

Test Data: TMDB API (seed endpoint)

Despliegue local: nodemon + Vite + proxy

🛠️ Instalación
Clonar repositorio

bash
Copiar
Editar
git clone https://github.com/tu-usuario/blockbuster-online.git
cd blockbuster-online
Configurar variables de entorno
Crea un .env en la carpeta backend/ con al menos:

dotenv
Copiar
Editar
MONGO_URI=<tu URI de MongoDB>
TMDB_API_KEY=<tu API Key de TMDB>
JWT_SECRET=<secreto JWT>
PORT=5000
Instalar dependencias

bash
Copiar
Editar
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Arrancar la aplicación

Backend:

bash
Copiar
Editar
cd backend
npm run dev
Frontend:

bash
Copiar
Editar
cd frontend
npm run dev
El servidor integrará el proxy para http://localhost:5000/api → /api.

🎛️ Estructura de carpetas
plaintext
Copiar
Editar
/
├─ backend/
│  ├─ routes/           # Rutas Express (movies, series, profiles, auth, seed, reports…)
│  ├─ models/           # Esquemas Mongoose
│  ├─ middleware/       # JWT, roles, logging
│  ├─ server.js
│  └─ .env
└─ frontend/
   ├─ src/
   │  ├─ pages/         # Componentes de página (MovieList, SeriesList, RatingList…)
   │  ├─ components/    # UI Reusable (Header, ProfileCard, Paginator…)
   │  ├─ context/       # AuthContext, SearchContext, ThemeContext
   │  ├─ services/      # api.js (request wrappers)
   │  └─ assets/
   ├─ vite.config.js
   └─ package.json
🔌 Endpoints principales
Autenticación
POST /api/auth/register → Registra usuario (email, password, role)

POST /api/auth/login → Login y JWT

Perfiles
GET /api/profiles → Lista perfiles (admin: todos, others: propios)

POST /api/profiles → Crear perfil

PUT /api/profiles/:id → Editar perfil

DELETE /api/profiles/:id → Eliminar perfil

GET /api/profiles/:id/watchlist → Ver watchlist

POST /api/profiles/:id/watchlist → Añadir a watchlist

DELETE /api/profiles/:id/watchlist/:itemId → Quitar de watchlist

PUT /api/profiles/public/:publicId/role → Cambiar rol de perfil (admin only)

Películas y series
GET /api/movies?page=&limit=&minRating=&yearFrom=&yearTo=

GET /api/movies/:id?skipCount=true

POST /api/movies (admin only)

PUT /api/movies/:id (admin only)

DELETE /api/movies/:id

GET /api/series?page=&limit=&minRating=&yearFrom=&yearTo=

GET /api/series/:id?skipCount=true

POST /api/series (admin only)

PUT /api/series/:id (admin only)

DELETE /api/series/:id

Seed y reportes
POST /api/seed → Recargar base desde TMDB (5 páginas top) (admin only)

GET /api/reports/views → Descargar Excel de vistas totales por item (admin only)

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE) © Walter Gerhardt

https://blockbuster-online-tpfinal.onrender.com
>>>>>>> 5582115 (veamos que sale)
