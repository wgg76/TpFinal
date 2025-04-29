// src/pages/NotFound.jsx
import { Link } from "react-router-dom";


const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-6">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Página no encontrada</p>
      
    </div>
  );
};

export default NotFound;
