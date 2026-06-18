const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectSrc = path.join(__dirname, '..', 'public', 'images', 'projects');
const projectOut = path.join(__dirname, '..', 'public', 'images', 'optimized', 'projects');
const profileSrc = path.join(__dirname, '..', 'src', 'assets', 'profile-photo.png');
const profileOutDir = path.join(__dirname, '..', 'src', 'assets', 'optimized');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function optimizeProjects() {
  ensureDir(projectOut);
  if (!fs.existsSync(projectSrc)) return;
  const files = fs.readdirSync(projectSrc).filter(f => /\.(png|jpe?g|webp)$/i.test(f));
  for (const file of files) {
    const src = path.join(projectSrc, file);
    const name = path.parse(file).name;
    const out = path.join(projectOut, `${name}.webp`);
    try {
      await sharp(src)
        .webp({ quality: 80 })
        .toFile(out);
      console.log(`optimized ${src} -> ${out}`);
    } catch (e) {
      console.error(`failed optimizing ${src}:`, e.message);
    }
  }
}

async function optimizeProfile() {
  ensureDir(profileOutDir);
  if (!fs.existsSync(profileSrc)) return;
  const out = path.join(profileOutDir, 'profile-photo.webp');
  try {
    await sharp(profileSrc)
      .resize(384, 384, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(out);
    console.log(`optimized profile -> ${out}`);
  } catch (e) {
    console.error('failed optimizing profile:', e.message);
  }
}

async function run() {
  await optimizeProjects();
  await optimizeProfile();
  console.log('image optimization complete');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
