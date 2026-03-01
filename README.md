# 🥗 NutriPlan — Planificador Alimenticio con IA

> Plan alimenticio personalizado de 7 días generado con **Google Gemini AI** + **TheMealDB** + **Open Food Facts**

![NutriPlan](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

---

## ✨ Características

- 🎯 **5 objetivos especializados**: H. Pylori, Aumentar peso, Masa muscular, Bajar peso, Mantener
- 🤖 **IA con Gemini**: Genera planes únicos y personalizados (gratis)
- 🍽️ **Recetas reales**: TheMealDB con fotos e instrucciones
- 📊 **Macronutrientes**: Calorías, proteína, carbos y grasas por comida
- 📅 **Plan semanal**: Lunes a domingo completo
- 📄 **Exportar PDF**: Con jsPDF sin backend
- 💾 **Offline-ready**: localStorage para guardar el plan
- 📱 **100% Responsivo**: Móvil, tablet y escritorio

---

## 🚀 Instalación Local (5 pasos)

### Requisitos previos
- **Node.js** v18 o superior → [descargar](https://nodejs.org)
- **npm** o **yarn** (viene con Node)
- Git (opcional)

---

### Paso 1 — Clonar o descargar el proyecto

```bash
# Opción A: Con git
git clone https://github.com/NicolasM911/NutriPlan-by-nicode
cd NutriPlan-by-nicode

# Opción B: Si descargaste el zip
cd NutriPlan-by-nicode # entra a la carpeta del proyecto
```

---

### Paso 2 — Instalar dependencias

```bash
npm install
```

Esto instala React, Vite, Tailwind, Framer Motion, jsPDF y todas las dependencias.

---

### Paso 3 — Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env
```

Luego abre el archivo `.env` y agrega tu API key de Gemini:

```env
VITE_GEMINI_API_KEY=AIzaSy...tu_key_aqui
```

#### 🔑 Cómo obtener tu API key de Gemini (GRATIS):

1. Ve a [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API key"**
4. Copia la key y pégala en el `.env`

> ⚠️ **Sin API key** el proyecto funciona en **modo demo** con un plan pre-generado completo. Perfecto para probar la UI.

---

### Paso 4 — Ejecutar en desarrollo

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

### Paso 5 — ¡Listo! 🎉

Verás la pantalla de inicio de NutriPlan. Haz clic en **"Crear mi plan gratis"** y sigue los pasos.

---

## 🏗️ Estructura del proyecto

```
nutriplan/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Form/
│   │   │   └── UserForm.jsx        # Formulario multi-paso
│   │   ├── Plan/
│   │   │   ├── DayCard.jsx         # Tarjeta de un día
│   │   │   └── MealCard.jsx        # Tarjeta de una comida
│   │   └── UI/
│   │       ├── Header.jsx          # Navegación
│   │       ├── LoadingScreen.jsx   # Pantalla de carga animada
│   │       └── MacroBar.jsx        # Barras de macronutrientes
│   ├── hooks/
│   │   └── useStorage.js           # Hook para localStorage
│   ├── pages/
│   │   ├── Landing.jsx             # Página de inicio
│   │   ├── Form.jsx                # Formulario de parámetros
│   │   ├── Plan.jsx                # Vista del plan semanal
│   │   └── MealDetail.jsx          # Detalle de una comida
│   ├── utils/
│   │   ├── api.js                  # TheMealDB + OpenFoodFacts + Gemini
│   │   ├── nutrition.js            # Cálculo TDEE + macros
│   │   └── pdfExport.js            # Exportación PDF
│   ├── App.jsx                     # Router principal
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Estilos globales + Tailwind
├── .env.example                    # Template de variables
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🌐 Deploy en Nube (Gratis)

### Opción A: Vercel (Recomendado — más fácil)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Configura la variable de entorno en el dashboard de Vercel:
#    Settings → Environment Variables → VITE_GEMINI_API_KEY
```

O simplemente:
1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu repo
3. Agrega `VITE_GEMINI_API_KEY` en Settings → Environment Variables
4. Deploy automático ✅

---

### Opción B: Netlify

```bash
# 1. Build
npm run build

# 2. Arrastra la carpeta 'dist' a netlify.com/drop
```

O con CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

> ⚠️ **Importante**: En Netlify agrega un archivo `public/_redirects`:
```
/* /index.html 200
```

---

### Opción C: GitHub Pages

```bash
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agrega en package.json:
"homepage": "https://tu-usuario.github.io/nutriplan",
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 3. Agrega en vite.config.js:
base: '/nutriplan/'

# 4. Build y deploy
npm run build && npm run deploy
```

---

## 🔌 APIs utilizadas

| API | Costo | Uso |
|-----|-------|-----|
| **Google Gemini 1.5 Flash** | Gratis (60 req/min) | Genera el plan de 7 días |
| **TheMealDB** | Gratis (sin key) | Recetas reales con fotos |
| **Open Food Facts** | Gratis (open source) | Información nutricional |

---

## 🎨 Tecnologías

- **React 18** + **Vite 5** — Frontend rápido y moderno
- **Tailwind CSS 3** — Estilos utilitarios con paleta cálida personalizada
- **Framer Motion** — Animaciones fluidas
- **React Router v6** — Navegación SPA
- **jsPDF** — Exportación PDF sin backend
- **localStorage** — Persistencia del plan sin base de datos

---

## 🧪 Modo Demo (sin API key)

Si no configuras la API key, el sistema genera automáticamente un plan completo de demostración con:
- 7 días de comidas variadas
- 4 comidas por día (desayuno, almuerzo, cena, snack)
- Macronutrientes calculados
- Consejos específicos según el objetivo elegido
- Toda la UI funcional incluyendo PDF

---

## 🐛 Problemas comunes

**"Module not found"**
```bash
rm -rf node_modules && npm install
```

**Puerto 5173 ocupado**
```bash
npm run dev -- --port 3000
```

**La IA no responde**
- Verifica que `VITE_GEMINI_API_KEY` esté correcto en `.env`
- Asegúrate de que la key no tenga espacios extra
- El modo demo se activa automáticamente si hay error

**Tailwind no aplica estilos**
```bash
npm run dev  # reinicia el servidor
```

---

## 📝 Licencia

MIT — Libre para uso personal y comercial.

---

Hecho con ❤️ y 🥗 | Powered by Gemini AI + TheMealDB
