const titulo = document.getElementById("titulo")
const mensaje = document.getElementById("mensaje")
const categoria = document.getElementById("categoria")
const audiencia = document.getElementById("audiencia")
const tono = document.getElementById("tono")
const llamadoAccion = document.getElementById("llamadoAccion")
const autor = document.getElementById("autor")

const btnEnviar = document.getElementById("btnEnviar")
const btnCargar = document.getElementById("btnCargar")

const respuestaEnvio = document.getElementById("respuestaEnvio")
const contenedorPropuestas = document.getElementById("contenedorPropuestas")

btnEnviar.addEventListener("click", async () => {
  const nuevaPropuesta = {
    titulo: titulo.value,
    mensaje: mensaje.value,
    categoria: categoria.value,
    audiencia: audiencia.value,
    tono: tono.value,
    llamadoAccion: llamadoAccion.value,
    autor: autor.value
  }

  const respuesta = await fetch("/api/propuestas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaPropuesta)
  })

  const datos = await respuesta.json()

  respuestaEnvio.textContent = datos.mensaje

  if (respuesta.ok) {
    await cargarPropuestas()
  }
})

btnCargar.addEventListener("click", async () => {
  await cargarPropuestas()
})

async function cargarPropuestas() {
  const respuesta = await fetch("/api/propuestas")
  const propuestas = await respuesta.json()

  contenedorPropuestas.innerHTML = ""

  for (const propuesta of propuestas) {
    const bloque = document.createElement("div")

    bloque.innerHTML = `
      <h3>${propuesta.titulo}</h3>
      <p>${propuesta.mensaje}</p>
      <p>Categoría: ${propuesta.categoria}</p>
      <p>Audiencia: ${propuesta.audiencia}</p>
      <p>Tono: ${propuesta.tono}</p>
      <p>Llamado a la acción: ${propuesta.llamadoAccion}</p>
      <p>Autor: ${propuesta.autor}</p>
      <p>Estado: ${propuesta.estado}</p>
      <p>Revisión editorial: ${propuesta.revisionEditorial}</p>
      <p>Fecha: ${propuesta.fecha}</p>
      <hr>
    `

    contenedorPropuestas.appendChild(bloque)
  }
}
