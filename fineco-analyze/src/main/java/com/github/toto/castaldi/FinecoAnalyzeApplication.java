package com.github.toto.castaldi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

@SpringBootApplication
@Slf4j
public class FinecoAnalyzeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinecoAnalyzeApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {
            log.trace("this is a {} log line", "TRACE");
            log.debug("this is a {}log line", "DEBUG");
            log.info("this is a {} log line", "INFO");
            log.warn("this is a {} log line", "WARN");
            log.error("this is a {} log line", "ERROR");

            log.debug("Let's inspect the beans provided by Spring Boot:");

            String[] beanNames = ctx.getBeanDefinitionNames();
            Arrays.sort(beanNames);
            for (String beanName : beanNames) {
                log.debug("bean name {}", beanName);
            }

        };
    }

}
