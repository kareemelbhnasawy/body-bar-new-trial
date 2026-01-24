import fs from 'fs';
import path from 'path';

const csvPath = 'e:/KUL/body-bar-new/data/products_export_1.csv';
const outputPath = 'e:/KUL/body-bar-new/src/data/products.json';

try {
    console.log('Reading CSV from:', csvPath);
    const csv = fs.readFileSync(csvPath, 'utf-8');
    console.log('CSV read, length:', csv.length);

    const lines = csv.split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim());

    const products = [];
    const seenIds = new Set();

    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i + 1] === '"') {
                current += '"';
                i++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = parseCSVLine(lines[i]);

        // Map columns by index to be safe
        // Handle,Title,Body,Vendor,Category,Type,Tags...
        const handle = row[0];
        const title = row[1];
        const body = row[2];
        // Price usually around index 24 (Variant Price) in Shopify
        // Search for headers index
        const priceIdx = headers.indexOf('Variant Price');
        const imgIdx = headers.indexOf('Image Src');
        const catIdx = headers.indexOf('Product Category');
        const tagsIdx = headers.indexOf('Tags');

        if (!handle || seenIds.has(handle)) continue;

        const price = parseFloat(row[priceIdx]) || 0;
        const imageSrc = row[imgIdx];
        const categoryRaw = row[catIdx] || '';
        const tags = row[tagsIdx] || '';

        seenIds.add(handle);

        let category = 'Gym Wear';
        const lowerCat = categoryRaw.toLowerCase();
        const lowerTitle = title.toLowerCase();
        const lowerTags = tags.toLowerCase();

        if (lowerCat.includes('food') || lowerCat.includes('beverage') || lowerCat.includes('water')) {
            category = 'Healthy Snacks';
        } else if (lowerCat.includes('vitamin') || lowerCat.includes('supplement') || lowerCat.includes('nutri')) {
            category = 'Supplements';
            if (lowerTitle.includes('bcaa')) category = 'Amino & Recovery'; // Map to exact mock categories for now or keep generic
            if (lowerTitle.includes('creatine')) category = 'Creatine';
            if (lowerTitle.includes('protein')) category = 'Protein';
        } else if (lowerCat.includes('socks') || lowerCat.includes('clothing')) {
            if (lowerTags.includes('women')) category = 'Women';
            else if (lowerTags.includes('men')) category = 'Men';
            else category = 'Gym Wear'; // General
        } else if (lowerCat.includes('machine') || lowerCat.includes('equipment')) {
            category = 'Machines';
        } else if (lowerTitle.includes('mat') || lowerTitle.includes('strap')) {
            category = 'Home Equipment';
        }

        products.push({
            id: handle,
            name: title,
            category: category,
            price: price,
            image: imageSrc || '',
            rating: 5.0,
            description: body.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...'
        });
    }

    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
    console.log(`Success! Parsed ${products.length} products.`);

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
