# Amigas de Lidia - Club de Socios

Sistema de gestión de puntos para el Club de Socios "Amigas de Lidia". Aplicación web completa con panel de administración y dashboard de usuario.

## 🚀 Características

- **Panel de Usuario**
  - Visualización de puntos acumulados
  - Ranking entre usuarios
  - Historial de transacciones
  - Información de beneficios del club

- **Panel de Administración**
  - Gestión de usuarios
  - Administración de puntos (añadir/restar)
  - Ranking de usuarios
  - Historial completo de transacciones
  - Exportación de datos a CSV

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion (animaciones)
- Axios
- React Router

### Backend
- Node.js
- Express
- Sequelize ORM
- SQLite

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn

## 🔧 Instalación Local

### Backend

```bash
cd server
npm install
node index.js
```

El servidor se ejecutará en `http://localhost:3001`

### Frontend

```bash
cd client
npm install
npm run dev
```

El cliente se ejecutará en `http://localhost:5173`

## 🌐 Variables de Entorno

### Backend (.env)

```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://your-domain.com
DATABASE_PATH=/data/amigas.sqlite
```

### Frontend (.env)

```env
VITE_API_URL=http://your-domain.com:3001
```

## 🐳 Despliegue con Docker

### Construcción de imágenes

```bash
# Backend
cd server
docker build -t amigas-backend .

# Frontend
cd client
docker build -t amigas-frontend .
```

### Ejecución

```bash
# Backend
docker run -d -p 3001:3001 \
  -v amigas-data:/data \
  -e CORS_ORIGIN=http://your-domain.com \
  amigas-backend

# Frontend
docker run -d -p 80:80 \
  -e VITE_API_URL=http://your-domain.com:3001 \
  amigas-frontend
```

## 📦 Despliegue en EasyPanel

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de despliegue en EasyPanel.

## 🔐 Credenciales por Defecto

### Administrador
- Email: `lidia-1997@outlook.es`
- Password: `lidiaadmin!!!`

### Usuario Demo
- Email: `adolfo.p@terra.com`
- Password: `demo123`

> **Nota**: Cambiar las credenciales de administrador en producción.

## 📁 Estructura del Proyecto

```
amigas_app/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── config/        # Configuración
│   │   └── ...
│   ├── Dockerfile
│   └── nginx.conf
├── server/                # Backend Node.js
│   ├── index.js          # Servidor principal
│   ├── Dockerfile
│   └── ...
└── database/             # Base de datos SQLite
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Contacto

Para consultas: lidia-1997@outlook.es
