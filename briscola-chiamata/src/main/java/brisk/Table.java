package brisk;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Sets;

import java.util.Objects;
import java.util.Set;
import java.util.function.Consumer;

/**
 * Created by root on 12/15/16.
 */
public class Table {

    private static final int MAX_PLAYERS = 5;
    private static final int MINIMUM_DESERTERS = 2;
    private Set<Player> players;
    private Set<Player> deserters;
    private STATUS status;
    public enum STATUS {WAITING_FOR_PLAYERS, STARTING}

    public static Predicate<? super Table> withPlayer(final Player player) {
        return new Predicate<Table>() {
            @Override
            public boolean apply(Table table) {
                return Iterables.tryFind(table.players, new Predicate<Player>() {
                    @Override
                    public boolean apply(Player input) {
                        //System.out.println(input + "<->" + player + " = " + Objects.equals(input, player));
                        return Objects.equals(input, player);
                    }
                }).isPresent();
            }
        };
    }


    public void playerShouldLeave(Player player) {
        deserters.add(player);
        if (deserters.size() >= MINIMUM_DESERTERS) {
            deserters.forEach(new Consumer<Player>() {

                @Override
                public void accept(Player player) {
                    player.setLastTable(Table.this);
                }
            });
            init();
        }
    }

    private void init() {
        players = Sets.newHashSet();
        deserters = Sets.newHashSet();
        status = STATUS.WAITING_FOR_PLAYERS;
    }

    public Table () {
        init();
    }

    public Player playerJoin(Player player) {
        int countBefore = playerCount();
        if (countBefore < MAX_PLAYERS) {
            players.add(player);
            status = STATUS.STARTING;
        }
        return player;
    }

    public int playerCount() {
        return players.size();
    }

    public STATUS getStatus() {
        return status;
    }
}
