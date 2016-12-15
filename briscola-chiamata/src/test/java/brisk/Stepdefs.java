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
        lobby = new Lobby(RandomUtils.nextInt(1,10));
    }

    @Given("^at least one has four player waiting$")
    public void at_least_one_has_four_player_waiting() throws Throwable {
        Table table = lobby.randomTable().get();
        while (!table.isFull()) {
            table.playerJoin(new Player());
        }
        table.playerLeave(0);
    }

    @When("^Sean choose a table with four player waiting$")
    public void sean_choose_a_table_with_four_player_waiting() throws Throwable {
        choosenTable = lobby.randomTable().get();
        while (choosenTable.playerCount() != 4) {
            choosenTable = lobby.randomTable().get();
        }
        choosenTable.playerJoin(new Player());
    }

    @Then("^the match starts$")
    public void the_match_starts() throws Throwable {
        assertEquals(choosenTable.getStatus(), Table.STATUS.STARTING);
    }
}
