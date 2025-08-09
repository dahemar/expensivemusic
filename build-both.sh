#!/bin/bash

# Script para construir ambos proyectos: expensivemusic.com y jonasjusten.com

echo "🚀 Iniciando build de ambos proyectos..."

# Build del proyecto expensivemusic.com (v2)
echo "📦 Construyendo expensivemusic.com..."
cd v2
npm install
npm run build
echo "✅ expensivemusic.com construido en v2/dist/"

# Build del proyecto jonasjusten.com
echo "📦 Construyendo jonasjusten.com..."
cd ../jonasjusten
npm install
npm run build
echo "✅ jonasjusten.com construido en jonasjusten/dist/"

echo "🎉 ¡Build completado para ambos proyectos!"
echo ""
echo "📁 Carpetas de build:"
echo "   - expensivemusic.com: v2/dist/"
echo "   - jonasjusten.com: jonasjusten/dist/" 