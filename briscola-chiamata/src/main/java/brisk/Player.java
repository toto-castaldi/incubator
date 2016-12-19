package brisk;

import com.google.common.base.Optional;
import com.google.common.base.Supplier;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;
import java.util.WeakHashMap;

/**
 * Created by root on 12/15/16.
 */
@ToString (of = "name")
@EqualsAndHashCode (of = "name")
public class Player {

    private final static Map<String, Player> dictionary = new WeakHashMap<>();
    private final String name;

    @Setter
    private Table lastTable;

    private Player (String name) {
        this.name = name;
        this.lastTable = null;
        Player.dictionary.put(name, this);
    }

    public static Optional<Player> findByName(String name) {
        if (dictionary.containsKey(name)) {
            return Optional.of(dictionary.get(name));
        } else {
            return Optional.absent();
        }
    }

    public static Player create(String name) {
        Optional<Player> byName = Player.findByName(name);
        //ystem.out.println("player creation " + name + " : " + byName);
        return byName.or(new Supplier<Player>() {
            @Override
            public Player get() {
                return new Player(name);
            }
        });
    }


    public Optional<Table> lastTable() {
        return Optional.fromNullable(lastTable);
    }
}
