FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./

RUN mvn -q -e -B -DskipTests dependency:go-offline

COPY . .

RUN mvn -q -e -B -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

RUN useradd -r -s /bin/false spring && mkdir -p /app && chown spring:spring /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""

USER spring
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]