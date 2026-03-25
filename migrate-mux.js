import Mux from '@mux/mux-node';
import "dotenv/config";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET
});

async function migrateVideo() {
  console.log('🔄 Starting migration to Mux...');
  
  try {
    const asset = await mux.video.assets.create({
      input: 'https://bodybar.ae/cdn/shop/videos/c/vp/6bf849158a8f4df09b77bbc92ab568c5/6bf849158a8f4df09b77bbc92ab568c5.HD-720p-3.0Mbps-25688833.mp4?v=0',
      playback_policy: ['public'],
    });

    console.log('✅ Success! Mux Asset Created.');
    console.log('Asset ID:', asset.id);
    console.log('Playback ID:', asset.playback_ids[0].id);
    
  } catch (error) {
    console.error('❌ Mux Error:', error);
  }
}

migrateVideo();
