Feature: Tables

  Scenario: Sean join a table
    Given: Some tables
    And at least one has four player waiting
    When Sean choose a table with four player waiting
    Then the match starts