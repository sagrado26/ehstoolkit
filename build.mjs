#!/usr/bin/env node
import { build, loadConfigFromFile } from 'vite';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildApp() {
  try {
    // Load vite config 
    console.log('Building client with Vite...');
    const configFile = path.resolve(__dirname, 'vite.config.ts');
    
    const configResult = await loadConfigFromFile(
      { command: 'build', mode: 'production' },
      configFile
    );
    
    const config = configResult?.config || {};
    
    // Ensure critical settings are set
    if (config.build) {
      config.build.outDir = path.resolve(__dirname, 'dist/public');
      config.build.emptyOutDir = true;
    } else {
      config.build = {
        outDir: path.resolve(__dirname, 'dist/public'),
        emptyOutDir: true,
      };
    }
    
    if (!config.root) {
      config.root = path.resolve(__dirname, 'client');
    }
    
    await build(config);
    
    // Build server with esbuild
    console.log('Building server with esbuild...');
    try {
      execSync('esbuild server/index.prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js', { 
        cwd: __dirname,
        stdio: 'inherit',
        shell: true 
      });
    } catch (err) {
      console.error('esbuild failed:', err.message);
      process.exit(1);
    }

    console.log('Build successful!');
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

buildApp();

