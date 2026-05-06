const express = require("express")
const fs = require("fs")

const app = express()
const puerto = 3000
const rutaPropuestas = "data/propuestas.json"

app.use(express.json())
app.use(express.static("public"))

function leerPropuestas() {
  const contenido = fs.readFileSync(rutaPropuestas, "utf-8")
  return JSON.parse(contenido)
}

function guardarPropuestas(propuestas) {
  const contenido = JSON.stringify(propuestas, null, 2)
  fs.writeFileSync(rutaPropuestas, contenido, "utf-8")
}

const categoriasPermitidas = [
  "prevencion-desinformacion",
  "cultura-de-paz",
  "participacion-ciudadana",
  "convivencia-digital"
]

const tonosPermitidos = [
  "informativo",
  "pedagogico",
  "preventivo",
  "convocante",
  "respetuoso"
]

app.get("/api/propuestas", (req, res) => {
  const propuestas = leerPropuestas()
  res.json(propuestas)
})

app.post("/api/propuestas", (req, res) => {
  const propuestas = leerPropuestas()

  if (!req.body.titulo || req.body.titulo.trim() === "") {
    return res.status(400).json({
      mensaje: "Falta el título. Toda propuesta debe tener un título claro."
    })
  }

  if (!req.body.mensaje || req.body.mensaje.trim() === "") {
    return res.status(400).json({
      mensaje: "Falta el mensaje. Toda propuesta debe explicar su propósito comunitario."
    })
  }

  if (!req.body.categoria || !categoriasPermitidas.includes(req.body.categoria)) {
    return res.status(400).json({
      mensaje: "La categoría es obligatoria y debe corresponder a una opción válida."
    })
  }

  if (!req.body.audiencia || req.body.audiencia.trim() === "") {
    return res.status(400).json({
      mensaje: "Falta la audiencia. Todo mensaje debe indicar a quién va dirigido."
    })
  }

  if (!req.body.tono || !tonosPermitidos.includes(req.body.tono)) {
    return res.status(400).json({
      mensaje: "El tono es obligatorio y debe corresponder a una opción válida."
    })
  }

  if (!req.body.llamadoAccion || req.body.llamadoAccion.trim() === "") {
    return res.status(400).json({
      mensaje: "Falta el llamado a la acción. La propuesta debe indicar qué se espera de la comunidad."
    })
  }

  if (!req.body.autor || req.body.autor.trim() === "") {
    return res.status(400).json({
      mensaje: "Falta el autor o grupo responsable de la propuesta."
    })
  }

  const nuevaPropuesta = {
    id: propuestas.length + 1,
    titulo: req.body.titulo.trim(),
    mensaje: req.body.mensaje.trim(),
    categoria: req.body.categoria,
    audiencia: req.body.audiencia.trim(),
    tono: req.body.tono,
    llamadoAccion: req.body.llamadoAccion.trim(),
    autor: req.body.autor.trim(),
    estado: "recibida",
    revisionEditorial: "pendiente",
    fecha: new Date().toISOString()
  }

  propuestas.push(nuevaPropuesta)
  guardarPropuestas(propuestas)

  res.status(201).json({
    mensaje: "Gracias. Tu propuesta fue recibida, guardada y queda pendiente de revisión editorial responsable.",
    propuesta: nuevaPropuesta
  })
})

app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada. Revisa la dirección solicitada."
  })
})

app.listen(puerto, () => {
  console.log("API comunitaria funcionando en http://localhost:3000")
  console.log("Rutas disponibles:")
  console.log("GET  /api/propuestas")
  console.log("POST /api/propuestas")
})
