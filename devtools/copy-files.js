const fs = require("fs");
const path = require("path");

const fileMappings = require("./file-paths.json");

fileMappings.forEach((pkg) => {
  pkg.files.forEach((file) => {
    const sourcePath = path.resolve(
      __dirname,
      `../node_modules/${pkg.package}/${file}`
    );
    const destinationPath = path.resolve(
      __dirname,
      `../src/twincat/vision-toolkit-hmi/Imports/${pkg.package}/${file}`
    );

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`Copied '${file}'`);
  });
});
