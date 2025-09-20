# ====== build ======
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache das dependências: só muda se o pom.xml mudar
COPY pom.xml .
# Desliga barra de progresso, paraleliza, e não roda testes
RUN mvn -B -T 1C -DskipTests -Dmaven.test.skip=true -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn \
    dependency:go-offline

# Agora copia o código. Se só src mudar, reaproveita cache das deps
COPY src ./src

# CLEAN para limpar classes antigas e empacotar o jar
RUN mvn -B -T 1C -DskipTests -Dmaven.test.skip=true \
    -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn \
    clean package

# ====== runtime ======
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copia o jar gerado (spring-boot-maven-plugin cria um *-SNAPSHOT.jar)
COPY --from=build /app/target/*SNAPSHOT.jar /app/app.jar
# se você usa versão fixa, pode trocar o wildcard por nome exato

EXPOSE 8080

# Opções de memória/GC ajustáveis via variável, se quiser
ENV JAVA_OPTS=""

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
