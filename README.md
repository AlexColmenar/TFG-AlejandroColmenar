# <img src="public/img/cabezaSin.png" alt="logo" width="75"/> Mentes Insólitas - Trabajo Fin de Grado (DAW)

Plataforma web integral diseñada específicamente para personas con neurodivergencias y sus familias. Desarrollada como Trabajo Fin de Grado (TFG) para el Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW).

![Static Badge](https://img.shields.io/badge/Node_version-25.6.1-darkgreen)
![Static Badge](https://img.shields.io/badge/npm_version-11.9.0-darkgreen)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fmentes.alexcolmenar.es%2F)
![GitHub commit activity](https://img.shields.io/github/commit-activity/t/alexcolmenar/TFG-alejandroColmenar)
![Static Badge](https://img.shields.io/badge/Versi%C3%B3n-1.27-aquamarine)

[Website](mentes.alexcolmenar.es)

---

## Índice
1. [Descripción](#descripción)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Puesta en Marcha](#instalación-y-puesta-en-marcha)
6. [Configuración del Entorno](#configuración-del-entorno-env)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Base de Datos](#base-de-datos)
9. [Despliegue en Producción](#despliegue-en-producción)
10. [Contacto](#contacto)

---

## Descripción

"Mentes Insólitas" es una aplicación web de pila completa (Full Stack) que nace de una motivación social y personal. Su objetivo es unificar en un entorno seguro y accesible dos servicios fundamentales:
1. **Comercio Electrónico:** Venta de material adaptado, juguetes sensoriales y productos de apoyo.
2. **Organización de Encuentros:** Sistema de eventos presenciales y "quedadas" en distintas ciudades para fomentar la socialización, un factor clave en el desarrollo de personas con autismo y otras neurodivergencias.

---

## Características Principales

### Para Usuarios
- **Registro y Autenticación:** Sistema de registro seguro con confirmación vía correo electrónico.
- **Tienda Especializada:** Navegación por un catálogo de productos con diseño limpio (baja sobrecarga sensorial).
- **Gestión de Carrito:** Persistencia de compras, cálculos de totales y proceso de *checkout* (simulado).
- **Reserva de Encuentros:** Inscripción a eventos sociales presenciales por ciudad.
- **Área Privada (Perfil):** Historial de pedidos y reservas de eventos.
- **Descargas en PDF:** Generación dinámica de facturas de compra y tickets/entradas para eventos en formato PDF.

### Para Administradores
- **Protección de Rutas:** Acceso restringido al panel mediante Middlewares y JWT.
- **Gestión de Productos (CRUD):** Creación, edición, borrado de productos y subida de imágenes.
- **Gestión de Encuentros (CRUD):** Administración de eventos, localizaciones (ciudades, longitud/latitud) y fechas.
- **Control de Pedidos:** Visualización general de los pedidos realizados en la plataforma.

### Técnicas
- Arquitectura estricta **MVC (Modelo-Vista-Controlador)**.
- Autenticación *stateless* mediante **JSON Web Tokens (JWT)** almacenados en *cookies httpOnly*.
- Contraseñas encriptadas mediante algoritmos de *hashing* seguro (**bcrypt**).
- Renderizado de vistas en el servidor (**Server-Side Rendering**) usando Pug para máxima compatibilidad e indexación.

---

## Tecnologías Utilizadas

**Backend:**
- Node.js
- Express.js (Framework web)
- JWT (Autenticación)
- Bcrypt (Seguridad)
- PDFKit (Generación de documentos PDF)
- Nodemailer (Envío de correos)
- Multer (Gestión de subida de archivos)

**Frontend:**
- Pug (Motor de plantillas)
- CSS Puro / Bootstrap (Diseño responsivo y accesibilidad)

**Base de Datos:**
- MySQL (Motor relacional)
- Sequelize (ORM)

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema local antes de comenzar:
- [Node.js](https://nodejs.org/) (Versión 18.x o superior recomendada)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (Versión 8.0+)
- [Git](https://git-scm.com/)

---

## Instalación y Puesta en Marcha

Sigue estos pasos para levantar el entorno de desarrollo local:

1. **Clonar el repositorio:**
```bash
git clone https://github.com/TU_USUARIO/MentesInsolitas.git
cd MentesInsolitas
```

2. **Instalar las dependencias de Node.js:**
```bash
npm install
```

3. **Configurar las variables de entorno:**
Renombra el archivo de ejemplo para crear tu propio archivo `.env` local.
```bash
cp .env.example .env
```

4. **Arrancar el servidor en modo desarrollo:**
El proyecto utiliza *nodemon* para recargar automáticamente al guardar cambios.
```bash
npm run dev
```
La aplicación estará disponible por defecto en: `http://localhost:13004` (o el puerto configurado en el `.env`).

---

## Configuración del Entorno (.env)

Para que el sistema funcione correctamente, debes configurar tu base de datos y los servicios externos en tu archivo `.env`. Este es un ejemplo de las claves requeridas:

```env
# Servidor
PORT=13004
NODE_ENV=development

# Base de Datos (Secuelize / MySQL)
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_contrasena
DB_NAME=mentes_insolitas

# Autenticación
JWT_SECRET=una_cadena_de_texto_secreta_y_larga

# Envío de Correos (Ej: Gmail o Mailgun)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contrasena_de_aplicacion
```

---

## Estructura del Proyecto

La arquitectura sigue el patrón **MVC**:

```text
MentesInsolitas/
├── BBDD/              # Configuración de conexión a la BD
├── controllers/       # Lógica de negocio (C)
├── middleware/        # Interceptores (Auth, JWT, Multer)
├── models/            # Esquemas y Relaciones Sequelize (M)
├── public/            # Archivos estáticos
│   ├── diseno/        # CSS, Bootstrap
│   ├── img/           # Imágenes (Productos, Encuentros)
│   ├── entradas/      # PDFs de eventos generados (dinámico)
│   └── facturas/      # PDFs de compras generadas (dinámico)
├── routers/           # Definición de endpoints y rutas (Express)
├── views/             # Plantillas renderizables (V)
│   ├── fijo/          # Layouts, Header, Footer (Reutilizables)
│   └── ...            # Vistas principales (Pug)
├── index.js           # Punto de entrada principal de la aplicación
└── package.json       # Dependencias y scripts
```

---

## Base de Datos

El sistema está soportado por una base de datos relacional (MySQL). Las tablas principales son gestionadas por Sequelize e incluyen:

- `Usuarios`: Almacena información de registro y el rol (Cliente/Admin). Relación `1:N` con *Pedidos* y *Reservas*.
- `Productos`: Catálogo de la tienda. Relación `1:N` con *Detalles_Pedidos*.
- `Encuentros`: Eventos sociales. Almacena fecha, lugar y coordenadas. Relación `1:N` con *Reservas*.
- `Pedidos` y `Detalles_Pedidos`: Manejan la lógica del carrito de compras, "congelando" los precios unitarios en el momento exacto de la compra.
- `Reservas`: Gestiona la asistencia a los eventos, funcionando como entradas.

*(Nota: En un entorno de desarrollo, Sequelize sincronizará y creará estas tablas automáticamente la primera vez que se ejecute la aplicación si así se configura en `db.js`)*.

---

## Despliegue en Producción

El proyecto está diseñado para ser puesto en producción utilizando infraestructuras modernas. El despliegue actual (descrito en detalle en la memoria del TFG) utiliza:

1. **Oracle Cloud (IaaS):** Instancia virtual con Ubuntu 24.04.
2. **Aiven (DBaaS):** Base de datos MySQL alojada externamente, forzando la conexión mediante modo SSL (`ssl-mode=REQUIRED`).
3. **PM2:** Gestor de procesos para Node.js, asegurando la persistencia y autoarranque del servidor.
4. **Nginx:** Configurado como Proxy Inverso.
5. **Certbot (Let's Encrypt):** Implementación de HTTPS para asegurar el tráfico web.

---

## Contacto

Proyecto desarrollado por:
**Alejandro Colmenar** - Estudiante de 2º DAW

- 🔗 **GitHub:** [@alexcolmenar](https://github.com/alexcolmenar)
- 🌐 **Web en Producción:** [mentes.alexcolmenar.es](https://mentes.alexcolmenar.es)

---
*Desarrollado por Alejandro Colmenar para el mundo*