#!/bin/bash

echo "🚀 Starting Netlify build process..."

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .output .nuxt

# Run the generate command
echo "📦 Running pnpm generate..."
pnpm generate

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "✅ Generate completed successfully"
else
    echo "❌ Generate failed with exit code $?"
    echo "📁 Let's check what exists:"
    ls -la .output/ || echo "No .output directory found"
    exit 1
fi

# Copy client assets to public directory if they don't exist
echo "📁 Checking for client assets..."
if [ ! -d ".output/public/_nuxt" ] && [ -d ".nuxt/dist/client/_nuxt" ]; then
    echo "📁 Copying client assets..."
    mkdir -p .output/public/_nuxt
    cp -r .nuxt/dist/client/_nuxt/* .output/public/_nuxt/
    echo "✅ Client assets copied successfully"
    echo "📁 Assets copied:"
    ls -la .output/public/_nuxt/ | head -10
elif [ -d ".output/public/_nuxt" ]; then
    echo "✅ Client assets already exist"
else
    echo "❌ Client assets directory not found"
    exit 1
fi

# Verify the output directory exists
if [ -d ".output/public" ]; then
    echo "✅ Output directory exists"
    echo "📁 Contents of .output/public:"
    ls -la .output/public/
    
    # Check if essential files exist
    if [ -f ".output/public/200.html" ] && [ -f ".output/public/404.html" ]; then
        echo "✅ Essential files found"
    else
        echo "⚠️  Warning: Some essential files may be missing"
        echo "📁 Available HTML files:"
        find .output/public -name "*.html" | head -10
    fi
else
    echo "❌ Output directory .output/public does not exist"
    echo "📁 Contents of .output/:"
    ls -la .output/ || echo "No .output directory found"
    echo "📁 Root directory contents:"
    ls -la .
    exit 1
fi

echo "🎉 Build verification complete!"