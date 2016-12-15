package brisk;

import cucumber.api.PendingException;
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

    @Given("^at least (\\d+) table has (\\d+) player waiting$")
    public void tablesWithFourPlayers(int tables, int players) throws Throwable {
        for (int i = 0; i < tables; i++) {
            Table table = lobby.addTable(new Table());
            while (!table.isFull()) {
                table.playerJoin(new Player());
            }
            for (int j = 0; j < 5 - players; j++) {
                table.playerLeave(0);
            }
        }

    }

    @When("^(\\w+) choose a table with (\\d+) player waiting$")
    public void chooseATable(String playerName, int playerCount) throws Throwable {
        choosenTable = lobby.randomTable().get();
        while (choosenTable.playerCount() != playerCount) {
            choosenTable = lobby.randomTable().get();
        }
        Player player = choosenTable.playerJoin(new Player());
        player.setName(playerName);
    }

    @Then("^the match starts on chosen table$")
    public void the_match_starts() throws Throwable {
        assertEquals(choosenTable.getStatus(), Table.STATUS.STARTING);
    }

    @When("^John choose a table choosen by Sean$")
    public void john_choose_a_table_choosen_by_Sean() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @When("^Sean want leave$")
    public void sean_want_leave() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @When("^John want leave$")
    public void john_want_leave() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

    @Then("^table choosen by Sean is available$")
    public void table_choosen_by_Sean_is_available() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

}
