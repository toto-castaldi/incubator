package com.github.toto.castaldi;

import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class FinecoMovementStorage {
    public void store(BankMovement bankMovement) {

    }

    public Collection<BankMovement> loadByCategory(MovementCategory movementCategory) {
        return null;
    }
}
