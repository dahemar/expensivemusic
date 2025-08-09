# Instrucciones de Deployment

## Resumen

Este documento describe cómo desplegar tanto `expensivemusic.com` como `jonasjusten.com` en plataformas de hosting modernas.

## Estructura de Proyectos

```
expensivemusic/
├── v2/                    # expensivemusic.com (Personal Work)
│   ├── src/
│   ├── dist/
│   └── package.json
├── jonasjusten/          # jonasjusten.com (Commercial Work)
│   ├── src/
│   ├── dist/
│   └── package.json
└── build-both.sh         # Script de build para ambos proyectos
```

## Opciones de Deployment

### 1. Netlify (Recomendado)

#### Para expensivemusic.com:

1. **Conectar repositorio:**
   - Ir a [netlify.com](https://netlify.com)
   - Conectar desde GitHub
   - Seleccionar repositorio `expensivemusic`

2. **Configurar build:**
   ```
   Build command: cd v2 && npm install && npm run build
   Publish directory: v2/dist
   ```

3. **Configurar dominio:**
   - Ir a Domain settings
   - Agregar dominio personalizado: `expensivemusic.com`
   - Configurar DNS según instrucciones de Netlify

#### Para jonasjusten.com:

1. **Conectar repositorio:**
   - Crear nuevo sitio en Netlify
   - Conectar desde GitHub
   - Seleccionar repositorio `expensivemusic` (mismo repositorio)

2. **Configurar build:**
   ```
   Build command: cd jonasjusten && npm install && npm run build
   Publish directory: jonasjusten/dist
   ```

3. **Configurar dominio:**
   - Ir a Domain settings
   - Agregar dominio personalizado: `jonasjusten.com`
   - Configurar DNS según instrucciones de Netlify

### 2. Vercel

#### Para expensivemusic.com:

1. **Conectar repositorio:**
   - Ir a [vercel.com](https://vercel.com)
   - Importar desde GitHub
   - Seleccionar repositorio `expensivemusic`

2. **Configurar build:**
   - Root Directory: `v2`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configurar dominio:**
   - Ir a Domains
   - Agregar dominio: `expensivemusic.com`

#### Para jonasjusten.com:

1. **Conectar repositorio:**
   - Crear nuevo proyecto en Vercel
   - Importar desde GitHub
   - Seleccionar repositorio `expensivemusic`

2. **Configurar build:**
   - Root Directory: `jonasjusten`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configurar dominio:**
   - Ir a Domains
   - Agregar dominio: `jonasjusten.com`

### 3. GitHub Pages

#### Configuración para ambos sitios:

1. **Crear GitHub Actions workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy-expensivemusic:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: cd v2 && npm install && npm run build
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./v2/dist

  deploy-jonasjusten:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: cd jonasjusten && npm install && npm run build
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./jonasjusten/dist
```

## Configuración de DNS

### Para expensivemusic.com:

1. **Registrar dominio:**
   - Comprar dominio en proveedor (GoDaddy, Namecheap, etc.)
   - Configurar nameservers según proveedor de hosting

2. **Configurar registros DNS:**
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   expensivemusic.com
   ```

### Para jonasjusten.com:

1. **Registrar dominio:**
   - Comprar dominio en proveedor
   - Configurar nameservers según proveedor de hosting

2. **Configurar registros DNS:**
   ```
   A     @     185.199.108.153
   A     @     185.199.109.153
   A     @     185.199.110.153
   A     @     185.199.111.153
   CNAME www   jonasjusten.com
   ```

## Variables de Entorno

### Para desarrollo local:

```bash
# .env.local
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ
VITE_COMMERCIAL_SPREADSHEET_ID=1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk
```

### Para producción:

Configurar en el panel de control del proveedor de hosting:

- `VITE_GOOGLE_SHEETS_API_KEY`
- `VITE_COMMERCIAL_SPREADSHEET_ID`

## Scripts de Build

### Build manual:

```bash
# Build ambos proyectos
./build-both.sh

# Build individual
cd v2 && npm run build
cd ../jonasjusten && npm run build
```

### Build automático:

Los scripts de build se ejecutan automáticamente en:
- Push a main branch (GitHub Actions)
- Deploy en Netlify/Vercel

## Verificación Post-Deployment

### Checklist:

- [ ] Sitios accesibles en sus dominios
- [ ] Imágenes cargando correctamente
- [ ] Navegación funcionando
- [ ] Enlaces cruzados funcionando
- [ ] Responsive design funcionando
- [ ] Google Sheets API funcionando
- [ ] SSL/HTTPS configurado
- [ ] Analytics configurado (opcional)

### Comandos de verificación:

```bash
# Verificar build local
npm run build
npm run preview

# Verificar estructura de archivos
ls -la dist/
ls -la jonasjusten/dist/
```

## Troubleshooting

### Problemas comunes:

1. **Build falla:**
   - Verificar dependencias: `npm install`
   - Verificar Node.js version: `node --version`
   - Verificar logs de build

2. **Imágenes no cargan:**
   - Verificar rutas en Google Sheets
   - Verificar permisos de Google Drive
   - Verificar API key

3. **Dominio no funciona:**
   - Verificar configuración DNS
   - Esperar propagación DNS (hasta 48h)
   - Verificar configuración en hosting

4. **Navegación no funciona:**
   - Verificar configuración de React Router
   - Verificar configuración de SPA en hosting
   - Verificar archivo _redirects (Netlify)

## Optimizaciones

### Performance:

1. **Optimizar imágenes:**
   - Comprimir imágenes antes de subir
   - Usar formatos modernos (WebP)
   - Implementar lazy loading

2. **Caching:**
   - Configurar headers de cache
   - Implementar service worker
   - Usar CDN para assets

3. **SEO:**
   - Agregar meta tags
   - Configurar sitemap
   - Implementar structured data

## Monitoreo

### Herramientas recomendadas:

1. **Analytics:**
   - Google Analytics 4
   - Plausible Analytics
   - Fathom Analytics

2. **Performance:**
   - Google PageSpeed Insights
   - WebPageTest
   - Lighthouse

3. **Uptime:**
   - UptimeRobot
   - Pingdom
   - StatusCake

## Soporte

Para problemas técnicos:

1. Revisar logs de build
2. Verificar configuración DNS
3. Contactar soporte del proveedor de hosting
4. Revisar documentación de React/Vite 