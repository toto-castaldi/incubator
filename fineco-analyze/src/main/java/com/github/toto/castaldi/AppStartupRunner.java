package com.github.toto.castaldi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AppStartupRunner implements ApplicationRunner {

    private AccountMovementExcels accountMovementExcels;
    private FinecoMovementStorage finecoMovementStorage;
    private MovementCategories movementCategories;
    private MovementAnalysis movementAnalysis;

    @Autowired
    public AppStartupRunner(
            AccountMovementExcels accountMovementExcels,
            FinecoMovementStorage finecoMovementStorage,
            MovementCategories movementCategories,
            MovementAnalysis movementAnalysis
    ) {
        this.accountMovementExcels = accountMovementExcels;
        this.finecoMovementStorage = finecoMovementStorage;
        this.movementCategories = movementCategories;
        this.movementAnalysis = movementAnalysis;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Starting parse files");
        this.accountMovementExcels.forEach(accountMovementExcel -> {
            log.info("Parsing file {}", accountMovementExcel);
            accountMovementExcel.forEach(finecoMovement -> {
                log.info("Movement created {}", finecoMovement);
                this.finecoMovementStorage.store(this.movementCategories.categorize(finecoMovement));
            });
        });
        log.info("All movement stored");

        this.movementCategories.categories().forEach(movementCategory -> {
            log.info("Mean for the category {} is {}", movementCategory, this.movementAnalysis.computeMean(this.finecoMovementStorage.loadByCategory(movementCategory)));
        });

    }

}
