FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g trivy && npm install

EXPOSE 5000
CMD ["node", "index.js"]
