# 1. Kill le processus npm s'il tourne encore
killall node npm

# 2. Nettoyage total
rm -rf node_modules package-lock.json ~/.npm/_cacache

# 3. Configuration npm
npm config set registry https://registry.npmjs.org/
npm config set timeout 60000

# 4. Cache clean
npm cache clean --force

# 5. Installation avec force
npm install --force --no-optional