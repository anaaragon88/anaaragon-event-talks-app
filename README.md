# BigQuery Release Notes App

Una aplicación web moderna y elegante que extrae, procesa y visualiza las notas de actualización oficiales de Google Cloud BigQuery en tiempo real, con la capacidad de compartir cada actualización directamente en Twitter (X).

## ✨ Características

- **Sincronización en vivo:** Extrae automáticamente las últimas actualizaciones a través del feed RSS público de Google Cloud.
- **Diseño Premium:** Interfaz de usuario "Glassmorphism" construida con Vanilla CSS (modo oscuro).
- **Compartir Fácilmente:** Genera enlaces inteligentes para compartir rápidamente cualquier actualización en Twitter usando Web Intents.
- **Actualización dinámica:** Refresca las notas sin tener que recargar la página gracias a JavaScript asíncrono y la API Fetch.

## 🛠 Tecnologías Utilizadas

- **Backend:** Python 3, Flask, `feedparser`
- **Frontend:** HTML5, CSS3 nativo, JavaScript (ES6)

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- Python 3.9 o superior
- pip (Administrador de paquetes de Python)

## 🚀 Instalación y Uso

1. **Clona el repositorio** o navega a la carpeta del proyecto:
   ```bash
   cd bq-releases-notes
   ```

2. **Crea y activa un entorno virtual (recomendado):**
   ```bash
   # En macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicia el servidor Flask:**
   ```bash
   python app.py
   ```

5. **Abre la aplicación:**
   Dirígete a tu navegador y visita [http://localhost:8080](http://localhost:8080) (o el puerto configurado si fue modificado).

## 📁 Estructura del Proyecto

```text
bq-releases-notes/
├── app.py                  # Servidor backend en Flask
├── requirements.txt        # Dependencias de Python
├── .gitignore              # Archivos ignorados por Git
├── static/
│   ├── script.js           # Lógica del frontend y fetch a la API
│   └── style.css           # Estilos modernos de la aplicación
└── templates/
    └── index.html          # Vista principal de la aplicación
```
