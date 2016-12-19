package brisk;

import com.google.common.collect.Iterables;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;

import static org.junit.Assert.assertEquals;

/**
 * Created by root on 12/14/16.
 */
public class Stepdefs {


    private Lobby lobby;
    private Table choosenTable;

    public Stepdefs () {
        lobby = new Lobby();
    }

    @Given("^some tables$")
    public void createTables() throws Throwable {
        for (int i = 0; i < RandomUtils.nextInt(1,10); i++) {
            lobby.addTable(new Table());
        }
    }

    @Given("^at least (\\d+) table has (\\d+) player waiting$")
    public void tablesWithFourPlayers(int tables, int playerCount) throws Throwable {
        for (int i = 0; i < tables; i++) {
            Table table = lobby.addTable(new Table());
            while (table.playerCount() < playerCount) {
                table.playerJoin(Player.create(RandomStringUtils.randomAlphabetic(5)));
            }
        }
    }

    @When("^(\\w+) choose a table with (\\d+) player waiting$")
    public void chooseATable(String playerName, int playerCount) throws Throwable {
        choosenTable = lobby.randomTable().get();
        while (choosenTable.playerCount() != playerCount) {
            choosenTable = lobby.randomTable().get();
        }
        choosenTable.playerJoin(Player.create(playerName));
    }

    @Then("^the match starts on chosen table$")
    public void the_match_starts() throws Throwable {
        assertEquals(choosenTable.getStatus(), Table.STATUS.STARTING);
    }

    @Then("^last table choosen by (\\w+) is available$")
    public void lastTbleChoosenIsAvailable(String playerName) throws Throwable {
        Player player = Player.create(playerName);
        Table table = player.lastTable().get();
        assertEquals(table.getStatus(), Table.STATUS.WAITING_FOR_PLAYERS);
    }

    @When("^(\\w+) choose a table choosen by (\\w+)$")
    public void playerChooseATableOfOtherPlayer(String newPlayer, String oldPlayer) throws Throwable {
        Table tableChoosen = Iterables.tryFind(lobby.getTables(), Table.withPlayer(Player.create(oldPlayer))).get();
        tableChoosen.playerJoin(Player.create(newPlayer));
    }

    @When("^(\\w+) should want leave from table$")
    public void playerShouldWantLeaveFromTable(String playerName) throws Throwable {
        Player player = Player.findByName(playerName).or(Player.create(playerName));
        Table tableChoosen = Iterables.tryFind(lobby.getTables(), Table.withPlayer(player)).get();
        tableChoosen.playerShouldLeave(player);
    }

}
