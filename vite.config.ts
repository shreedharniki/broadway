import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function uploadPlugin(): Plugin {
  return {
    name: 'upload-background-middleware',
    configureServer(server) {
      server.middlewares.use('/api/upload-background', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString());
              if (body.dataUrl && typeof body.dataUrl === 'string') {
                const base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicDir = path.resolve(__dirname, 'public');
                const imagesDir = path.resolve(publicDir, 'images');
                if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

                fs.writeFileSync(path.resolve(publicDir, 'Broadway-home.png'), buffer);
                fs.writeFileSync(path.resolve(publicDir, 'broadway-city.png'), buffer);
                fs.writeFileSync(path.resolve(imagesDir, 'broadway-city.png'), buffer);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (e) {
              console.error('Failed to parse uploaded image', e);
            }
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid data' }));
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });

      server.middlewares.use('/api/upload-card', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString());
              if (body.dataUrl && typeof body.dataUrl === 'string' && body.key) {
                const base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const publicDir = path.resolve(__dirname, 'public');
                const imagesDir = path.resolve(publicDir, 'images');
                if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

                const filename = `${body.key}.png`;
                fs.writeFileSync(path.resolve(publicDir, filename), buffer);
                fs.writeFileSync(path.resolve(imagesDir, filename), buffer);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (e) {
              console.error('Failed to parse uploaded card image', e);
            }
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid data' }));
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), uploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
