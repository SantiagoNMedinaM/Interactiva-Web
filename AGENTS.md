## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# Interactiva Web — Contexto del Proyecto

## ¿Qué es este proyecto?

Frontend estático en **Astro** para **Interactiva**, una consultora de RRHH y gestión de capital humano con más de 20 años en el mercado argentino. El sitio consume la API REST de WordPress como backend headless.

El objetivo del sitio es ser una herramienta comercial **B2B** — no un portal de empleo. Su función es presentar servicios, generar consultas de empresas y posicionar a Interactiva como socio estratégico en gestión de capital humano.

---

## Stack técnico

- **Frontend:** Astro (output: static)
- **Backend/CMS:** WordPress en `https://interactiva.com.ar/wp-json/wp/v2/`
- **Estilos:** CSS puro con variables (sin Tailwind, sin frameworks de CSS)
- **Deploy:** Netlify o Vercel (por confirmar)
- **API de ofertas laborales:** MiCurriculum en `https://micurriculum.com.ar/api/avisos/ultimos`

---

## Paleta de colores

```css
:root {
  --orange: #F07320;
  --orange-light: #FFF3EA;
  --orange-dark: #C25A0E;
  --navy: #0F1C2E;
  --navy-mid: #1E3148;
  --slate: #3D5166;
  --muted: #6B7A8D;
  --light: #F7F5F2;
  --white: #FFFFFF;
  --border: #E2DDD8;
  --green: #1A7A5E;
  --green-light: #EAF7F2;
}
```

## Tipografía

```
Headings: 'Fraunces' (serif) — Google Fonts
Body: 'DM Sans' (sans-serif) — Google Fonts
```

---

## Arquitectura del sitio

### Menú principal
1. Por qué Interactiva
2. Servicios / Soluciones
3. Cuándo podemos ayudarte
4. Blog
5. Oportunidades laborales
6. Contacto

El item "Soy empresa / organización" debe tener tratamiento visual destacado (botón naranja en el nav).

### Páginas a construir

| Ruta | Descripción |
|------|-------------|
| `/` | Home (landing page completa) |
| `/blog` | Listado de entradas del blog |
| `/blog/[slug]` | Entrada individual |
| `/servicios` | Detalle de servicios |
| `/contacto` | Formulario de contacto B2B |

### Secciones de la Home (en orden)

1. Hero — Mensaje principal + 2 CTAs + cards de servicios
2. Por qué Interactiva — 6 diferenciales en cards
3. Servicios / Soluciones — 3 categorías
4. Cuándo podemos ayudarte — 6 situaciones reales + CTA
5. Centro de Recursos — 3 recursos descargables
6. Últimas 3 oportunidades laborales — desde API MiCurriculum
7. Blog — Últimas 3 entradas desde WordPress API
8. MiCurriculum — Sección diferencial tecnológico
9. CTA final + Formulario de contacto B2B
10. Footer

---

## Dos públicos diferenciados

### Empresas / Organizaciones (PRINCIPAL)
Recorrido: Home → Soy empresa → Servicios → Cuándo podemos ayudarte → Contacto/WhatsApp
Todo el sitio está orientado a este público.

### Candidatos (SECUNDARIO)
Recorrido: Home → Oportunidades laborales → MiCurriculum → Postulación
No deben mezclarse los recorridos.

---

## Contenidos clave

### Propuesta de valor (Hero)
Título: "Ayudamos a las empresas y organizaciones a tomar mejores decisiones en gestión de capital humano."

Bajada: "Nuestra experiencia en los contextos empresariales y un enfoque regional nos permiten brindar soluciones prácticas y flexibilidad. Entendemos la necesidad, proponemos la solución adecuada, adaptándola al tamaño y realidad de cada organización, y finalmente acompañamos la implementación o el proceso contratado."

CTAs:
- Principal: "Soy empresa / organización" → /contacto
- Secundario: "Oportunidades laborales" → MiCurriculum

### Slogan de marca
"Raíces locales, visión regional."

### Servicios

A. Atracción de talento
"Encontramos y acercamos el talento que tu organización necesita."
- Búsqueda y selección
- Headhunting / reclutamiento especializado
- Evaluación de candidatos

B. Consultoría en capital humano
"Te ayudamos a ordenar, mejorar y profesionalizar la gestión de personas."
- Asesoramiento
- Diseño y revisión de perfiles
- Acompañamiento ante necesidades concretas

C. Módulos On Demand
"Contratá solamente lo que necesitás."
- Diseño de perfil del puesto
- Reclutamiento primario y preselección
- Verificación de referencias laborales
- Coordinación de exámenes preocupacionales
- Coordinación de ingreso
- Encuestas de egreso
- Acompañamiento al ingreso

### Cuándo podemos ayudarte

1. Necesitás incorporar una persona clave
2. No estás encontrando perfiles adecuados
3. Necesitás realizar una búsqueda especializada o confidencial
4. Querés ordenar o mejorar algún proceso de gestión de personas
5. Necesitás definir mejor un perfil o puesto antes de iniciar una búsqueda
6. Tenés una necesidad puntual y querés contratar solo una parte del proceso

Cierre: "Contanos tu situación. Analizamos la necesidad y vemos la mejor solución."

### Formulario de contacto B2B

Campos:
- Nombre
- Empresa / organización
- Cargo
- Email
- Teléfono
- Motivo de consulta (select)
- Mensaje

CTA: "Consultar por WhatsApp" (aclaración: canal exclusivo para empresas)

---

## WordPress API — Endpoints a usar

Base URL: https://interactiva.com.ar/wp-json/wp/v2

Últimas 3 entradas del blog:
GET /posts?per_page=3&_embed

Post individual por slug:
GET /posts?slug=${slug}&_embed

Todos los posts para /blog:
GET /posts?per_page=10&_embed

El parámetro _embed incluye imagen destacada, autor y categorías en la misma respuesta.

### Funciones fetch recomendadas (src/lib/wordpress.js)

```javascript
const WP_API = import.meta.env.PUBLIC_WP_API

export async function getLatestPosts(count = 3) {
  const res = await fetch(`${WP_API}/posts?per_page=${count}&_embed`)
  if (!res.ok) return []
  return res.json()
}

export async function getPostBySlug(slug) {
  const res = await fetch(`${WP_API}/posts?slug=${slug}&_embed`)
  if (!res.ok) return null
  const posts = await res.json()
  return posts[0] ?? null
}

export async function getAllPosts() {
  const res = await fetch(`${WP_API}/posts?per_page=100&_embed`)
  if (!res.ok) return []
  return res.json()
}
```

---

## API MiCurriculum — Oportunidades laborales

El endpoint exacto está pendiente de confirmación con el cliente.
Por ahora usar datos mockeados en src/lib/micurriculum.js:

```javascript
export async function getLatestJobs() {
  return [
    {
      id: 1,
      title: 'Gerente de Ventas – Rubro Industrial',
      location: 'Resistencia, Chaco',
      type: 'Tiempo completo',
      badge: 'Nuevo',
      url: 'https://www.micurriculum.com.ar'
    },
    {
      id: 2,
      title: 'Analista de RRHH Sr.',
      location: 'Corrientes Capital',
      type: 'Tiempo completo',
      badge: 'Urgente',
      url: 'https://www.micurriculum.com.ar'
    },
    {
      id: 3,
      title: 'Jefe de Planta – Agroindustria',
      location: 'Formosa',
      type: 'Tiempo completo',
      badge: 'Activo',
      url: 'https://www.micurriculum.com.ar'
    }
  ]
}
```

El endpoint actual es: `https://micurriculum.com.ar/api/avisos/ultimos`

---

## Variables de entorno (.env)

```
PUBLIC_WP_API=https://interactiva.com.ar/wp-json/wp/v2
PUBLIC_SITE_URL=https://interactiva.com.ar
PUBLIC_WHATSAPP=5492657640728
```

---

## Criterios de diseño

- Priorizar claridad sobre cantidad de información
- Hablar desde las necesidades del cliente, no desde los servicios
- Evitar lenguaje excesivamente corporativo
- CTAs claros y orientados a conversión
- Transmitir: profesionalismo, cercanía, experiencia, flexibilidad
- No mezclar los recorridos de empresas y candidatos
- Diseño responsive — desktop y mobile
- Paleta: naranja como acento, navy como fondo oscuro, blanco y gris claro como fondos neutros

---

## Referencia visual

El mockup de referencia está en interactiva_mockup_v2.html — fusión entre el estilo de nortempo.com (limpio, B2B, profesional) y la identidad visual de Interactiva (naranja + navy). Usá ese archivo como guía visual para todos los componentes.

---

## Lo que ya está hecho en WordPress (no modificar)

- Rank Math SEO configurado
- Blog activo con primera entrada publicada
- Backup con UpdraftPlus
- Open Graph para LinkedIn configurado
- Sitemap XML activo
- Imágenes sociales subidas

---

## Notas importantes

- El cliente (Marcelo) necesita poder cargar contenido solo desde wp-admin
- La integración con MiCurriculum API está pendiente — usar mock data hasta tenerla
- El formulario de contacto es SOLO para empresas — candidatos van a MiCurriculum
- WordPress queda en el dominio actual; Astro se deploya en Netlify/Vercel
- Cuando el cliente carga contenido nuevo, se necesita rebuild — configurar webhook
- Desarrollador: Santiago Medina (estudiante de Ingeniería en Software, UNSJ)