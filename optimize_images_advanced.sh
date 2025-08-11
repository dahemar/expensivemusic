#!/bin/bash

# Script avanzado para optimizar imágenes del proyecto jonasjusten
# Usa imagemin para mejor compresión

echo "🔧 Optimizando imágenes con compresión avanzada..."

# Crear directorio para originales si no existe
mkdir -p dist/commercial/original

# Función para optimizar imagen con imagemin
optimize_with_imagemin() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "📸 Optimizando: $filename"
    
    # Guardar copia original
    cp "$file" "dist/commercial/original/${filename}"
    
    # Obtener tamaño original
    original_size=$(stat -f%z "$file")
    
    # Optimizar con imagemin según el tipo
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
        # JPEG: comprimir con mozjpeg
        imagemin "$file" --out-dir=dist/commercial --plugin.mozjpeg.quality=80
    elif [[ "$ext" == "webp" ]]; then
        # WebP: comprimir con webp
        imagemin "$file" --out-dir=dist/commercial --plugin.webp.quality=80
    elif [[ "$ext" == "png" ]]; then
        # PNG: comprimir con pngquant
        imagemin "$file" --out-dir=dist/commercial --plugin.pngquant.quality=80
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
        optimize_with_imagemin "$file"
    fi
done

echo "🎉 ¡Optimización avanzada completada!"
echo "📁 Originales guardados en: dist/commercial/original/"
echo "📊 Imágenes optimizadas en: dist/commercial/" 