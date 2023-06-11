const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");
const auth = require("../seguridad/auth");

router.get("/api/articulos", async function (req, res, next) {
  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }
  if (req.query.Activo != undefined && req.query.Activo !== "") {
    where.Activo = req.query.Activo === "true";
  }
  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.articulos.findAndCountAll({
    attributes: [
      "IdArticulo",
      "Nombre",
      "Precio",
      "Stock",
      "FechaAlta",
      "Activo",
    ],
    order: [["Nombre", "ASC"]],
    where,
    offset: (Pagina - 1) * TamañoPagina,
    limit: TamañoPagina,
  });

  return res.json({ Items: rows, RegistrosTotal: count });
});

router.get("/api/articulos/:id", async function (req, res, next) {
  let items = await db.articulos.findOne({
    attributes: [
      "IdArticulo",
      "Nombre",
      "Precio",
      "CodigoDeBarra",
      "IdArticuloFamilia",
      "Stock",
      "FechaAlta",
      "Activo",
    ],
    where: { IdArticulo: req.params.id },
  });
  res.json(items);
});

router.post("/api/articulos/", async (req, res) => {
  try {
    let data = await db.articulos.create({
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      CodigoDeBarra: req.body.CodigoDeBarra,
      IdArticuloFamilia: req.body.IdArticuloFamilia,
      Stock: req.body.Stock,
      FechaAlta: req.body.FechaAlta,
      Activo: req.body.Activo,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.put("/api/articulos/:id", async (req, res) => {
  try {
    let item = await db.articulos.findOne({
      attributes: [
        "IdArticulo",
        "Nombre",
        "Precio",
        "CodigoDeBarra",
        "IdArticuloFamilia",
        "Stock",
        "FechaAlta",
        "Activo",
      ],
      where: { IdArticulo: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Articulo no encontrado" });
      return;
    }
    item.Nombre = req.body.Nombre;
    item.Precio = req.body.Precio;
    item.CodigoDeBarra = req.body.CodigoDeBarra;
    item.IdArticuloFamilia = req.body.IdArticuloFamilia;
    item.Stock = req.body.Stock;
    item.FechaAlta = req.body.FechaAlta;
    item.Activo = req.body.Activo;
    await item.save();

    res.sendStatus(200);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.delete("/api/articulos/:id", async (req, res) => {
  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.articulos.destroy({
      where: { IdArticulo: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja logica
    try {
      let data = await db.sequelize.query(
        "UPDATE articulos SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdArticulo = :IdArticulo",
        {
          replacements: { IdArticulo: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validacion, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});
module.exports = router;

//------------------------------------
//-- SEGURIDAD ---------------------------
//------------------------------------
router.get(
    "/api/jwt/articulos",
    auth.authenticateJWT,
    async function (req, res, next) {
      /* #swagger.security = [{
                 "bearerAuth1": []
          }] */
  
      // #swagger.tags = ['Articulos']
      // #swagger.summary = 'obtiene todos los Articulos, con seguridad JWT, solo para rol: admin (usuario:admin, clave:123)'
      const { rol } = res.locals.user;
      if (rol !== "admin") {
        return res.status(403).json({ message: "usuario no autorizado!" });
      }
  
      let items = await db.articulos.findAll({
        attributes: [
          "IdArticulo",
          "Nombre",
          "Precio",
          "CodigoDeBarra",
          "IdArticuloFamilia",
          "Stock",
          "FechaAlta",
          "Activo",
        ],
        order: [["Nombre", "ASC"]],
      });
      res.json(items);
    }
  );