import React from "react";
import MovieForm from "./MovieForm";

export default function MovieCreate() {
  // editMode=false hará que MovieForm ponga el título “Crear película”
  return <MovieForm editMode={false} />;
}
