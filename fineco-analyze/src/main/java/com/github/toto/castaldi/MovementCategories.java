package com.github.toto.castaldi;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

@Component
public class MovementCategories {
    public Collection<MovementCategory> categories() {
        return Collections.emptyList();
    }

    public BankMovement categorize(BankMovement bankMovement) {
        return null;
    }
}
