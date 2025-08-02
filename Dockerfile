FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json dulu untuk caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

RUN npx prisma generate


# Expose port (misalnya pakai 3000, sesuaikan dengan express kamu)
EXPOSE 3000

# Jalankan perintah default (bisa juga override di compose)

CMD ["npm", "run", "dev"]
