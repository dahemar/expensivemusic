# Implementación de jonasjusten.com

## Resumen

Se ha implementado `jonasjusten.com` como un **calco exacto** de la página `commercial-work` de `expensivemusic.com`, adaptado para ser un sitio independiente dedicado al trabajo comercial de Jonas.

## Estructura del Proyecto

```
jonas/
├── v2/                    # expensivemusic.com (Personal Work)
│   ├── src/
│   ├── dist/
│   └── package.json
├── jonasjusten/          # jonasjusten.com (Commercial Work)
│   ├── src/
│   │   ├── App.jsx       # Componente principal
│   │   ├── App.css       # Estilos CSS
│   │   └── main.jsx      # Punto de entrada
│   ├── public/
│   │   └── commercial/   # Imágenes comerciales
│   ├── dist/
│   └── package.json
└── ...
```

## Cambios Realizados

### 1. **Componente App.jsx**

#### **Estructura Exacta:**
```javascript
// Exact copy of the Commercial component from expensivemusic.com
function Commercial({ commercialPosts, onImageClick }) {
  return (
    <div className="container">
      <main className="content content-commercial">
        <section className="works-section">
          {/* <h2>commercial work</h2> */}
          <div id="commercial-posts" className="blog-container">
            {commercialPosts.map((post, idx) => {
              // Misma lógica de renderizado que expensivemusic.com
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
```

#### **Navegación Adaptada:**
```javascript
function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li><NavLink to="/">commercial</NavLink></li>
        <li><NavLink to="/about">about</NavLink></li>
        <li><NavLink to="/contact">contact</NavLink></li>
        <li><a href="https://expensivemusic.com">personal work</a></li>
      </ul>
    </nav>
  );
}
```

### 2. **Estilos CSS (App.css)**

#### **Layout Exacto:**
```css
.container {
    display: flex;
    min-height: 100vh;
}

.content {
    flex: 1;
    margin-right: 250px;  /* Sidebar a la derecha */
    margin-left: 3rem;
    padding: 1.5rem;
}

.sidebar {
    width: 250px;
    position: fixed;
    right: 0;              /* Sidebar a la derecha */
    height: 100vh;
}
```

#### **Responsive Design:**
```css
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        position: fixed;
        top: 0;
        /* Mismo comportamiento móvil que expensivemusic.com */
    }
}
```

### 3. **Integración Google Sheets**

#### **Misma Configuración:**
```javascript
const COMMERCIAL_SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const COMMERCIAL_API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const COMMERCIAL_RANGE = 'Commercial!A2:C';
```

#### **Misma Lógica de Fetch:**
```javascript
useEffect(() => {
  async function fetchCommercial() {
    // Exact same logic as expensivemusic.com
    const url = `${COMMERCIAL_BASE_URL}${COMMERCIAL_SPREADSHEET_ID}/values/${COMMERCIAL_RANGE}?key=${COMMERCIAL_API_KEY}`;
    // Mismo procesamiento de datos
  }
  fetchCommercial();
}, []);
```

### 4. **Assets Compartidos**

#### **Imágenes Comerciales:**
```bash
cp -r commercial jonasjusten/public/
```

- ✅ **Mismas imágenes**: Copiadas desde el proyecto principal
- ✅ **Misma estructura**: Directorio `public/commercial/`
- ✅ **Mismos nombres**: `1.webp`, `2.webp`, etc.

## Diferencias Clave

### **1. Dominio y Títulos:**
- **expensivemusic.com**: `expensivemusic.com - commercial work`
- **jonasjusten.com**: `jonasjusten.com`

### **2. Navegación:**
- **expensivemusic.com**: blog, works, music, radio, contact, commercial work
- **jonasjusten.com**: commercial, about, contact, personal work

### **3. Enlaces Cruzados:**
- **Desde expensivemusic.com**: "commercial work" → jonasjusten.com
- **Desde jonasjusten.com**: "personal work" → expensivemusic.com

## Funcionalidades Implementadas

### **1. Galería de Imágenes:**
- ✅ **Carga dinámica**: Desde Google Sheets
- ✅ **Modal de zoom**: Click para ver en pantalla completa
- ✅ **Responsive**: Optimizado para móvil y desktop
- ✅ **Mismo layout**: Grid de imágenes idéntico

### **2. Navegación:**
- ✅ **Sidebar fijo**: Posicionado a la derecha
- ✅ **Enlaces activos**: Resaltado de página actual
- ✅ **Navegación cruzada**: Enlaces entre dominios
- ✅ **Responsive**: Adaptado para móvil

### **3. Páginas Adicionales:**
- ✅ **About**: Información sobre Jonas
- ✅ **Contact**: Información de contacto comercial
- ✅ **Personal Work**: Enlace a expensivemusic.com

### **4. Integración de Contenido:**
- ✅ **Google Sheets API**: Misma hoja de cálculo
- ✅ **Datos dinámicos**: Actualización automática
- ✅ **Manejo de errores**: Fallback para datos faltantes
- ✅ **Procesamiento de URLs**: Soporte para imágenes locales y externas

## Estructura de Datos

### **Google Sheets - Hoja "Commercial":**
```
A2: Image URL
B2: Alt Text  
C2: Description
```

### **Mapeo de Datos:**
```javascript
const posts = (data.values || []).map(row => ({
  imageUrl: row[0] || '',
  altText: row[1] || '',
  description: row[2] || '',
})).filter(post => extractImageUrl(post.imageUrl));
```

## Deployment

### **Build Script:**
```bash
./build-both.sh
```

### **Carpetas de Build:**
- **expensivemusic.com**: `v2/dist/`
- **jonasjusten.com**: `jonasjusten/dist/`

### **GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
# Deployment automático de ambos sitios
```

## Beneficios de la Implementación

### **1. Consistencia Visual:**
- ✅ **Mismo diseño**: Layout idéntico
- ✅ **Mismos estilos**: CSS copiado exactamente
- ✅ **Misma experiencia**: UX consistente

### **2. Mantenimiento Simplificado:**
- ✅ **Código compartido**: Lógica reutilizada
- ✅ **Contenido centralizado**: Misma hoja de Google Sheets
- ✅ **Actualizaciones sincronizadas**: Cambios se reflejan en ambos sitios

### **3. SEO Optimizado:**
- ✅ **Dominios separados**: Estrategias SEO independientes
- ✅ **Contenido específico**: Enfoque comercial vs personal
- ✅ **Enlaces cruzados**: Mejora el SEO de ambos sitios

### **4. Escalabilidad:**
- ✅ **Arquitectura modular**: Fácil agregar más páginas
- ✅ **Deployment independiente**: Cada sitio se puede actualizar por separado
- ✅ **Contenido dinámico**: Fácil gestión a través de Google Sheets

## Próximos Pasos

### **1. Deployment:**
1. Configurar dominios DNS para jonasjusten.com
2. Deploy en Netlify/Vercel siguiendo `DEPLOYMENT_INSTRUCTIONS.md`
3. Configurar variables de entorno
4. Probar navegación cruzada

### **2. Optimizaciones:**
1. Implementar caché para Google Sheets API
2. Optimizar imágenes para web
3. Agregar analytics específicos para cada dominio
4. Implementar lazy loading para imágenes

### **3. Contenido:**
1. Actualizar Google Sheets con más contenido comercial
2. Agregar metadatos SEO específicos
3. Implementar breadcrumbs para navegación
4. Agregar filtros por categorías comerciales

## Conclusión

La implementación de `jonasjusten.com` como calco exacto de la página `commercial-work` de `expensivemusic.com` ha sido exitosa. El resultado es un sitio web profesional dedicado al trabajo comercial que mantiene la consistencia visual y funcional con el sitio personal, mientras proporciona una experiencia independiente y optimizada para el trabajo comercial.

La arquitectura permite:
- **Separación clara** entre trabajo personal y comercial
- **Mantenimiento simplificado** con código compartido
- **Escalabilidad** para futuras expansiones
- **SEO optimizado** con dominios específicos 