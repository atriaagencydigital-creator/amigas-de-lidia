# Guía de Despliegue en Vercel (Frontend & Backend)

Esta guía te ayudará a desplegar "Amigas de Lidia" en Vercel, utilizando una base de datos PostgreSQL en la nube (Neon.tech).

## 📋 Requisitos Previos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [Neon.tech](https://neon.tech) (para la Base de Datos gratuita)
- ✅ Código subido a GitHub

## 🚀 Pasos de Despliegue

### 1. Configurar Base de Datos (Neon)

Vercel no soporta bases de datos locales (SQLite), así que usaremos Neon (PostgreSQL gratuito).

1. Ve a [console.neon.tech](https://console.neon.tech) y regístrate.
2. Crea un nuevo proyecto.
3. Copia el **Connection String** (asegúrate de que sea la versión `postgres://...` y no `psql...`).
   - Se verá algo como: `postgres://usuario:password@ep-xyz.aws.neon.tech/neondb?sslmode=require`

### 2. Preparar el Código (Ya realizado)

He configurado tu proyecto para que detecte automáticamente si está en Vercel:
- Si hay `POSTGRES_URL`, usa PostgreSQL.
- Si no, usa SQLite localmente.
- He creado `vercel.json` para gestionar el frontend y backend juntos.

### 3. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new).
2. Importa tu repositorio de GitHub `amigas-de-lidia`.
3. En **Project Name**, pon `amigas-club`.
4. **Framework Preset**: Déjalo en `Other` o `Vite` (Vercel lo detectará, si pregunta, el root directory es `./`).
   *Nota: Como tenemos `vercel.json`, Vercel debería respetar nuestra configuración personalizada.*

5. **Environment Variables** (IMPORTANTE):
   Despliega la sección y añade:
   - **Name**: `POSTGRES_URL`
   - **Value**: (Pega el connection string de Neon que copiaste en el paso 1)

6. Haz clic en **Deploy**.

## 🔄 Verificar Funcionamiento

1. Una vez desplegado, Vercel te dará una URL (ej: `amigas-club.vercel.app`).
2. Abre la URL.
3. Intenta hacer **Login**:
   - Al ser una base de datos nueva, **el Admin y el Usuario demo se crearán automáticamente** en el primer arranque.
   - Admin: `lidia-1997@outlook.es` / `lidiaadmin!!!`

## 🐛 Solución de Problemas

### Error 500 en Backend
Ve a los logs de Vercel (pestaña Logs) y filtra por "Functions". Busca errores de conexión a base de datos. Asegúrate de que `POSTGRES_URL` es correcta.

### Estilos rotos o 404
Si el frontend no carga, verifica que el Build Output Directory en Vercel (si te dejó configurarlo manual) coincida con `client/dist`. Pero `vercel.json` debería encargarse de esto.

## 📞 Soporte
- Email: lidia-1997@outlook.es

