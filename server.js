const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const PORT = process.env.PORT || 8080;

// Configuración de Multer para uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite
    }
}).single('file');

// Cache para archivos estáticos
const staticCache = {};
const cacheDuration = 3600000; // 1 hora en ms

// Tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Archivos estáticos permitidos
const allowedStaticFiles = [
    '.html', '.css', '.js', '.json', 
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'
];

const server = http.createServer(async (req, res) => {
    try {
        // Manejar POST para uploads
        if (req.method === 'POST' && req.url === '/upload') {
            return handleFileUpload(req, res);
        }

        // Servir archivos estáticos
        return serveStaticFile(req, res);
    } catch (error) {
        console.error('Server error:', error);
        sendError(res, 500, 'Internal Server Error');
    }
});

async function handleFileUpload(req, res) {
    upload(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return sendError(res, 413, 'File too large (max 5MB)');
            }
            return sendError(res, 500, 'File upload failed');
        }
        
        if (!req.file) {
            return sendError(res, 400, 'No file uploaded');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'File uploaded successfully',
            file: req.file.filename
        }));
    });
}

async function serveStaticFile(req, res) {
    // Determinar el archivo a servir
    let filePath = path.join(__dirname, req.url === '/' ? 'attractive_page.html' : req.url);
    const extname = path.extname(filePath).toLowerCase();

    // Validar extensión de archivo
    if (!allowedStaticFiles.includes(extname)) {
        return sendError(res, 403, 'Forbidden');
    }

    // Verificar si existe en caché
    if (staticCache[filePath] && staticCache[filePath].timestamp + cacheDuration > Date.now()) {
        const { content, contentType } = staticCache[filePath];
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(content);
    }

    // Leer archivo del sistema
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return sendError(res, 404, 'Not Found');
            }
            return sendError(res, 500, 'Error reading file');
        }

        // Almacenar en caché
        staticCache[filePath] = {
            content,
            contentType: mimeTypes[extname] || 'text/plain',
            timestamp: Date.now()
        };

        // Enviar respuesta
        res.writeHead(200, { 
            'Content-Type': mimeTypes[extname] || 'text/plain',
            'Cache-Control': 'public, max-age=3600' 
        });
        res.end(content);
    });
}

function sendError(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(message);
}

// Crear directorio uploads si no existe
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Upload directory: ${path.join(__dirname, 'uploads')}`);
});

// Manejo de errores globales
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
