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
