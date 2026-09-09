import fs from 'fs';
import path from 'path';

const CLOUD_NAME = 'o8xawiyy';
const UPLOAD_PRESET = 'yousra_img';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Function to find all images in directories
function findImages(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findImages(fullPath, fileList);
    } else if (/\.(png|jpe?g|webp|svg|gif|avif)$/i.test(item)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Upload a single file to Cloudinary using fetch + FormData (Node 18+ built-in)
async function uploadImage(filePath) {
  const fileName = path.basename(filePath);
  console.log(`Uploading ${fileName} (${filePath})...`);

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer]);
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Upload failed for ${fileName} (${response.status}): ${errText}`);
  }

  const result = await response.json();
  const secureUrl = result.secure_url;
  
  // Transform URL to insert f_auto,q_auto
  // Cloudinary secure_url format:
  // https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
  let optimizedUrl = secureUrl;
  if (secureUrl.includes('/image/upload/')) {
    optimizedUrl = secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
  }

  console.log(`✓ Uploaded ${fileName}:`);
  console.log(`  Raw URL: ${secureUrl}`);
  console.log(`  Optimized URL: ${optimizedUrl}`);

  return {
    filePath,
    fileName,
    publicId: result.public_id,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    rawSecureUrl: secureUrl,
    optimizedUrl,
    optimizedWidthUrl: secureUrl.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_auto/'),
  };
}

async function main() {
  console.log('--- Scanning image directories ---');
  const targetDirs = ['public', 'src/assets'];
  const allImages = [];
  for (const d of targetDirs) {
    findImages(d, allImages);
  }

  console.log(`Found ${allImages.length} images:`, allImages);

  const mappings = [];

  for (const imgPath of allImages) {
    try {
      const res = await uploadImage(imgPath);
      mappings.push(res);
    } catch (e) {
      console.error(`Error uploading ${imgPath}:`, e.message);
    }
  }

  // Save mapping file
  const mappingFile = path.resolve('cloudinary-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(mappings, null, 2), 'utf8');
  console.log(`\nMapping successfully saved to ${mappingFile}`);

  console.log('\n--- Summary of Mappings ---');
  console.table(mappings.map(m => ({
    File: m.fileName,
    Width: m.width,
    Height: m.height,
    OptimizedUrl: m.optimizedUrl
  })));
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
