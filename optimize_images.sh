#!/bin/bash

# Script para optimizar imágenes del proyecto jonasjusten
# Guarda copias originales y comprime para web

echo "🔧 Optimizando imágenes..."

# Crear directorio para originales si no existe
mkdir -p dist/commercial/original

# Función para optimizar imagen
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "📸 Optimizando: $filename"
    
    # Guardar copia original
    cp "$file" "dist/commercial/original/${filename}"
    
    # Optimizar según el tipo de archivo
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
        # JPEG: comprimir con calidad 85%
        convert "$file" -quality 85 -strip "dist/commercial/${filename}"
    elif [[ "$ext" == "webp" ]]; then
        # WebP: comprimir con calidad 85%
        convert "$file" -quality 85 -strip "dist/commercial/${filename}"
    elif [[ "$ext" == "png" ]]; then
        # PNG: comprimir manteniendo transparencia
        convert "$file" -strip "dist/commercial/${filename}"
    fi
    
    # Mostrar diferencia de tamaño
    original_size=$(stat -f%z "dist/commercial/original/${filename}")
    optimized_size=$(stat -f%z "dist/commercial/${filename}")
    savings=$((original_size - optimized_size))
    savings_percent=$((savings * 100 / original_size))
    
    echo "   ✅ Optimizado: ${original_size} → ${optimized_size} bytes (${savings_percent}% reducción)"
}

# Procesar todas las imágenes en el directorio commercial
for file in dist/commercial/*.{jpg,jpeg,png,webp}; do
    if [[ -f "$file" ]]; then
        optimize_image "$file"
    fi
done

echo "🎉 ¡Optimización completada!"
echo "📁 Originales guardados en: dist/commercial/original/"
echo "📊 Imágenes optimizadas en: dist/commercial/" 