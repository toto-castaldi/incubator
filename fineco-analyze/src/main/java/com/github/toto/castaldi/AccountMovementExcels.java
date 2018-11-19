package com.github.toto.castaldi;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Iterator;

@Component
public class AccountMovementExcels implements Iterable<AccountMovementExcel> {

    @Override
    public Iterator<AccountMovementExcel> iterator() {
        return new ArrayList().iterator();
    }

}
