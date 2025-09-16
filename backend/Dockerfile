# ====== STAGE 1: BUILD ======
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Baixa deps em cache
COPY pom.xml .
RUN mvn -q -DskipTests -Dmaven.test.skip=true dependency:go-offline

# Copia o código e builda
COPY src ./src
RUN mvn -q -DskipTests -Dmaven.test.skip=true clean package

# ====== STAGE 2: RUNTIME ======
FROM eclipse-temurin:17-jre
# instala curl pro healthcheck do docker-compose
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
