#!/bin/bash

# Script para comprimir imágenes de forma agresiva
# Guarda originales y aplica compresión extrema para web

echo "🔧 Comprimiendo imágenes de forma agresiva..."

# Crear directorio para originales si no existe
mkdir -p dist/commercial/original_high_quality

# Función para comprimir imagen de forma agresiva
compress_aggressive() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "📸 Comprimiendo agresivamente: $filename"
    
    # Guardar copia original de alta calidad
    cp "$file" "dist/commercial/original_high_quality/${filename}"
    
    # Obtener tamaño original
    original_size=$(stat -f%z "$file")
    
    # Comprimir de forma agresiva según el tipo
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
        # JPEG: comprimir con calidad 50% y redimensionar a 1200px máximo
        magick "$file" -resize "1200x800>" -quality 50 -strip -interlace Plane "dist/commercial/${filename}"
    elif [[ "$ext" == "webp" ]]; then
        # WebP: comprimir con calidad 60% y redimensionar a 1200px máximo
        magick "$file" -resize "1200x800>" -quality 60 -strip "dist/commercial/${filename}"
    elif [[ "$ext" == "png" ]]; then
        # PNG: comprimir manteniendo transparencia y redimensionar a 1200px máximo
        magick "$file" -resize "1200x800>" -strip -define png:compression-level=9 "dist/commercial/${filename}"
    fi
    
    # Mostrar diferencia de tamaño
    compressed_size=$(stat -f%z "dist/commercial/${filename}")
    savings=$((original_size - compressed_size))
    savings_percent=$((savings * 100 / original_size))
    
    echo "   ✅ Comprimido: ${original_size} → ${compressed_size} bytes (${savings_percent}% reducción)"
}

# Procesar todas las imágenes en el directorio commercial
for file in dist/commercial/*.{jpg,jpeg,png,webp}; do
    if [[ -f "$file" ]]; then
        compress_aggressive "$file"
    fi
done

echo "🎉 ¡Compresión agresiva completada!"
echo "📁 Originales de alta calidad guardados en: dist/commercial/original_high_quality/"
echo "📊 Imágenes comprimidas en: dist/commercial/"

# Mostrar resumen de tamaños
echo ""
echo "📊 Resumen de compresión agresiva:"
echo "Originales de alta calidad:"
du -sh dist/commercial/original_high_quality/
echo "Comprimidas:"
du -sh dist/commercial/*.{jpg,jpeg,png,webp} 2>/dev/null | tail -1

# Mostrar las 5 imágenes más grandes después de la compresión
echo ""
echo "🔍 Top 5 imágenes más grandes después de la compresión:"
ls -lah dist/commercial/*.{jpg,jpeg,png,webp} 2>/dev/null | sort -k5 -hr | head -5 