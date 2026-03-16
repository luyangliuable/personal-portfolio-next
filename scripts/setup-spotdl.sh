#!/bin/bash

# Music Streaming Setup Script
# Creates Python virtual environment and installs spotdl

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="$PROJECT_ROOT/python-env"
CACHE_DIR="$PROJECT_ROOT/.music-cache"

echo "🎵 Setting up spotdl for music streaming..."
echo "Project root: $PROJECT_ROOT"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Found Python $PYTHON_VERSION"

# Create virtual environment
if [ -d "$VENV_DIR" ]; then
    echo "⚠️  Virtual environment already exists at $VENV_DIR"
    read -p "Do you want to recreate it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$VENV_DIR"
    else
        echo "Using existing virtual environment"
    fi
fi

if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install -i https://artifactory.internal.cba/api/pypi/org.python.pypi/simple --upgrade pip > /dev/null 2>&1

# Install spotdl using internal PyPI
echo "📥 Installing spotdl from internal PyPI..."
pip install -i https://artifactory.internal.cba/api/pypi/org.python.pypi/simple setuptools spotdl

# Create pkg_resources compatibility shim for Python 3.14+
echo "🔧 Creating pkg_resources compatibility shim..."
cat > "$VENV_DIR/lib/python3.14/site-packages/pkg_resources.py" << 'SHIMEOF'
"""
Compatibility shim for pkg_resources (deprecated in Python 3.14)
This provides basic functionality needed by spotdl
"""
import sys
from importlib.metadata import version as get_version, PackageNotFoundError

class Distribution:
    def __init__(self, name):
        self.project_name = name
        try:
            self.version = get_version(name)
        except PackageNotFoundError:
            self.version = "unknown"

def require(dist_name):
    """Get package distribution"""
    if isinstance(dist_name, str):
        return [Distribution(dist_name)]
    return [Distribution(dist_name[0])]

def get_distribution(dist_name):
    """Get package version"""
    return Distribution(dist_name)

__version__ = "compatibility_shim"
SHIMEOF

# Verify installation
echo "✅ Verifying spotdl installation..."
spotdl --version

# Create cache directories
echo "📁 Creating cache directories..."
mkdir -p "$CACHE_DIR/songs"
mkdir -p "$CACHE_DIR/metadata"
mkdir -p "$CACHE_DIR/covers"
echo "✅ Cache directories created"

# Create .gitignore entries if needed
GITIGNORE_FILE="$PROJECT_ROOT/.gitignore"
if ! grep -q "python-env" "$GITIGNORE_FILE" 2>/dev/null; then
    echo "" >> "$GITIGNORE_FILE"
    echo "# Python virtual environment for spotdl" >> "$GITIGNORE_FILE"
    echo "python-env/" >> "$GITIGNORE_FILE"
    echo "✅ Added python-env/ to .gitignore"
fi

if ! grep -q ".music-cache" "$GITIGNORE_FILE" 2>/dev/null; then
    echo "" >> "$GITIGNORE_FILE"
    echo "# Music cache directory" >> "$GITIGNORE_FILE"
    echo ".music-cache/" >> "$GITIGNORE_FILE"
    echo "✅ Added .music-cache/ to .gitignore"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To use spotdl manually:"
echo "  source $VENV_DIR/bin/activate"
echo "  spotdl search 'song name'"
echo ""
echo "The Next.js API will automatically use the virtual environment."
