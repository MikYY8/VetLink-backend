# VetLink Backend

VetLink Backend es una API desarrollada con Node.js y Express para gestionar las operaciones de una aplicación veterinaria. Proporciona funcionalidades como la gestión de usuarios, veterinarios, turnos, registros clínicos, recetas, vacunas y más.

## Características principales
- Gestión de usuarios y veterinarios.
- Creación y administración de turnos.
- Registro y consulta de historiales clínicos.
- Gestión de recetas y vacunas.
- Autenticación y autorización con JWT.
- Integración con Cloudinary para la gestión de imágenes.

## Tecnologías utilizadas
- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para construir aplicaciones web y APIs.
- **MongoDB**: Base de datos NoSQL.
- **Mongoose**: ODM para MongoDB.
- **JWT**: Para autenticación y autorización.

## Requisitos previos
Tener instalados los siguientes programas:
- [Node.js](https://nodejs.org/) (versión 16 o superior recomendada).
- [MongoDB](https://www.mongodb.com/) (local o en la nube).

## Instalación
1. Clonar este repositorio:
   ```bash
   git clone https://github.com/MikYY8/VetLink-back.git
   ```
2. Navegar al directorio del proyecto:
   ```bash
   cd vetlink-backend
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```
4. Crear un archivo `.env` en la raíz del proyecto y configurar las siguientes variables de entorno:
   ```env
   PORT=3000
   MONGOURL=tu_url_de_mongodb
   JWT_ACCESS=tu_clave_secreta_jwt
   ```

## Uso
1. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   O en modo producción:
   ```bash
   npm start
   ```
2. Acceder a la API en `http://localhost:3000`.

## Endpoints principales
- **Usuarios**: `/users`
- **Veterinarios**: `/vets`
- **Dueños**: `/owner`
- **Turnos**: `/appointment`
- **Registros clínicos**: `/clinicalRecord`
- **Recetas**: `/prescription`
- **Vacunas**: `/vaccines`

## Estructura del proyecto
```
src/
├── config/               # Configuración (e.g., Cloudinary)
├── controllers/          # Controladores de las rutas
├── middlewares/          # Middlewares para autenticación y validación
├── models/               # Modelos de datos (Mongoose)
├── routes/               # Definición de rutas
├── services/             # Lógica de negocio
├── utils/                # Utilidades (e.g., JWT, Scheduler)
├── validations/          # Validaciones de datos
```

---

**Creado por:** MikYY8
