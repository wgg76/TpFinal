<<<<<<< HEAD
import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import moviesData from "../frontend/src/data/movies.json" assert { type: "json" };

const mongoURI = "mongodb+srv://walterg76:PakitoR3@cluster0.0jrxh.mongodb.net/apitpfinal?retryWrites=true&w=majority&appName=Cluster0";

try {
  await mongoose.connect(mongoURI);
  //console.log("Conectado a MongoDB Atlas");

  // Limpia la colección (opcional)
  await Movie.deleteMany({});

  // Inserta los datos del JSON
  await Movie.insertMany(moviesData);
  //console.log("Películas cargadas en la base de datos");

  await mongoose.disconnect();
} catch (error) {
  //console.error("Error de conexión", error);
}
=======
import mongoose from "mongoose";
import Movie from "./models/Movie.js";
import moviesData from "../frontend/src/data/movies.json" assert { type: "json" };

const mongoURI = "mongodb+srv://walterg76:PakitoR3@cluster0.0jrxh.mongodb.net/apitpfinal?retryWrites=true&w=majority&appName=Cluster0";

try {
  await mongoose.connect(mongoURI);

  // Limpia la colección (opcional)
  await Movie.deleteMany({});

  // Inserta los datos del JSON
  await Movie.insertMany(moviesData);
 

  await mongoose.disconnect();
} catch (error) {
  
}
>>>>>>> 5582115 (veamos que sale)
