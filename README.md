# 🚛 Sistema Logístico React - Aplicación Completa

Sistema completo de gestión logística desarrollado con React, Node.js, Express y PostgreSQL (Neon). Aplicación full-stack para la gestión de clientes, camiones, rutas y repartos con mapas interactivos.

## 🌟 Características Principales

### Frontend (React + Vite)
- ⚡ **React 18** con Vite para desarrollo rápido
- 🎨 **Tailwind CSS** para diseño responsive
- 🗺️ **Mapas interactivos** con Leaflet
- 📋 **Formularios avanzados** con React Hook Form + validaciones
- 📊 **Tablas interactivas** con sorting, filtros y paginación
- 🔄 **Gestión de estado** con Zustand
- 🎯 **Routing** con React Router DOM
- 📱 **Diseño responsive** mobile-first
- 🔍 **Búsqueda y filtros** en tiempo real
- 🎨 **Iconos** con Lucide React

### Backend (Node.js + Express)
- 🚀 **API RESTful** completa
- 🔐 **Autenticación** con JWT
- 🛡️ **Validaciones** con express-validator
- 🗄️ **PostgreSQL** con Neon (serverless)
- 📝 **Logging** con Winston
- 🌐 **CORS** configurado
- 🔧 **Variables de entorno** con dotenv

### Funcionalidades del Sistema
- 👥 **Gestión de Clientes** (CRUD completo)
- 🚛 **Gestión de Camiones** (estados, conductores, capacidades)
- 🛣️ **Gestión de Rutas** (costos, tiempos, asignaciones)
- 📦 **Gestión de Repartos** (estados, seguimiento, entregas)
- 🗺️ **Visualización en Mapas** (clientes, rutas, repartos)
- 📊 **Dashboard** con estadísticas y métricas
- 🔍 **Búsquedas avanzadas** y filtros múltiples
- 📱 **Interfaz responsive** para móviles y desktop

## 🗄️ Base de Datos

### Configuración Neon PostgreSQL
La aplicación está configurada para usar **Neon PostgreSQL** (serverless):

```
postgresql://neondb_owner:npg_PbOH1AcBrn7F@ep-plain-sunset-acfy4yn0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Datos Precargados
- ✅ **20 clientes** con datos reales
- ✅ **8 camiones** con diferentes especificaciones
- ✅ **8 rutas** con costos y tiempos
- ✅ **30 repartos** en diferentes estados

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd app-logistica-react
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tu configuración:
```env
DATABASE_URL=postgresql://neondb_owner:npg_PbOH1AcBrn7F@ep-plain-sunset-acfy4yn0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=5000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_muy_seguro
CORS_ORIGIN=http://localhost:5173
```

### 3. Instalar Backend
```bash
cd backend
npm install
npm run dev
```
El backend estará disponible en `http://localhost:5000`

### 4. Instalar Frontend
```bash
cd ..
npm install
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
app-logistica-react/
├── 📁 backend/                    # Backend Node.js + Express
│   ├── 📁 controllers/           # Controladores de las rutas
│   ├── 📁 middleware/            # Middlewares (auth, validation, etc.)
│   ├── 📁 models/                # Modelos de base de datos
│   ├── 📁 routes/                # Rutas de la API
│   ├── 📁 config/                # Configuraciones
│   └── server.js                 # Servidor principal
├── 📁 src/                       # Frontend React
│   ├── 📁 components/           # Componentes React
│   │   ├── 📁 Layout/           # Layout y navegación
│   │   ├── 📁 Dashboard/        # Dashboard y estadísticas
│   │   ├── 📁 Clientes/         # Gestión de clientes
│   │   ├── 📁 Camiones/         # Gestión de camiones
│   │   ├── 📁 Rutas/            # Gestión de rutas
│   │   ├── 📁 Repartos/         # Gestión de repartos
│   │   └── 📁 Maps/             # Componentes de mapas
│   ├── 📁 pages/                # Páginas principales
│   ├── 📁 stores/               # Gestión de estado (Zustand)
│   ├── 📁 services/             # Servicios API
│   └── 📁 styles/               # Estilos CSS
├── 📄 package.json              # Dependencias frontend
├── 📄 vite.config.js            # Configuración Vite
├── 📄 tailwind.config.js        # Configuración Tailwind
└── 📄 README.md                 # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Routing
- **Tailwind CSS** - Framework CSS
- **Zustand** - Gestión de estado
- **React Hook Form** - Manejo de formularios
- **Leaflet** - Mapas interactivos
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **React Table** - Tablas avanzadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos (Neon)
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validaciones
- **Winston** - Logging
- **CORS** - Configuración CORS
- **dotenv** - Variables de entorno

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # ESLint
```

### Backend
```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run test         # Tests (si están configurados)
```

## 📊 Funcionalidades Detalladas

### 1. Dashboard
- 📈 Estadísticas generales del sistema
- 📊 Gráficos de rendimiento
- 📋 Resumen de actividades recientes
- 🎯 KPIs principales

### 2. Gestión de Clientes
- ➕ Crear, editar y eliminar clientes
- 🔍 Búsqueda por nombre, email, teléfono
- 📍 Geocodificación de direcciones
- 📋 Vista en tarjetas o lista
- 🗺️ Visualización en mapa

### 3. Gestión de Camiones
- 🚛 Información completa de vehículos
- ⚙️ Estados: Activo, Mantenimiento, Inactivo
- 👨‍💼 Asignación de conductores
- ⚖️ Control de capacidad de carga
- ⛽ Tipos de combustible

### 4. Gestión de Rutas
- 🛣️ Creación y edición de rutas
- 💰 Cálculo de costos (peajes, combustible)
- ⏱️ Estimación de tiempos
- 🚛 Asignación de camiones
- 📊 Análisis de rentabilidad

### 5. Gestión de Repartos
- 📦 Control de entregas
- 📅 Programación de fechas y horarios
- 📊 Estados: Pendiente, En tránsito, Entregado, Cancelado
- 📋 Detalle de productos
- 🗺️ Tracking en mapa

### 6. Mapas Interactivos
- 🗺️ Visualización de clientes
- 📍 Marcadores por estado de reparto
- 🛣️ Rutas dibujadas
- 🎯 Zoom automático a puntos de interés
- 📱 Responsive en móviles

## 🔐 Autenticación y Seguridad

- 🔑 Autenticación JWT
- 🛡️ Middlewares de seguridad
- 🔒 Validación de datos
- 🚫 Protección CORS
- 📝 Logs de seguridad

## 📱 Responsive Design

- 📱 Mobile First approach
- 💻 Adaptación a tablets y desktop
- 🎨 Componentes flexibles
- 🔄 Interacciones táctiles optimizadas

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
npm run build
# Desplegar la carpeta 'dist' en tu servicio preferido
```

### Backend (Railway/Render/Heroku)
```bash
# Configurar variables de entorno en tu plataforma
# Desplegar desde la carpeta 'backend'
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. 📚 Revisa la documentación
2. 🐛 Reporta bugs en GitHub Issues
3. 💡 Sugiere nuevas features
4. 📧 Contacta al equipo de desarrollo

## 🎯 Roadmap Futuro

- [ ] 📊 Reportes avanzados con PDF
- [ ] 📱 App móvil React Native
- [ ] 🔔 Notificaciones en tiempo real
- [ ] 🤖 IA para optimización de rutas
- [ ] 📈 Analytics avanzados
- [ ] 🔗 Integración con APIs externas
- [ ] 🌐 Multi-idioma (i18n)
- [ ] 🎨 Temas personalizables

---

⭐ **¡Dale una estrella al proyecto si te fue útil!** ⭐

Desarrollado con ❤️ para la gestión logística moderna.