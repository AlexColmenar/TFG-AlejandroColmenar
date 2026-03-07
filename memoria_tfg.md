# Memoria Trabajo Fin de Grado

## Mentes Insolitas


### Datos del Proyecto
- **Alumno**: Alejandro Colmenar Arévalo
- **Correo electrónico**: alexcolmenar022@gmail.com
- **Título del Proyecto**: Mentes Insolitas
- **Ciclo Formativo**: Desarrollo de Aplicaciones Web
- **Centro**: IES Amparo Sanz
- **Curso**: 2025/2026
- **Tutor**: Carlos Roncero Parra
- **Repositorio**: [Mentes Insolitas](https://github.com/alexcolmenar/TFG-AlejandroColmenar)
- **Credenciales**:
  - Usuario: admin@gmail.com
  - Contraseña: 'Ofrecida durante la presentacion'
  - **Cliente normal**:
    - Registro durante la clase

---
## Indice

1. [Introducción](#1-introducción)
2. [Estado del Arte](#2-estado-del-arte)
3. [Estudio de Viabilidad](#3-estudio-de-viabilidad)
4. [Análisis de Requisitos](#4-análisis-de-requisitos)
5. [Diseño](#5-diseño)
6. [Codificación](#6-codificación)
7. [Despliegue](#7-despliegue)
8. [Herramientas de Apoyo](#8-herramientas-de-apoyo)
9. [Gestión de Pruebas](#9-gestión-de-pruebas)
10. [Conclusiones](#10-conclusiones)
11. [Bibliografía](#11-bibliografía)

---
## 1. Introducción

### 1.1. Motivación del Proyecto
El proyecto **"Mentes Insólitas"** nace de una motivación profundamente personal y de la observación directa de una necesidad real en la sociedad. La inspiración principal surge a raíz de mi hermano Iván, quien es neurodivergente y tiene autismo. Convivir y crecer a su lado me ha permitido comprender de primera mano los retos diarios a los que se enfrentan las personas con este tipo de condiciones, así como las dificultades que atraviesan sus familias.

A través de mi experiencia personal y del contacto con otras personas en situaciones similares, he desarrollado una gran empatía hacia este colectivo. He podido identificar una carencia importante en el ámbito digital: la falta de plataformas integrales que no solo ofrezcan productos adaptados a sus necesidades específicas, sino que también fomenten un entorno seguro y accesible para la socialización. Para muchas personas neurodivergentes, establecer relaciones sociales, encontrar espacios donde sentirse comprendidas o participar en actividades de ocio puede ser un gran desafío. Por ello, la idea central de este proyecto es utilizar la tecnología para facilitar esa conexión, aportando un granito de arena para mejorar su calidad de vida y la de su entorno.

### 1.2. Objetivos del Proyecto
El objetivo principal de "Mentes Insólitas" es diseñar y desarrollar una aplicación web completa que sirva como punto de apoyo y de encuentro para personas neurodivergentes y sus familias. La plataforma busca combinar el comercio electrónico de artículos especializados con la organización de eventos sociales.

A largo plazo, la visión y los **objetivos generales** de la plataforma son ambiciosos y de marcado carácter social:
*   **Fomentar la socialización:** Proporcionar un medio seguro para que las personas con neurodivergencias puedan interactuar, conocer a otras personas afines y participar en actividades presenciales.
*   **Servir de herramienta de apoyo institucional y familiar:** Alcanzar un nivel de utilidad que permita que la plataforma sea usada por familias, centros educativos y asociaciones.

Dentro del alcance de este Trabajo Fin de Grado, se han definido los siguientes **objetivos específicos**:
*   Desarrollar una tienda online (e-commerce) para la catalogación y compra de productos específicos.
*   Implementar un sistema de gestión de "Encuentros", donde los usuarios puedan apuntarse a actividades presenciales.
*   Crear un sistema de gestión de usuarios con autenticación segura y roles diferenciados.
*   Automatizar la generación de facturas y entradas en formato PDF.
*   Diseñar una interfaz de usuario clara, intuitiva y accesible.

### 1.3. Contexto del Proyecto
Este trabajo se presenta como Proyecto Final del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW). Técnicamente, es una aplicación web de pila completa (Full Stack) desarrollada con Node.js, Express, base de datos MySQL mediante Sequelize, y Pug para el renderizado del frontend.

---

## 2. Estado del Arte

### 2.1. Análisis del entorno actual
Aunque internet ofrece un acceso sin precedentes a comunidades de apoyo, existe una notable fragmentación en los servicios ofrecidos al público neurodivergente. Las familias tienen que recurrir a múltiples plataformas inconexas: unas para adquirir material adaptado y otras para encontrar eventos o grupos de apoyo.

### 2.2. Soluciones y plataformas existentes
*   **Tiendas online:** Existen comercios dedicados a material terapéutico (o categorías en Amazon), pero son puramente transaccionales y carecen de comunidad.
*   **Plataformas de eventos:** Herramientas como Meetup o Eventbrite son generalistas. Al no estar diseñadas para este público, no garantizan un entorno adaptado.
*   **Webs de asociaciones:** Son excelentes fuentes de información, pero tecnológicamente suelen carecer de sistemas modernos de tienda y reservas dinámicas.

### 2.3. Propuesta de valor
Frente a esta fragmentación, **"Mentes Insólitas"** ofrece:
1.  **Centralización:** Agrupa la adquisición de productos físicos y la participación en actividades presenciales.
2.  **Entorno de nicho:** Diseño y catálogo enfocados exclusivamente en neurodivergencias, aportando seguridad.
3.  **Fomento activo de la socialización:** Usa el e-commerce como apoyo para el verdadero objetivo: los "Encuentros".

---

## 3. Estudio de Viabilidad

### 3.1. Viabilidad Técnica
El proyecto es viable. Se basa en tecnologías maduras (stack MEN: MySQL, Express, Node.js + Pug) estudiadas durante el ciclo. No se requiere hardware especializado y todo el software empleado es Open Source o de uso libre.

### 3.2. Viabilidad Económica
Los costes directos de desarrollo son nulos (herramientas gratuitas y trabajo académico). Los futuros costes de despliegue en producción son asumibles utilizando plataformas con planes gratuitos o de bajo coste para validar el producto.

### 3.3. Viabilidad Legal
El sistema ha sido diseñado teniendo en cuenta el RGPD y la LOPDGDD (contraseñas encriptadas con bcrypt, sesiones seguras con JWT). Cumple con los requisitos básicos para el comercio electrónico.

---

## 4. Análisis de Requisitos

### 4.1. Actores del Sistema
1.  **Visitante:** Navega sin cuenta.
2.  **Usuario Registrado (Cliente/Familiar):** Compra productos y reserva encuentros.
3.  **Administrador:** Gestiona la plataforma.

### 4.2. Requisitos Funcionales (RF)
*   **RF-01 a RF-04 (Usuarios):** Registro, confirmación de email, Login/Logout y perfil de usuario.
*   **RF-05 a RF-09 (Tienda):** Catálogo de productos, detalle, carrito, proceso de pago y generación de facturas en PDF.
*   **RF-10 a RF-12 (Encuentros):** Listado de eventos, reserva de plaza y generación de entrada en PDF.
*   **RF-13 a RF-15 (Admin):** CRUD de Productos, CRUD de Encuentros y gestión de Pedidos.

### 4.3. Requisitos No Funcionales (RNF)
Rendimiento de vistas, seguridad de contraseñas (bcrypt) y sesiones (JWT en cookies httpOnly), arquitectura estricta MVC, UI accesible y limpia (pensada en evitar sobrecarga sensorial).

---

## 5. Diseño

### 5.1. Arquitectura de la Aplicación (Patrón MVC)
Se ha seguido estrictamente el patrón Modelo-Vista-Controlador:
*   **Modelo:** Gestionado por Sequelize, interactuando con MySQL.
*   **Vista:** Renderizado dinámico en servidor con Pug.
*   **Controlador:** Lógica de negocio en Express (ej. `carritoController`).

### 5.2. Diseño de la Base de Datos
*   **Entidades principales:** `usuarios`, `productos`, `encuentros`, `pedidos` (y sus `detalles_pedidos`), `reservas` y `experiencias`.
*(Nota: Añadir diagrama ER en el documento final)*

### 5.3. Diseño de la Interfaz y UX
Orientado a reducir la sobrecarga sensorial. Se usa Bootstrap para la responsividad, colores de bajo contraste y tipografías legibles. Navegación predecible mediante layouts compartidos y feedback constante al usuario.

---

## 6. Codificación

### 6.1. Estructura y Organización
Organización lógica en carpetas: `/routers`, `/controllers`, `/models`, `/middleware` y `/views`. Punto de entrada en `index.js`.

### 6.2. Estándares
Uso de ECMAScript Modules (`import`), programación asíncrona intensiva (`async/await`) y gestión segura de variables de entorno con `dotenv`.

### 6.3. Implementaciones Destacadas
*   **Autenticación JWT:** Sistema sin estado (stateless) mediante cookies protegidas e interceptadas por middlewares (`protegerRuta.js`).
*   **Lógica del Carrito:** Relación cuidadosa entre Pedidos y Detalles_Pedidos para "congelar" el precio de compra histórico.
*   **Generación de PDFs:** Uso de `pdfkit` y `fs.createWriteStream` para maquetar dinámicamente facturas y entradas basándose en coordenadas.

---

## 7. Despliegue en Producción

La fase de despliegue consistió en trasladar la aplicación "Mentes Insólitas" desde el entorno local de desarrollo a un entorno de producción accesible a través de Internet. Para este proyecto, se optó por una arquitectura robusta alojada en la nube, garantizando alta disponibilidad, seguridad y rendimiento. El proceso se llevó a cabo siguiendo una serie de pasos secuenciales y configuraciones críticas.

### 7.1. Preparación de la Infraestructura (Oracle Cloud)
El primer paso fundamental fue aprovisionar la máquina virtual que actuaría como servidor principal en la nube utilizando los servicios de **Oracle Cloud Infrastructure (OCI)**:
*   **Creación de la Instancia:** Se creó una instancia ejecutando el sistema operativo **Ubuntu 24.04** ubicada en la región de Madrid.
*   **Asignación de IP:** Dado que la instancia se creó por defecto sin salida a internet, fue necesario acceder a las opciones de la VNIC asociada para asignarle manualmente una Dirección IPv4 Pública Epímera (ej. `79.72.56.222`).
*   **Apertura de Puertos (Firewall Perimetral):** Desde el panel de control de Oracle, dentro de la Red Virtual en la Nube (VCN), se modificaron las Listas de Seguridad. Se añadieron reglas de entrada (Ingress Rules) para permitir el tráfico TCP desde cualquier origen (`0.0.0.0/0`) hacia los puertos **80 (HTTP)** y **443 (HTTPS)**, vitales para el tráfico web.

### 7.2. Configuración del Dominio DNS (OVHcloud)
Para que los usuarios pudieran acceder a la plataforma utilizando un nombre amigable en lugar de una dirección IP numérica, se configuró un nombre de dominio:
*   Se accedió al panel de gestión del proveedor **OVHcloud**.
*   En la sección de Zona DNS, se creó un registro de tipo **A** para el subdominio `mentes.alexcolmenar.es`.
*   Este registro se apuntó directamente a la IP pública asignada a la máquina de Oracle Cloud, enlazando así el nombre con el servidor físico.

### 7.3. Preparación del Servidor Ubuntu e Instalación de Dependencias
Una vez conectada la infraestructura de red, se accedió al servidor mediante el protocolo seguro SSH utilizando una clave privada (`.key` / `.pem`). El entorno de ejecución se preparó mediante los siguientes comandos:
```bash
# Actualización general de los paquetes del sistema
sudo apt update && sudo apt upgrade -y

# Instalación de las herramientas base: Node.js, NPM, Git y Nginx
sudo apt install -y nodejs npm git nginx
```

### 7.4. Clonación del Proyecto y Variables de Entorno
Con el servidor preparado, se procedió a descargar el código fuente y a configurar su conexión vital con la base de datos externa, la cual se alojó en el servicio **Aiven**:
*   Se clonó el repositorio desde GitHub (`git clone [URL]`) y se instalaron las dependencias locales del proyecto mediante `npm install`.
*   **Configuración Crítica (.env):** Se creó el archivo de variables de entorno, cuyo contenido fue clave para solucionar problemas de rendimiento y lentitud experimentados en las fases iniciales.
    *   Se definió el puerto interno de la aplicación (`PORT=13004`).
    *   Se estableció la variable `NODE_ENV=production`. Este paso fue **fundamental** para que Node.js y Express activaran sus sistemas de caché internos, lo que permitió que la web cargara en cuestión de milisegundos.
    *   En la cadena de conexión a la base de datos MySQL en Aiven, fue obligatorio especificar el parámetro `ssl-mode=REQUIRED` al final de la URL para evitar cuellos de botella en la transferencia de datos.

### 7.5. Arranque Persistente con PM2
Para asegurar la alta disponibilidad y evitar que la aplicación de Node.js se apagara al cerrar la terminal SSH o tras un reinicio físico del servidor, se implementó el gestor de procesos **PM2**:
```bash
sudo npm install -g pm2
pm2 start index.js --name "TFG-Oracle"
pm2 save
pm2 startup # Genera el script de autoarranque
```

### 7.6. Configuración del Firewall Interno (Ubuntu iptables)
Oracle incluye unas reglas internas de firewall (`iptables`) muy restrictivas a nivel de sistema operativo que bloqueaban las peticiones hacia Nginx a pesar de haber abierto los puertos en el panel web. Fue necesario forzar su apertura:
```bash
# Apertura forzada de los puertos web
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT

# Instalación del servicio para persistir las reglas tras reinicios
sudo netfilter-persistent save
```

### 7.7. Configuración de Nginx como Proxy Inverso
Se configuró Nginx para actuar como el "portero" del sistema: recibiría las visitas web públicas por los puertos estándar y las redirigiría internamente a la aplicación de Node.js que corría en el puerto 13004.
*   Se creó el archivo de configuración en `/etc/nginx/sites-available/tfg`.
*   Para evitar micro-retrasos detectados en la resolución de direcciones IPv6 (especialmente en navegadores como Safari), se especificó la directiva `proxy_pass` apuntando estrictamente a la IP de bucle local IPv4 `http://127.0.0.1:13004;` en lugar de utilizar la palabra reservada `localhost`.
*   Finalmente, se activó la configuración creando un enlace simbólico hacia `sites-enabled` y se reinició el servicio Nginx.

### 7.8. Seguridad y Certificado SSL (HTTPS con Certbot)
El último paso crítico fue asegurar la comunicación cifrando la conexión de extremo a extremo, requisito indispensable para evitar el bloqueo por parte de los navegadores web modernos.
*   Se instaló la herramienta Certbot y su plugin para Nginx (`sudo apt install certbot python3-certbot-nginx -y`).
*   Se solicitó e instaló un certificado SSL gratuito emitido por Let's Encrypt ejecutando el comando automatizado: `sudo certbot --nginx -d mentes.alexcolmenar.es`. Esto modificó la configuración de Nginx para forzar todo el tráfico HTTP hacia HTTPS, finalizando así el despliegue con éxito.

### 7.9. Despliegue en Entorno Local (Desarrollo)
Para replicar el entorno de ejecución en una máquina local con fines de desarrollo o evaluación, se deben seguir los siguientes pasos tras clonar el repositorio:

1.  **Instalar dependencias:** Es requisito indispensable tener Node.js instalado.
    ```bash
    npm install
    ```
2.  **Configurar variables de entorno:** Renombrar o copiar el archivo `.env.example` a `.env` e introducir las credenciales de conexión a la base de datos MySQL local y los secretos necesarios (JWT, email).
    ```bash
    cp .env.example .env
    ```
3.  **Arrancar el servidor de desarrollo:** Se utiliza `nodemon` (definido en el script `dev` de `package.json`) para que el servidor se reinicie automáticamente ante cualquier cambio en el código.
    ```bash
    npm run dev
    ```
    Una vez ejecutado, la aplicación estará accesible desde el navegador en `http://localhost:13004` (o el puerto definido en el archivo `.env`).

---


## 8. Herramientas de Apoyo
*   **Entorno y VCS:** WebStorm (IDE principal), Git y GitHub.
*   **Backend:** Node.js, Express (v5), NPM.
*   **Persistencia:** MySQL, Sequelize.
*   **Frontend:** Pug, Bootstrap, CSS puro.
*   **Librerías clave:** `bcrypt`, `jsonwebtoken`, `multer`, `pdfkit`, `nodemailer`.
*   **Despliegue:** Oracle Cloud, Aiven, PM2, Nginx, Certbot.

---

## 9. Gestión de Pruebas
Se implementó una estrategia de **pruebas manuales de caja negra**:
*   **Usuarios:** Validación de unicidad de emails, comprobación de encriptación de hash en la BD y validación de expiración de sesión (JWT).
*   **E-commerce:** Persistencia del carrito en base de datos al cambiar de navegador y flujo completo de finalización de compra generando factura.
*   **Encuentros:** Verificación de la correcta creación del PDF de la entrada con los datos asociados a la BD.
*   **Despliegue:** Pruebas de redirección HTTPS estricta y prueba de resiliencia del proceso deteniendo Node.js y verificando el reinicio por PM2.

---

## 10. Conclusiones

### 10.1. Valoración General
Se ha cumplido el objetivo de construir una plataforma web Full Stack funcional que une comercio electrónico y socialización para personas neurodivergentes, consolidando los conocimientos de los dos años de formación en DAW.

### 10.2. Dificultades y Soluciones
*   **PDFs dinámicos:** Dificultad para alinear elementos mediante coordenadas absolutas con `pdfkit`.
*   **Rendimiento en nube:** Alta latencia solucionada forzando conexiones SSL con la BD externa y activando el modo producción.
*   **Configuración Nginx:** Conflictos de resolución de DNS internos solucionados sustituyendo `localhost` por IP estricta (`127.0.0.1`).

### 10.3. Líneas de Trabajo Futuras
1.  Integración de Pasarela de Pago Real (Stripe/Redsys).
2.  Capacidad de facturación avanzada.
3.  Gestión integral del perfil y borrado de cuenta.
4.  Migración parcial del Frontend usando React.
5.  Herramientas avanzadas de accesibilidad web.
6.  Verificación en dos pasos (2FA) y Login OAuth 2.0 (Google/Apple).

---

## 11. Bibliografía y Webgrafía

Node.js Foundation. Node.js v20.x Documentation. 2024. Disponible en: https://nodejs.org/docs/

Express.js. Express 5.x Documentation. OpenJS Foundation, 2024. Disponible en: https://expressjs.com/es/

Sequelize. Sequelize v6 Official Documentation. 2024. Disponible en: https://sequelize.org/docs/v6/

PugJS. Pug Template Engine Documentation. 2024. Disponible en: https://pugjs.org/api/getting-started.html

Artículos y Recursos Online

Mozilla Developer Network (MDN). Web Docs: HTML, CSS, JavaScript. 2024. Disponible en: https://developer.mozilla.org/es/

Stack Overflow. Comunidad de desarrolladores. 2024. Disponible en: https://stackoverflow.com/

Herramientas y Frameworks

Bootstrap. Bootstrap v5.3 Documentation. 2024. Disponible en: https://getbootstrap.com/docs/

PDFKit. PDFKit v0.15.x Documentation. 2024. Disponible en: https://pdfkit.org/docs/getting_started.html

Nodemailer. Nodemailer v6.x Documentation. 2024. Disponible en: https://nodemailer.com/about/

Bcrypt.js. Bcrypt NPM Package Documentation. 2024. Disponible en: https://www.npmjs.com/package/bcrypt

JSON Web Token. JWT.io Documentation. Auth0, 2024. Disponible en: https://jwt.io/introduction

Oracle Cloud Infrastructure. OCI Compute and VCN Documentation. Oracle Corporation, 2024. Disponible en: https://docs.oracle.com/en-us/iaas/Content/home.htm

Aiven. Aiven for MySQL Documentation. 2024. Disponible en: https://aiven.io/docs/products/mysql

PM2. Advanced Node.js process manager Documentation. 2024. Disponible en: https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/

NGINX. NGINX Reverse Proxy Configuration. F5, 2024. Disponible en: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/

Certbot. Certbot Instructions for Ubuntu/Nginx. EFF, 2024. Disponible en: https://certbot.eff.org/

Normativas y Estándares

W3C. Web Content Accessibility Guidelines (WCAG) 2.1. 2018. Disponible en: https://www.w3.org/WAI/WCAG21/

AEPD. Guía sobre el uso de las cookies. Agencia Española de Protección de Datos, 2023. Disponible en: https://www.aepd.es/es/documento/guia-cookies.pdf
