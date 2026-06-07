# Asesoría Financiera M&S

Landing page premium para **Asesoría Financiera M&S**, empresa de servicios financieros con respaldo inmobiliario.

El negocio conecta dos públicos usando la finca raíz como garantía:

- **Quien necesita dinero** → recibe un **crédito** dejando su inmueble como garantía hipotecaria, con el interés más bajo del mercado y sin vender su propiedad.
- **Quien tiene capital** → lo **invierte en hipotecas** con respaldo real para obtener rentabilidad.

Las condiciones (monto, plazo e interés) se acuerdan directamente con cada cliente.

## ✨ Características

- Diseño minimalista y premium estilo banca privada (azul medianoche + dorado champagne + marfil)
- Tipografía editorial: Cormorant Garamond + Inter
- 100% responsive (mobile-first) y accesible
- Animaciones: preloader, reveals al hacer scroll, contadores, malla dorada animada
- **Simulador de crédito** interactivo (valor del inmueble → monto estimado)
- Acordeón de preguntas frecuentes
- Formulario de contacto que envía la solicitud directamente a **WhatsApp**
- Sin dependencias ni build: HTML, CSS y JavaScript puro

## 🚀 Cómo verla

**Opción rápida:** abre `index.html` directamente en tu navegador.

**Con servidor local** (recomendado, requiere [Node.js](https://nodejs.org)):

```bash
node server.js
```

Luego abre http://localhost:5202

## 🛠️ Personalización

| Qué cambiar | Dónde |
|---|---|
| Número de WhatsApp | constante `WHATSAPP` en `js/main.js` |
| Textos y secciones | `index.html` |
| Colores y tipografía | variables `:root` en `css/styles.css` |
| Logo | emblema SVG `#ms-emblem` en `index.html` (provisional) |

## 📁 Estructura

```
asesoria-financiera-ms/
├── index.html          # Estructura y contenido
├── css/styles.css      # Estilos y animaciones
├── js/main.js          # Interacciones (simulador, formulario, menú)
├── assets/favicon.svg  # Favicon de marca
└── server.js           # Servidor estático opcional para previsualizar
```

---

© Asesoría Financiera M&S. Las cifras y rentabilidades mostradas son ilustrativas y no constituyen una oferta vinculante.
