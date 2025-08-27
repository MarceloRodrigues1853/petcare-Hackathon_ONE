# ====== build ======
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copia apenas o POM para cachear dependências
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copia o restante do código
COPY src ./src

# Compila o projeto (gera o .jar)
RUN mvn -q -DskipTests package

# ====== runtime ======
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copia o .jar gerado do build
COPY --from=build /app/target/*.jar app.jar

# Variáveis opcionais (podem vir do docker-compose ou .env)
ENV JAVA_OPTS=""
ENV SERVER_PORT=8080

# Expõe a porta do backend
EXPOSE 8080

# Executa o .jar
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
