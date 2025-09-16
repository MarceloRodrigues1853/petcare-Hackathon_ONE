package com.petcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// =======================================================
// INÍCIO DA CORREÇÃO FINAL
// Adicionando anotações explícitas para garantir que o Spring encontre tudo
// =======================================================
@EnableJpaRepositories(basePackages = "com.petcare") // Diz onde procurar os Repositórios
@EntityScan(basePackages = "com.petcare")           // Diz onde procurar as Entidades (@Entity)
// =======================================================
// FIM DA CORREÇÃO
// =======================================================
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}