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
