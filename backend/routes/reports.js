<<<<<<< HEAD
// src/routes/reports.js
import express from "express";
import Movie from "../models/Movie.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";
import ExcelJS from "exceljs";

const router = express.Router();

router.get(
  "/views",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      // 1) Obtenemos los datos
      const movies = await Movie.find({}, "Title imdbID views")
        .sort({ views: -1 })
        .lean();

      // 2) Creamos el workbook y la hoja
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Reporte de Vistas");

      // 3) Definimos columnas
      sheet.columns = [
        { header: "Título",    key: "title",  width: 50 },
        { header: "imdbID",    key: "imdbID", width: 15 },
        { header: "Vistas",    key: "views",  width: 10 },
      ];

      // 4) Añadimos cada fila (asegurando views >= 0)
      movies.forEach((m) => {
        sheet.addRow({
          title:  m.Title,
          imdbID: m.imdbID,
          views:  m.views ?? 0,
        });
      });

      // 5) Generamos el buffer .xlsx
      const buffer = await workbook.xlsx.writeBuffer();

      // 6) Enviamos la respuesta con cabeceras para descarga
      res
        .status(200)
        .set({
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="views_report.xlsx"`,
        })
        .send(buffer);
    } catch (err) {
      console.error("Error generando reporte de vistas:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
=======
// src/routes/reports.js
import express from "express";
import Movie from "../models/Movie.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";
import ExcelJS from "exceljs";

const router = express.Router();

router.get("/views", requireAuth, requireAdmin, async (req, res) => {
  try {
    // 1) Obtenemos los datos
    const movies = await Movie.find({}, "Title imdbID views")
      .sort({ views: -1 })
      .lean();

    // 2) Creamos el workbook y la hoja
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte de Vistas");

    // 3) Definimos columnas
    sheet.columns = [
      { header: "Título", key: "title", width: 50 },
      { header: "imdbID", key: "imdbID", width: 15 },
      { header: "Vistas", key: "views", width: 10 },
    ];

    // 4) Añadimos cada fila (asegurando views >= 0)
    movies.forEach((m) => {
      sheet.addRow({
        title: m.Title,
        imdbID: m.imdbID,
        views: m.views ?? 0,
      });
    });

    // 5) Generamos el buffer .xlsx
    const buffer = await workbook.xlsx.writeBuffer();

    // 6) Enviamos la respuesta con cabeceras para descarga
    res
      .status(200)
      .set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="views_report.xlsx"`,
      })
      .send(buffer);
  } catch (err) {
    console.error("Error generando reporte de vistas:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
>>>>>>> 5582115 (veamos que sale)
