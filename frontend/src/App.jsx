// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Profiles from "./pages/Profiles";

import MovieList from "./pages/MovieList";
import MovieForm from "./pages/MovieForm";
import MovieDetail from "./pages/MovieDetail";
import MovieCreate from "./pages/MovieCreate";

import SeriesList from "./pages/SeriesList";
import SeriesForm from "./pages/SeriesForm";
import SeriesDetail from "./pages/SeriesDetail";
import SeriesCreate from "./pages/SeriesCreate";

import WatchlistPage from "./pages/WatchlistPage";
import RatingList from "./pages/RatingList";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* 1) Pública */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* 2) Rating (login) */}
          <Route
            path="/rating"
            element={
              <PrivateRoute skipProfileCheck>
                <RatingList />
              </PrivateRoute>
            }
          />

          {/* 3) Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* 4) Perfiles */}
          <Route
            path="/profiles"
            element={
              <PrivateRoute skipProfileCheck>
                <Profiles />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/new"
            element={
              <PrivateRoute skipProfileCheck>
                <Profiles />
              </PrivateRoute>
            }
          />

          {/* 5) Películas */}
          <Route
            path="/movies"
            element={
              <PrivateRoute>
                <MovieList />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies/create"
            element={
              <PrivateRoute adminOnly>
                <MovieCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies/edit/:id"
            element={
              <PrivateRoute adminOnly>
                <MovieForm editMode={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <PrivateRoute>
                <MovieDetail />
              </PrivateRoute>
            }
          />

          {/* 6) Series */}
          <Route
            path="/series"
            element={
              <PrivateRoute>
                <SeriesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/series/create"
            element={
              <PrivateRoute adminOnly>
                <SeriesCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/series/edit/:id"
            element={
              <PrivateRoute adminOnly>
                <SeriesForm editMode={true} />
              </PrivateRoute>
            }
          />
          <Route
            path="/series/:id"
            element={
              <PrivateRoute>
                <SeriesDetail />
              </PrivateRoute>
            }
          />

          {/* 7) Watchlist */}
          <Route
            path="/watchlist"
            element={
              <PrivateRoute>
                <WatchlistPage />
              </PrivateRoute>
            }
          />

          {/* 8) Admin dashboard */}
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* 9) Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
