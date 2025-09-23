FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./ 2>/dev/null || true
RUN npm ci || npm install
COPY . .
ENV PORT=4600
EXPOSE 4600
CMD ["npm", "start"]
