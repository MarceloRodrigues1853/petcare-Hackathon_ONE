# backend/Dockerfile

# --- build ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -DskipTests=true dependency:go-offline
COPY src ./src
RUN mvn -q -Dmaven.test.skip=true clean package

# --- runtime ---
FROM eclipse-temurin:17-jre
WORKDIR /app

# instala curl p/ o HEALTHCHECK do compose funcionar
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
