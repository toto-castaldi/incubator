package brisk;

import com.google.common.base.Optional;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.RandomUtils;

import java.util.List;
import java.util.Random;

/**
 * Created by root on 12/15/16.
 */
public class Lobby {

    private final List<Table> tables;

    public Lobby() {
        tables = Lists.newArrayList();
    }

    public Optional<Table> randomTable() {
        return Optional.fromNullable(tables.size() > 0 ? tables.get(RandomUtils.nextInt(0, tables.size())) : null);
    }

    public Table addTable(Table table) {
        tables.add(table);
        return table;
    }
}
