/** @type {import('next').NextConfig} */
const nextConfig = {
    // This is the primary fix for the three-globe/three module resolution error.
    // It tells Webpack to ignore non-existent deep imports used by three-globe.
    webpack: (config, { isServer }) => {

        // --- FIX 1: Alias broken imports to avoid Webpack Module Not Found errors ---
        // This is the most reliable way to handle the "three/webgpu" and "three/tsl" errors.
        // We map the broken import paths to false, which tells Webpack to ignore them 
        // during compilation, as they are not needed for client-side functionality.
        config.resolve.alias = {
            ...config.resolve.alias,
            'three/webgpu': false,
            'three/tsl': false,
        };


        // --- FIX 2: Prevent certain large three.js dependencies from being compiled server-side ---
        // This part is mainly defensive programming for common three.js dependency issues.
        if (isServer) {
            config.externals.push(
                'three/examples/jsm/libs/tween.module.min.js',
                'three/examples/jsm/libs/draco/gltf/',
                'three/examples/jsm/controls/OrbitControls.js'
            );
        }

        // --- FIX 3: Ensure .mjs files are handled correctly ---
        // Crucial for handling three.js/mjs files correctly in Next.js 13/14
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });

        return config;
    },

    // You should keep any other configurations you have here (e.g., experimental features)
};

module.exports = nextConfig;