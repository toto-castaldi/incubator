package brisk;

import com.google.common.base.Optional;
import com.google.common.collect.Lists;

import java.util.List;

/**
 * Created by root on 12/15/16.
 */
public class Table {

    private static final int MAX_PLAYERS = 5;
    public enum STATUS {WAITING_FOR_PLAYERS, STARTING}

    private List<Player> players;
    private STATUS status;

    public Table () {
        players = Lists.newArrayList();
        status = STATUS.WAITING_FOR_PLAYERS;
    }

    public boolean isFull() {
        return players.size() == MAX_PLAYERS;
    }

    public void playerJoin(Player player) {
        int countBefore = playerCount();
        if (countBefore < MAX_PLAYERS) {
            players.add(player);
            status = STATUS.STARTING;
        }
    }

    public Optional<Player> playerLeave(int index) {
        if (players.size() > index) {
            return Optional.of(players.remove(index));
        } else {
            return Optional.absent();
        }
    }

    public int playerCount() {
        return players.size();
    }

    public STATUS getStatus() {
        return status;
    }
}
