const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/products_export_1.csv');
const outputPath = path.join(__dirname, '../src/data/mockData.ts');

console.log(`Reading CSV from ${csvPath}...`);

try {
    const data = fs.readFileSync(csvPath, 'utf8');

    // Robust CSV parser for handling quoted fields with newlines
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        const nextChar = data[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"'; // Escaped quote
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentField);
            if (currentRow.length > 1) rows.push(currentRow); // Skip empty lines
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }

    // Extract Headers
    const headers = rows[0];
    const products = [];
    console.log(`Found ${rows.length} rows.`);

    // Column Indices
    const idxTitle = headers.indexOf('Title');
    const idxBody = headers.indexOf('Body (HTML)');
    const idxCategory = headers.indexOf('Product Category');
    const idxType = headers.indexOf('Type');
    const idxPrice = headers.indexOf('Variant Price');
    const idxImage = headers.indexOf('Image Src');
    const idxHandle = headers.indexOf('Handle');

    const seenHandles = new Set();

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < headers.length) continue;

        const handle = row[idxHandle];
        const title = row[idxTitle];
        const price = row[idxPrice];
        const image = row[idxImage];
        const categoryRaw = row[idxCategory] || '';
        const type = row[idxType] || '';
        const body = row[idxBody] || '';

        // Skip variants of the same product for the main listing (simple migration)
        // Or better: keep them but ensure unique IDs? 
        // For this app, let's keep unique products by Handle to avoid duplicates in grid
        if (seenHandles.has(handle)) continue;
        seenHandles.add(handle);

        if (!title || !price) continue;

        // Categorization Logic
        let category = 'Other';
        const lowerCat = categoryRaw.toLowerCase();
        const lowerType = type.toLowerCase();
        const lowerTitle = title.toLowerCase();

        if (lowerCat.includes('socks') || lowerCat.includes('clothing') || lowerCat.includes('activewear')) {
            if (lowerTitle.includes('women') || lowerTitle.includes('bra') || lowerTitle.includes('leggings')) category = 'Women';
            else if (lowerTitle.includes('men') || lowerTitle.includes('shirt') || lowerTitle.includes('shorts')) category = 'Men';
            else category = 'Gym Wear';
        } else if (lowerCat.includes('nutrition') || lowerCat.includes('supplement') || lowerCat.includes('food')) {
            if (lowerTitle.includes('bar') || lowerTitle.includes('snack') || lowerTitle.includes('croissant') || lowerTitle.includes('water')) {
                category = 'Healthy Snacks';
            } else {
                // Supplements sub-logic
                if (lowerTitle.includes('whey') || lowerTitle.includes('protein')) category = 'Protein';
                else if (lowerTitle.includes('creatine')) category = 'Creatine';
                else if (lowerTitle.includes('amino') || lowerTitle.includes('bcaa')) category = 'Amino & Recovery';
                else if (lowerTitle.includes('energy') || lowerTitle.includes('pre-workout')) category = 'Energy';
                else category = 'Supplements'; // Fallback
            }
        } else if (lowerCat.includes('equipment') || lowerCat.includes('machine') || lowerTitle.includes('bench') || lowerTitle.includes('dumbbell')) {
            if (lowerTitle.includes('machine') || lowerTitle.includes('bench')) category = 'Machines';
            else category = 'Home Equipment';
        } else {
            // Try to guess from Title if category is missing
            if (lowerTitle.includes('protein')) category = 'Protein';
            else if (lowerTitle.includes('t-shirt') || lowerTitle.includes('short')) category = 'Gym Wear';
        }

        products.push({
            id: handle,
            name: title.replace(/"/g, ''),
            category: category,
            price: parseFloat(price),
            image: image || 'https://placehold.co/400x400/262626/ededed?text=No+Image',
            rating: 4.5, // Default rating
            description: body.replace(/<[^>]*>?/gm, '').substring(0, 100).replace(/\n/g, ' ').trim()
        });
    }

    console.log(`Parsed ${products.length} unique products.`);

    // Generate TypeScript content
    const tsContent = `import type { Product } from '../components/ui/ProductCard';

export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log(`Successfully wrote to ${outputPath}`);

} catch (error) {
    console.error('Migration failed:', error);
}
