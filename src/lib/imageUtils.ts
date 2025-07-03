// Static list of demo images (no fs needed for client-side)
const demoImages = [
    '/demo-images/auto-parts/auto-part-1.jpg',
    '/demo-images/auto-parts/auto-part-2.jpg',
    '/demo-images/auto-parts/auto-part-3.jpg',
    '/demo-images/auto-parts/auto-part-4.jpg',
    '/demo-images/auto-parts/auto-part-5.jpg',
    '/demo-images/auto-parts/auto-part-6.jpg',
    '/demo-images/auto-parts/auto-part-7.jpg',
    '/demo-images/auto-parts/auto-part-8.jpg',
    '/demo-images/auto-parts/auto-part-9.jpg',
    '/demo-images/auto-parts/auto-part-10.jpg',
    '/demo-images/auto-parts/auto-part-11.jpg',
    '/demo-images/auto-parts/auto-part-12.jpg',
    '/demo-images/auto-parts/auto-part-13.jpg',
    '/demo-images/auto-parts/auto-part-14.jpg',
    '/demo-images/auto-parts/auto-part-15.jpg',
    '/demo-images/auto-parts/auto-part-16.jpg',
    '/demo-images/auto-parts/auto-part-17.jpg',
    '/demo-images/auto-parts/auto-part-18.jpg',
    '/demo-images/auto-parts/auto-part-19.jpg',
    '/demo-images/auto-parts/auto-part-20.jpg',
    '/demo-images/auto-parts/placeholder.svg'
];

export function getRandomAutoPartImage(): string {
    // Return random image from our static list
    if (demoImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * demoImages.length);
        return demoImages[randomIndex];
    }

    // Fallback to placeholder
    return '/demo-images/auto-parts/placeholder.svg';
}

export function getRandomAutoPartImages(count: number): string[] {
    const images: string[] = [];
    for (let i = 0; i < count; i++) {
        images.push(getRandomAutoPartImage());
    }
    return images;
}

// Get all available images
export function getAllAutoPartImages(): string[] {
    return demoImages;
}

// Get image by category (optional)
export function getImageByCategory(category: string): string {
    const categoryImages = demoImages.filter(img =>
        img.toLowerCase().includes(category.toLowerCase())
    );

    if (categoryImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryImages.length);
        return categoryImages[randomIndex];
    }

    return getRandomAutoPartImage();
}
