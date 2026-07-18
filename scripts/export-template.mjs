// Prints a starter portfolio.json for seeding your own data repo. Usage: node scripts/export-template.mjs > portfolio.json

const config = (await import("../src/lib/data.config.example.ts")).default;
console.log(JSON.stringify(config, null, 2));
