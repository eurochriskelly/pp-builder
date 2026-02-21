# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application (TypeScript + Tailwind)
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built artifacts and necessary source files
# The build script puts TS output in dist/ and Tailwind CSS output in src/ui/public/styles/main-compiled.css
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src

# Expose the port (this is documentation only, Kamal handles the mapping)
EXPOSE 4005

# Start the application using the built CLI
# We use "serve" command and rely on process.env.PORT which we set in bin/pp.ts
CMD ["node", "dist/bin/pp.js", "serve"]
