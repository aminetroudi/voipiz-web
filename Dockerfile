FROM node:20-alpine

WORKDIR /app

# Install first so the layer caches on everything but a dependency change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js ./
COPY public ./public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# The app is a plain express process, so let the container be the process.
CMD ["node", "server.js"]
