# CLI

## Helper

```bash

# PM2 start
pm2 start /var/www/rok-title-license-nodejs/dist/main.js --name "rok-title-license"

# Create migration
yarn migration:create src/migrations/<file name>

# Run migration
yarn migration:run
```

## Deploy

```bash
# Build

yarn build

# restart pm2
pm2 restart rok-title-license
```
