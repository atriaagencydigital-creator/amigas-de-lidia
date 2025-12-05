# Guía de Despliegue en EasyPanel (Hostinger VPS)

Esta guía te ayudará a desplegar la aplicación "Amigas de Lidia" en tu VPS de Hostinger usando EasyPanel.

## 📋 Requisitos Previos

- ✅ VPS de Hostinger con EasyPanel instalado
- ✅ Acceso a EasyPanel (http://194.164.77.136:3000)
- ✅ Repositorio Git (GitHub/GitLab) con el código
- ✅ Dominio configurado (opcional pero recomendado)

## 🚀 Pasos de Despliegue

### 1. Preparar el Repositorio Git

Si aún no has subido el código a GitHub:

```bash
cd c:\Users\ecotu\.gemini\antigravity\scratch\amigas_app

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit - Amigas de Lidia Club App"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/amigas-de-lidia.git

# Subir código
git push -u origin main
```

### 2. Configurar Backend en EasyPanel

1. **Accede a EasyPanel**: http://194.164.77.136:3000
2. **Ve al proyecto**: `digitalappworld`
3. **Selecciona la app**: `club`
4. **Configurar Source**:
   - Repository: Tu repositorio de GitHub
   - Branch: `main`
   - Build Path: `server`

5. **Configurar Build**:
   - Dockerfile Path: `server/Dockerfile`
   - Build Context: `server`

6. **Configurar Variables de Entorno**:
   ```
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=http://tu-dominio.com
   DATABASE_PATH=/data/amigas.sqlite
   ```

7. **Configurar Volumen** (IMPORTANTE para persistencia de datos):
   - Mount Path: `/data`
   - Volume Name: `amigas-database`

8. **Configurar Puerto**:
   - Container Port: `3001`
   - Expose Port: `3001`

9. **Deploy**: Haz clic en "Deploy"

### 3. Configurar Frontend en EasyPanel

**Opción A: Servicio Separado (Recomendado)**

1. **Crear nueva app** en el proyecto `digitalappworld`
2. **Nombre**: `club-frontend`
3. **Configurar Source**: Mismo repositorio
4. **Build Path**: `client`
5. **Dockerfile Path**: `client/Dockerfile`
6. **Variables de Entorno**:
   ```
   VITE_API_URL=http://tu-dominio.com:3001
   ```
   O si usas subdominios:
   ```
   VITE_API_URL=https://api.tu-dominio.com
   ```

7. **Puerto**:
   - Container Port: `80`
   - Expose Port: `80`

8. **Deploy**: Haz clic en "Deploy"

**Opción B: Servir Frontend desde Backend**

Si prefieres un solo servicio, puedes modificar el backend para servir el frontend estático. (Requiere cambios adicionales en el código)

### 4. Configurar Dominio

#### Opción A: Usar Dominio Principal

1. En EasyPanel, ve a la configuración de la app `club-frontend`
2. En "Domains", agrega: `tu-dominio.com`
3. Para el backend, agrega: `api.tu-dominio.com`

#### Opción B: Usar Subdominios

1. Frontend: `club.tu-dominio.com`
2. Backend: `api-club.tu-dominio.com`

#### Configurar DNS en Hostinger

1. Ve al panel de Hostinger
2. Gestión de DNS
3. Agrega registros A:
   ```
   A    @              194.164.77.136
   A    api            194.164.77.136
   A    club           194.164.77.136
   ```

### 5. Configurar SSL (HTTPS)

EasyPanel debería configurar SSL automáticamente con Let's Encrypt. Si no:

1. En la configuración de cada app
2. Sección "SSL"
3. Habilitar "Auto SSL"

### 6. Verificar Despliegue

1. **Backend Health Check**:
   ```bash
   curl http://tu-dominio.com:3001
   # o
   curl https://api.tu-dominio.com
   ```

2. **Frontend**:
   - Abre `http://tu-dominio.com` en el navegador
   - Verifica que carga la página de login

3. **Test Login**:
   - Admin: `lidia-1997@outlook.es` / `lidiaadmin!!!`
   - Usuario: `adolfo.p@terra.com` / `demo123`

## 🔧 Configuración Avanzada

### Actualizar Variables de Entorno

Si necesitas cambiar las URLs después del despliegue:

1. En EasyPanel, ve a la app
2. Sección "Environment"
3. Modifica las variables
4. Redeploy la aplicación

### Backup de Base de Datos

La base de datos está en el volumen `/data`. Para hacer backup:

```bash
# Conectar al contenedor
docker exec -it <container-id> sh

# Copiar base de datos
cp /data/amigas.sqlite /tmp/backup.sqlite

# Desde el host, copiar el backup
docker cp <container-id>:/tmp/backup.sqlite ./backup-$(date +%Y%m%d).sqlite
```

### Logs y Debugging

Ver logs en tiempo real:

1. En EasyPanel, ve a la app
2. Sección "Logs"
3. O usa Docker:
   ```bash
   docker logs -f <container-name>
   ```

## 🐛 Solución de Problemas

### Error: CORS

Si ves errores de CORS en la consola del navegador:

1. Verifica que `CORS_ORIGIN` en el backend coincida con la URL del frontend
2. Incluye el protocolo (http:// o https://)
3. No incluyas barra final

### Error: Cannot connect to backend

1. Verifica que `VITE_API_URL` en el frontend sea correcto
2. Asegúrate de que el backend esté corriendo
3. Verifica que los puertos estén expuestos correctamente

### Base de datos vacía después de redeploy

1. Verifica que el volumen esté configurado correctamente
2. El mount path debe ser `/data`
3. No uses volúmenes temporales

### Build fails

1. Revisa los logs de build en EasyPanel
2. Verifica que las rutas de Dockerfile sean correctas
3. Asegúrate de que `package.json` esté en el directorio correcto

## 📊 Monitoreo

### Métricas a Vigilar

- CPU y memoria del contenedor
- Tamaño de la base de datos
- Número de usuarios activos
- Errores en logs

### Alertas Recomendadas

- Uso de disco > 80%
- Contenedor reiniciado
- Errores 5xx en logs

## 🔄 Actualización de la Aplicación

Para actualizar el código:

1. Haz push de los cambios a GitHub:
   ```bash
   git add .
   git commit -m "Update: descripción de cambios"
   git push
   ```

2. En EasyPanel:
   - Ve a la app
   - Haz clic en "Redeploy"
   - O configura auto-deploy en GitHub webhooks

## 📞 Soporte

Para problemas específicos de EasyPanel:
- Documentación: https://easypanel.io/docs
- Discord: https://discord.gg/easypanel

Para problemas de la aplicación:
- Email: lidia-1997@outlook.es

---

## ✅ Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Backend desplegado en EasyPanel
- [ ] Frontend desplegado en EasyPanel
- [ ] Variables de entorno configuradas
- [ ] Volumen de base de datos configurado
- [ ] Dominio configurado
- [ ] DNS apuntando al VPS
- [ ] SSL habilitado
- [ ] Login de admin funciona
- [ ] Login de usuario funciona
- [ ] Todas las funcionalidades probadas
- [ ] Backup de base de datos configurado

¡Listo para producción! 🎉
