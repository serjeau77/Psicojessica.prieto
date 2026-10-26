# Web Profesional para Psicóloga Jessica Prieto con Google AI (Gemini)

Plataforma web de alta conversión y estética editorial para **Jessica Prieto (Psicóloga · Universidad del Magdalena · Magíster en Psicología en las Organizaciones)**, adaptada bajo el modelo de fricción cero de **Liss Spanish Coach**, estándares éticos de salud mental y tecnología **Google Gemini**.

---

## 🌟 Novedades Implementadas para Lanzamiento a Producción

1. **Favicon e Identidad de Marca**:
   - `assets/favicon.svg`: Icono vectorial estilizado que combina el símbolo Psi de la psicología con la flor de loto y el corazón de contención emocional en colores verde salvia (`#3B5949`) y terracota (`#C67856`).
   - Etiquetas Open Graph y Twitter Cards optimizadas para vista previa en WhatsApp, Instagram y redes sociales.

2. **Cumplimiento Legal y Sanitario (Colombia)**:
   - **Ley 1581 de 2012 (Habeas Data)**: Protección reforzada para datos sensibles de salud mental y derechos ARCO (Conocer, Actualizar, Rectificar, Suprimir).
   - **Ley 1090 de 2006 (Código Deontológico de Psicología)**: Secreto profesional sanitario y consentimiento informado.
   - **Modal Legal Integrado**: Accesible desde el footer (`Aviso Legal`, `Política de Privacidad`, `Cookies`) y desde el formulario.
   - **Casilla de Consentimiento Obligatoria**: El formulario no permite el envío si el consultante no ha autorizado expresamente el tratamiento de datos confidenciales.
   - **Banner de Cookies**: Discreto y persistente mediante `localStorage`.

3. **Backend Serverless para Google AI (Gemini)**:
   - `api/psicologia-ai.js`: Función Serverless lista para producción en **Vercel** o **Netlify**.
   - Consume de forma segura la variable de entorno `GEMINI_API_KEY` sin exponerla en el navegador del usuario.
   - Dispone de limitador de tamaño y un generador clínico de respaldo (*graceful degradation*) para que la web nunca se quede en blanco si la API experimenta alta latencia.
   - `vercel.json`: Enrutamiento y configuración automática para despliegue en 1 clic.

---

## 🚀 Despliegue en 1 Clic (Recomendado: Vercel)

1. Sube esta carpeta (`Web-Psicologa`) a un repositorio en **GitHub**.
2. Conecta tu repositorio en [Vercel.com](https://vercel.com) (cuenta gratuita).
3. En la configuración de tu proyecto en Vercel, agrega la variable de entorno:
   ```env
   GEMINI_API_KEY=tu_clave_de_google_ai_studio
   ```
4. Haz clic en **Deploy**. ¡Listo! Tendrás:
   - Hosting global ultrarrápido con CDN.
   - Certificado SSL automático (HTTPS).
   - El endpoint `/api/psicologia-ai` funcionando en vivo con Google Gemini.

---

## 💻 Vista Previa Local

Puedes abrir directamente el archivo `index.html` en cualquier navegador (doble clic), o iniciar un servidor local:

```bash
# Con Python
python3 -m http.server 8080
```
Visita en tu navegador: `http://localhost:8080`

---

## 📁 Estructura del Proyecto

```
Web-Psicologa/
├── index.html              # Landing page principal, bilingüe (ES / EN)
├── jessica-prieto.jpg      # Fotografía profesional de Jessica Prieto
├── vercel.json             # Configuración de despliegue y rutas limpias
├── README.md               # Documentación completa
├── api/
│   └── psicologia-ai.js    # Función Serverless para Google Gemini API
└── assets/
    ├── favicon.svg         # Favicon vectorial oficial
    └── jessica-prieto.jpg  # Fotografía en carpeta de recursos
```
