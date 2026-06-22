# Arquitectura del Proyecto: BigQuery Release Notes App

Este proyecto es una aplicación web sencilla, rápida y moderna construida con **Python Flask** en el servidor y **HTML/CSS/JS nativo (Vanilla)** en el cliente. Su objetivo es leer y mostrar de forma estética las notas de actualización oficiales de BigQuery usando un feed RSS público.

---

## 1. Funciones Principales

*   **Extracción de Datos (Scraping/RSS):** Descarga automáticamente el archivo XML de notas de actualización desde Google Cloud.
*   **Procesamiento y Estandarización:** Analiza el XML (usando `feedparser`) para extraer únicamente los datos útiles (título, enlace, fecha, resumen y contenido) y los convierte a formato JSON.
*   **Interfaz Dinámica (SPA - Single Page Application):** Actualiza el contenido en la pantalla sin necesidad de recargar la página completa.
*   **Interactividad:** Botón de actualización con estado de carga (spinner animado) y enlaces de "Tweet" autogenerados que permiten compartir un resumen directo en X (Twitter).

---

## 2. Desglose: Servidor vs. Cliente

### El Servidor (Backend en Python / Flask)
El servidor es extremadamente ligero y actúa principalmente como un intermediario (proxy) entre la página del usuario y los servidores de Google.

**Archivos clave:** `app.py`, `requirements.txt`
*   **Ruta Raíz (`/`):** Al acceder, el servidor lee el archivo `index.html` y se lo envía al navegador web.
*   **API Endpoint (`/api/notes`):** Esta es la función clave.
    *   **Paso 1:** Ejecuta una petición hacia `https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`.
    *   **Paso 2:** Convierte el texto XML crudo en un diccionario estructurado de Python usando la librería `feedparser`.
    *   **Paso 3:** Itera sobre todos los "entries" (las notas) y limpia los datos.
    *   **Paso 4:** Empaqueta esos datos y los envía al cliente convertidos en JSON puro (`jsonify()`).

### El Cliente (Frontend en HTML/CSS/JS)
Se ejecuta completamente dentro del navegador del usuario. Se encarga de hacer la app atractiva y de manejar las peticiones de datos de forma asíncrona.

**Archivos clave:** `templates/index.html`, `static/style.css`, `static/script.js`
*   **UI / Maquetación:** Usa variables CSS, grid/flexbox y filtros de desenfoque (`backdrop-filter`) para crear un efecto de cristal (Glassmorphism) oscuro moderno.
*   **Fetch (JavaScript):** La función `fetchNotes()` es el motor. Muestra el spinner de carga, hace la llamada al servidor, espera pacientemente la respuesta, oculta el spinner y llama a `renderNotes()`.
*   **Renderizado del DOM:** Toma el arreglo (Array) de objetos JSON y crea dinámicamente tarjetas `<div>` para insertarlas en el contenedor principal (`<main>`).
*   **Construcción de Intents de Twitter:** Codifica dinámicamente el título y URL de cada tarjeta dentro de un enlace especial de la API web de Twitter: `https://twitter.com/intent/tweet?text=...`

---

## 3. Flujo de Solicitud y Respuesta (Paso a Paso)

Imaginemos el escenario donde haces clic en el botón de **"Refresh"**.

1.  **[Cliente] El evento se dispara:** Al hacer clic en "Refresh", JavaScript detecta el evento (`addEventListener('click')`).
2.  **[Cliente] Estado de carga:** Se ejecuta `setLoading(true)`, lo que deshabilita el botón temporalmente y hace visible el "spinner" dando feedback visual al usuario de que algo está pasando.
3.  **[Cliente] Solicitud HTTP al Servidor:** JavaScript ejecuta un `fetch('/api/notes')`. El navegador abre una conexión pidiendo datos al servidor Flask.
4.  **[Servidor] Intercepción Flask:** Flask recibe la petición GET en `/api/notes`.
5.  **[Servidor] Petición al Feed de Google:** El backend, sin que el cliente lo vea, hace su propia solicitud hacia los servidores de Google Cloud para obtener el XML más fresco.
6.  **[Servidor] Parsing:** Google envía un archivo enorme y caótico de XML. Flask lo analiza, extrae el título "BigQuery Analytics Hub", la fecha y un resumen. Lo convierte en un formato JSON ordenado:
    ```json
    [
      {
        "title": "BigQuery Analytics Hub...",
        "link": "https://...",
        "published": "2026-06-15...",
        "summary": "...",
        "content": "..."
      }
    ]
    ```
7.  **[Servidor] Respuesta HTTP al Cliente:** Flask devuelve el bloque JSON de arriba con un código HTTP `200 OK`.
8.  **[Cliente] Recepción de datos:** El navegador termina la espera asíncrona (`await response.json()`).
9.  **[Cliente] Inyección HTML (DOM):** La función de JavaScript limpia las notas anteriores y por cada elemento del JSON inyecta una nueva `<div class="note-card">...</div>` a la vista.
10. **[Cliente] Fin del flujo:** Se llama a `setLoading(false)`, desapareciendo el spinner y habilitando de nuevo el botón para la próxima actualización.
