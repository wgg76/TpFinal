import React from "react";
import SeriesForm from "./SeriesForm";

export default function SeriesCreate() {
  // editMode=false hará que SeriesForm ponga el título “Crear serie”
  return <SeriesForm editMode={false} />;
}
