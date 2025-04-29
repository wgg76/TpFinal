// src/App.jsx

import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import ChooseProfile from "./pages/ChooseProfile";
import ProfileForm from "./pages/ProfileForm";
import MovieList from "./pages/MovieList";
import MovieForm from "./pages/MovieForm";
import MovieDetail from "./pages/MovieDetail";
import SeriesList from "./pages/SeriesList";
import SeriesForm from "./pages/SeriesForm";
import SeriesDetail from "./pages/SeriesDetail";
import WatchlistPage from "./pages/WatchlistPage";
import RatingList from "./pages/RatingList";
import NotFound from "./pages/NotFound";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* 1) Página principal pública */}
          <Route path="/" element={<Home />} />

          {/* 2) Rating (requiere solo login) */}
          <Route
            path="/rating"
            element={
              <PrivateRoute skipProfileCheck>
                <RatingList />
              </PrivateRoute>
            }
          />

          {/* 3) Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* 4) Perfiles (sin perfil creado aún) */}
          <Route
            path="/profiles"
            element={
              <PrivateRoute skipProfileCheck>
                <ChooseProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/new"
            element={
              <PrivateRoute skipProfileCheck>
                <ProfileForm editMode={false} />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/edit/:id"
            element={
              <PrivateRoute skipProfileCheck>
                <ProfileForm editMode={true} />
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
                <MovieForm editMode={false} />
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
                <SeriesForm editMode={false} />
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

          {/* 8) Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
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
