const fs = require('fs');
const https = require('https');
const path = require('path');

const imageDir = path.join(__dirname, '../public/demo-images/auto-parts');

// Auto parts categories with search terms
const autoPartsCategories = [
    'engine-parts', 'brake-parts', 'transmission-parts', 'suspension-parts',
    'electrical-parts', 'cooling-parts', 'exhaust-parts', 'fuel-parts',
    'steering-parts', 'body-parts', 'interior-parts', 'lighting-parts',
    'filters', 'batteries', 'tires', 'wheels', 'spark-plugs', 'oil-parts',
    'belts', 'hoses', 'gaskets', 'bearings', 'clutch-parts', 'alternator',
    'starter-motor', 'radiator', 'water-pump', 'air-filter', 'oil-filter',
    'fuel-pump', 'shock-absorber', 'brake-pads', 'brake-disc', 'headlight',
    'taillight', 'mirror', 'bumper', 'fender', 'hood', 'door-handle',
    'window-motor', 'wiper-blade', 'horn', 'seat-cover', 'floor-mat',
    'steering-wheel', 'gear-shift', 'dashboard', 'speedometer', 'carburetor',
    'turbo-charger', 'timing-belt', 'cam-shaft', 'crank-shaft', 'piston'
];

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => { });
            reject(err);
        });
    });
}

async function downloadImages() {
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    console.log('Downloading auto parts images...');

    for (let i = 1; i <= 100; i++) {
        const category = autoPartsCategories[i % autoPartsCategories.length];
        const filename = path.join(imageDir, `${category}-${i}.jpg`);
        const url = `https://picsum.photos/400/300?random=${i}`;

        try {
            await downloadImage(url, filename);
            console.log(`Downloaded: ${category}-${i}.jpg`);
        } catch (error) {
            console.error(`Failed to download image ${i}:`, error.message);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('Finished downloading images!');
}

downloadImages();
