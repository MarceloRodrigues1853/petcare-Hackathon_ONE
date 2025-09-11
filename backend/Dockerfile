FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copia apenas o POM para cachear dependências
COPY pom.xml .
# ↓ baixa dependências SEM compilar/rodar testes
RUN mvn -q -DskipTests -Dmaven.test.skip=true dependency:go-offline

# Copia o restante do código
COPY src ./src

# 👇 importante: CLEAN para apagar classes antigas
RUN mvn -q -DskipTests -Dmaven.test.skip=true clean package

# ====== runtime ======
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
