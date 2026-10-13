# ==============================================================================
# StudentHub - Combined Full-Stack Docker Deployment
# Builds React Frontend and packages it inside Spring Boot JAR for a single 
# unified service with zero CORS configuration.
# ==============================================================================

# 1. Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. Build Spring Boot Backend with embedded Frontend static files
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
RUN ./mvnw dependency:go-offline -B || true
COPY backend/src ./src
# Embed built React assets directly into Spring Boot static resources directory
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN ./mvnw clean package -DskipTests

# 3. Production Java 21 Runtime Container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
