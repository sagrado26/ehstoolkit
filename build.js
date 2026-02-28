#!/usr/bin/env node
import { build as viteBuild, loadConfigFromFile } from 'vite';
import { build as esbuildBuild } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function build() {
    try {
        console.log('Building client with Vite...');

        // Load vite config
        const configFile = path.resolve(__dirname, 'vite.config.js');
        const configEnv = { command: 'build', mode: 'production' };
        const configResult = await loadConfigFromFile(configEnv, configFile);
        const config = configResult?.config || {};

        await viteBuild(config);

        console.log('Building server with esbuild...');
        await esbuildBuild({
            entryPoints: ['server/index.prod.ts'],
            platform: 'node',
            packages: 'external',
            bundle: true,
            format: 'esm',
            outfile: 'dist/index.js',
            absWorkingDir: __dirname,
        });

        console.log('✅ Build successful!');
    } catch (err) {
        console.error('❌ Build failed:', err.message);
        process.exit(1);
    }
}

build();
