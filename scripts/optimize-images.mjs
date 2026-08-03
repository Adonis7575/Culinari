import { readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const imageDirectory = join(process.cwd(), "public", "images", "editorial");
const files = (await readdir(imageDirectory)).filter(
  (file) => extname(file).toLowerCase() === ".png"
);

for (const file of files) {
  const source = join(imageDirectory, file);
  const output = join(imageDirectory, `${basename(file, ".png")}.webp`);
  const before = (await stat(source)).size;

  await sharp(source)
    .rotate()
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(output);

  const after = (await stat(output)).size;
  const reduction = Math.round((1 - after / before) * 100);
  console.log(`${file}: ${reduction}% smaller`);
}
