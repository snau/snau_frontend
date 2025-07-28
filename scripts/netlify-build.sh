#!/bin/bash

echo "🚀 Starting Netlify build process..."

# Run the generate command
echo "📦 Running pnpm generate..."
pnpm generate

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed with exit code $?"
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
    fi
else
    echo "❌ Output directory .output/public does not exist"
    echo "📁 Contents of .output/:"
    ls -la .output/ || echo "No .output directory found"
    exit 1
fi

echo "🎉 Build verification complete!"