#!/bin/bash

# Script final para optimizar imágenes del proyecto jonasjusten
# Usa magick para mejor compresión y redimensionamiento

echo "🔧 Optimizando imágenes con compresión avanzada..."

# Crear directorio para originales si no existe
mkdir -p dist/commercial/original

# Función para optimizar imagen con magick
optimize_with_magick() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "📸 Optimizando: $filename"
    
    # Guardar copia original
    cp "$file" "dist/commercial/original/${filename}"
    
    # Obtener tamaño original
    original_size=$(stat -f%z "$file")
    
    # Optimizar con magick según el tipo
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
        # JPEG: comprimir con calidad 70% y redimensionar si es muy grande
        magick "$file" -resize "1920x1080>" -quality 70 -strip "dist/commercial/${filename}"
    elif [[ "$ext" == "webp" ]]; then
        # WebP: comprimir con calidad 80% y redimensionar si es muy grande
        magick "$file" -resize "1920x1080>" -quality 80 -strip "dist/commercial/${filename}"
    elif [[ "$ext" == "png" ]]; then
        # PNG: comprimir manteniendo transparencia y redimensionar si es muy grande
        magick "$file" -resize "1920x1080>" -strip "dist/commercial/${filename}"
    fi
    
    # Mostrar diferencia de tamaño
    optimized_size=$(stat -f%z "dist/commercial/${filename}")
    savings=$((original_size - optimized_size))
    savings_percent=$((savings * 100 / original_size))
    
    echo "   ✅ Optimizado: ${original_size} → ${optimized_size} bytes (${savings_percent}% reducción)"
}

# Procesar todas las imágenes en el directorio commercial
for file in dist/commercial/*.{jpg,jpeg,png,webp}; do
    if [[ -f "$file" ]]; then
        optimize_with_magick "$file"
    fi
done

echo "🎉 ¡Optimización final completada!"
echo "📁 Originales guardados en: dist/commercial/original/"
echo "📊 Imágenes optimizadas en: dist/commercial/"

# Mostrar resumen de tamaños
echo ""
echo "📊 Resumen de optimización:"
echo "Originales:"
du -sh dist/commercial/original/
echo "Optimizadas:"
du -sh dist/commercial/*.{jpg,jpeg,png,webp} 2>/dev/null | tail -1 