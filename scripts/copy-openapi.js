const fs = require('fs');
fs.copyFileSync('src/docs-openapi.yaml', 'dist/docs-openapi.yaml');
console.log('OpenAPI copied');
