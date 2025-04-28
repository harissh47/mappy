FROM node:20-slim AS builder
 
WORKDIR /app
 
COPY . .
 
RUN npm install
 
ENV NEXT_PUBLIC_BACKEND_URL=https://mappy.sifymdp.digital
 
RUN npm run build
 
FROM node:20-slim AS runner
 
WORKDIR /app
 
ENV NODE_ENV=production
 
# Copy the built output and public folder from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
 

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
 

EXPOSE 3000
 

CMD ["npm", "start"] 