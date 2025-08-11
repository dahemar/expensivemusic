#!/bin/bash

# Script para comprimir imágenes con calidad intermedia
# Mantiene mejor calidad visual que la compresión agresiva

echo "🔧 Comprimiendo imágenes con calidad intermedia..."

# Crear directorio si no existe
mkdir -p public/commercial

# Función para comprimir imagen con calidad intermedia
compress_intermediate() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "📸 Comprimiendo: $filename"
    
    # Obtener tamaño original
    original_size=$(stat -f%z "$file")
    
    # Comprimir con calidad intermedia según el tipo
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
        # JPEG: comprimir con calidad 80% y redimensionar a 1600px máximo
        magick "$file" -resize "1600x1200>" -quality 80 -strip -interlace Plane "public/commercial/${filename}"
    elif [[ "$ext" == "webp" ]]; then
        # WebP: comprimir con calidad 85% y redimensionar a 1600px máximo
        magick "$file" -resize "1600x1200>" -quality 85 -strip "public/commercial/${filename}"
    elif [[ "$ext" == "png" ]]; then
        # PNG: comprimir manteniendo transparencia y redimensionar a 1600px máximo
        magick "$file" -resize "1600x1200>" -strip -define png:compression-level=6 "public/commercial/${filename}"
    fi
    
    # Mostrar diferencia de tamaño
    compressed_size=$(stat -f%z "public/commercial/${filename}")
    savings=$((original_size - compressed_size))
    savings_percent=$((savings * 100 / original_size))
    
    echo "   ✅ Comprimido: ${original_size} → ${compressed_size} bytes (${savings_percent}% reducción)"
}

# Procesar todas las imágenes en el directorio original_full_quality
for file in public/commercial/original_full_quality/*.{jpg,jpeg,png,webp}; do
    if [[ -f "$file" ]]; then
        compress_intermediate "$file"
    fi
done

echo "🎉 ¡Compresión intermedia completada!"
echo "📊 Imágenes comprimidas listas para el build"

# Mostrar resumen
echo ""
echo "📊 Resumen de compresión intermedia:"
echo "Imágenes en public/commercial:"
ls -lah public/commercial/*.{jpg,jpeg,png,webp} 2>/dev/null | head -5

# Mostrar comparación de tamaños
echo ""
echo "🔍 Comparación de tamaños:"
echo "Originales:"
du -sh public/commercial/original_full_quality/
echo "Comprimidas:"
du -sh public/commercial/*.{jpg,jpeg,png,webp} 2>/dev/null | tail -1 