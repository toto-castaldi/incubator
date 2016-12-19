Feature: Tables

  Background: 

  Scenario: Player join a table
    Given some tables
    And at least 1 table has 4 player waiting
    When Sean choose a table with 4 player waiting
    Then the match starts on chosen table

  Scenario: Players want to leave from table
    Given some tables
    And at least 1 table has 3 player waiting
    When Sean choose a table with 3 player waiting
    And John choose a table choosen by Sean
    And Sean should want leave from table
    And John should want leave from table
    Then last table choosen by Sean is available
