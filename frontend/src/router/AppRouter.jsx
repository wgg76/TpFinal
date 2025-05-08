// src/Router/AppRouter.jsx
import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Home from "../pages/Home";
import MovieList from "../pages/MovieList";
import MovieCreate from "../pages/MovieCreate";
import MovieEdit from "../pages/MovieEdit";
import MovieDetail from "../pages/MovieDetail";
import SeriesList from "../pages/SeriesList";
import SeriesCreate from "../pages/SeriesCreate";
import SeriesEdit from "../pages/SeriesEdit";
import SeriesDetail from "../pages/SeriesDetail";
import BulkUploader from "../pages/BulkUploader";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/bulk-upload" element={<BulkUploader />} />

    {/* Rutas para películas */}
    <Route path="/movies" element={<PrivateRoute skipProfileCheck><MovieList /></PrivateRoute>} />
    <Route path="/movies/create" element={<PrivateRoute skipProfileCheck adminOnly><MovieCreate /></PrivateRoute>} />
    <Route path="/movies/:id/edit" element={<PrivateRoute skipProfileCheck adminOnly><MovieEdit /></PrivateRoute>} />
    <Route path="/movies/:id" element={<PrivateRoute skipProfileCheck><MovieDetail /></PrivateRoute>} />

    {/* Rutas para series */}
    {/* Rutas de series agrupadas */}
    <Route element={<PrivateRoute skipProfileCheck><Outlet /></PrivateRoute>}>
      <Route path="/series" element={<SeriesList />} />
      <Route path="/series/create" element={<SeriesCreate />} />
      <Route path="/series/:id" element={<SeriesDetail />} />
      <Route path="/series/:id/edit" element={<SeriesEdit />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
