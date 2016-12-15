package brisk;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.apache.commons.lang3.RandomUtils;

import static org.junit.Assert.assertEquals;

/**
 * Created by root on 12/14/16.
 */
public class Stepdefs {


    private Lobby lobby;
    private Table choosenTable;

    @Given("^some tables$")
    public void createTables() throws Throwable {
        lobby = new Lobby();
        for (int i = 0; i < RandomUtils.nextInt(1,10); i++) {
            lobby.addTable(new Table());
        }
    }

    @Given("^at least (\\d+) table has four player waiting$")
    public void tablesWithFourPlayers(int tables) throws Throwable {
        for (int i = 0; i < tables; i++) {
            Table table = lobby.addTable(new Table());
            while (!table.isFull()) {
                table.playerJoin(new Player());
            }
            table.playerLeave(0);
        }

    }

    @When("^(\\w+) choose a table with four player waiting$")
    public void sean_choose_a_table_with_four_player_waiting(String playerName) throws Throwable {
        choosenTable = lobby.randomTable().get();
        while (choosenTable.playerCount() != 4) {
            choosenTable = lobby.randomTable().get();
        }
        Player player = choosenTable.playerJoin(new Player());
        player.setName(playerName);
    }

    @Then("^the match starts on chosen table$")
    public void the_match_starts() throws Throwable {
        assertEquals(choosenTable.getStatus(), Table.STATUS.STARTING);
    }
}
