![CI](https://github.com/wgg76/TpFinal/actions/workflows/ci.yml/badge.svg)

Frontend - Mini Netflix

Este directorio contiene la aplicación cliente de Mini Netflix, construida con:

Vite + React (v18+)

TailwindCSS (v4)

React Router DOM

react-hook-form + Yup para formularios y validaciones

react-toastify y SweetAlert2 para notificaciones

📋 Requisitos previos

Node.js v16+ y npm

Variables de entorno (opcional):

VITE_API_URL: URL base de la API (por defecto /api si no se define)


🚀 Instalación y arranque

# Desde la raíz del proyecto
cd frontend
npm install

# Levantar la app en modo desarrollo
npm run dev
# → Abre http://localhost:5173

# Generar build de producción\ npm run build
# Previsualizar build
npm run preview

🔧 Scripts disponibles

npm run dev - Modo desarrollo con HMR

npm run build - Compila para producción en dist/

npm run preview - Sirve la versión build localmente

npm run lint (si lo tienes configurado) - Corre ESLint

npm run test (si lo agregas) - Ejecuta pruebas unitarias

🔑 Variables de entorno

Crea un archivo .env.local en este directorio si necesitas sobreescribir la URL de la API:

VITE_API_URL="https://tu-api.com/api"
Si no defines nada, la app usará /api, aprovechando el proxy de Vite.

🗂️ Estructura del proyecto

frontend/
├── public/              # Archivos estáticos (index.html, favicon)
├── src/
│   ├── assets/          # Imágenes, fuentes y estilos globales
│   ├── components/      # Componentes UI reutilizables
│   ├── context/         # React Contexts (Auth, Search, Theme)
│   ├── pages/           # Vistas y rutas principales
│   │   ├── LoginPage.jsx
│   │   ├── Register.jsx
│   │   ├── MovieList.jsx
│   │   ├── SeriesList.jsx
│   │   ├── ProfileForm.jsx
│   │   └── RatingList.jsx
│   ├── services/        # Cliente unificado para API (`api.js`)
│   ├── Utils/           # Utilidades (ratings, helpers)
│   ├── App.jsx          # Definición de rutas y layout general
│   └── main.jsx         # Punto de entrada React/Router/Providers
├── .env.example         # Ejemplo de variables de entorno
├── index.html
└── package.json

📖 Notas

Los formularios usan react-hook-form con Yup para validación declarativa.

Las llamadas al backend se hacen a través de un cliente centralizado (services/api.js).

El proxy de Vite está configurado para redirigir /api al backend en desarrollo.

🙋‍♂️ Contribuciones

¡Contribuciones bienvenidas! Abre un issue o un Pull Request con tu mejora.

© Licencia

MIT License © Walter Gerhardt

