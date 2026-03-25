import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

// We need the service role key ideally, but since we only have ANON key, 
// we will assume RLS policies allow insertion/storage uploads, or we are using the Anon key.
const supabase = createClient(supabaseUrl, supabaseKey);

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download image: ${res.statusCode} ${res.statusMessage}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
};

async function migrateImages() {
    console.log("Starting image migration...");
    
    const bucketName = 'product-images';
    // Bucket was created via raw SQL using the MCP server to bypass Anon key limits

    // 2. Fetch all products from the public view (which proxies to shopify schema)
    const { data: products, error: productsError } = await supabase.from('products').select('id, featured_image');
    
    if (productsError) {
        console.error("Error fetching products:", productsError.message);
        return;
    }

    console.log(`Found ${products.length} products to check.`);

    // Tmp dir for processing
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const tmpDir = path.join(__dirname, 'tmp_images');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }

    for (const product of products) {
        if (!product.featured_image || !product.featured_image.url) continue;
        
        const originalUrl = product.featured_image.url;
        
        // Skip if it's already a supabase URL
        if (originalUrl.includes('supabase.co')) continue;

        try {
            console.log(`Migrating image for product ${product.id}...`);
            // Extract filename and normalize
            const urlObj = new URL(originalUrl);
            const pathname = urlObj.pathname;
            const originalFilename = path.basename(pathname); // e.g., image.jpg
            
            // Clean up query params from local filename just in case
            const safeName = originalFilename.split('?')[0]; 
            const localPath = path.join(tmpDir, safeName);
            
            // Download the image
            await downloadImage(originalUrl, localPath);
            
            // Upload to Supabase Storage
            const fileBuffer = fs.readFileSync(localPath);
            
            // Use product ID + safeName to prevent collisions
            const storagePath = `shopify_migration/${product.id}_${safeName}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(storagePath, fileBuffer, {
                    upsert: true,
                    contentType: 'image/jpeg' // Approximation, ideally deciphered from extension
                });
                
            if (uploadError) {
                console.error(`Error uploading ${safeName}:`, uploadError.message);
                continue;
            }

            // Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(storagePath);
                
            const newUrl = publicUrlData.publicUrl;
            console.log(`Uploaded! New URL: ${newUrl}`);
            
            // Update the database record
            // Note: updating a jsonb column 'featured_image'
            const updatedFeaturedImage = { ...product.featured_image, url: newUrl };
            
            const { error: updateError } = await supabase
                .from('products')
                .update({ featured_image: updatedFeaturedImage })
                .eq('id', product.id);
                
            if (updateError) {
                console.error(`Failed to update DB for product ${product.id}:`, updateError.message);
            } else {
                console.log(`Database updated for product ${product.id}`);
            }
            
            // Cleanup local file
            fs.unlinkSync(localPath);

        } catch (e) {
            console.error(`Failed to process product ${product.id}:`, e);
        }
    }
    
    console.log("Migration complete.");
}

migrateImages();
