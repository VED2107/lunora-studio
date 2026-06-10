import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logo = path.join(root, "logo", "WhatsApp Image 2026-06-08 at 12.52.49 PM.jpeg");

async function main() {
  // Favicon ICO (32x32)
  await sharp(logo)
    .resize(32, 32, { fit: "cover" })
    .png()
    .toFile(path.join(root, "src", "app", "favicon.ico"));

  // Apple touch icon (180x180)
  await sharp(logo)
    .resize(180, 180, { fit: "cover" })
    .png()
    .toFile(path.join(root, "public", "apple-touch-icon.png"));

  // OG image (1200x630)
  await sharp(logo)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 85 })
    .toFile(path.join(root, "public", "og-image.jpg"));

  console.log("Favicon, apple-touch-icon, and OG image created.");
}

main().catch(console.error);
