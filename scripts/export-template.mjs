
const config = (await import("../src/lib/data.config.example.ts")).default;
console.log(JSON.stringify(config, null, 2));
