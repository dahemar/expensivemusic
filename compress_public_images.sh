#!/bin/bash

# Script para comprimir imágenes directamente en public/commercial
# Esto asegura que las imágenes comprimidas se incluyan en el build

echo "🔧 Comprimiendo imágenes en public/commercial..."

# Crear directorio si no existe
mkdir -p public/commercial

# Función para comprimir imagen
compress_image() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    echo "📸 Comprimiendo: $filename"
    
    # Obtener tamaño original
    original_size=$(stat -f%z "$file")
    
    # Comprimir según el tipo
    if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
        # JPEG: comprimir con calidad 50% y redimensionar a 1200px máximo
        magick "$file" -resize "1200x800>" -quality 50 -strip -interlace Plane "public/commercial/${filename}"
    elif [[ "$ext" == "webp" ]]; then
        # WebP: comprimir con calidad 60% y redimensionar a 1200px máximo
        magick "$file" -resize "1200x800>" -quality 60 -strip "public/commercial/${filename}"
    elif [[ "$ext" == "png" ]]; then
        # PNG: comprimir manteniendo transparencia y redimensionar a 1200px máximo
        magick "$file" -resize "1200x800>" -strip -define png:compression-level=9 "public/commercial/${filename}"
    fi
    
    # Mostrar diferencia de tamaño
    compressed_size=$(stat -f%z "public/commercial/${filename}")
    savings=$((original_size - compressed_size))
    savings_percent=$((savings * 100 / original_size))
    
    echo "   ✅ Comprimido: ${original_size} → ${compressed_size} bytes (${savings_percent}% reducción)"
}

# Procesar todas las imágenes en el directorio commercial original
for file in dist/commercial/*.{jpg,jpeg,png,webp}; do
    if [[ -f "$file" ]]; then
        compress_image "$file"
    fi
done

echo "🎉 ¡Compresión completada en public/commercial!"
echo "📊 Imágenes comprimidas listas para el build"

# Mostrar resumen
echo ""
echo "📊 Resumen de compresión:"
echo "Imágenes en public/commercial:"
ls -lah public/commercial/*.{jpg,jpeg,png,webp} 2>/dev/null | head -5 