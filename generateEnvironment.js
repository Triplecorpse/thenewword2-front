const fs = require('fs');

let prod = fs.readFileSync('./src/environments/environment.prod.ts', 'UTF8');
let qa = fs.readFileSync('./src/environments/environment.qa.ts', 'UTF8');
let env = fs.readFileSync('./src/environments/environment.ts', 'UTF8');

prod = prod.replace(/@hash_\d+/, `@hash_${Date.now()}`);
qa = qa.replace(/@hash_\d+/, `@hash_${Date.now()}`);
env = env.replace(/@hash_\d+/, `@hash_${Date.now()}`);

fs.writeFileSync('./src/environments/environment.prod.ts', prod);
fs.writeFileSync('./src/environments/environment.qa.ts', qa);
fs.writeFileSync('./src/environments/environment.ts', env);
