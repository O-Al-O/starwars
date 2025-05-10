Feature: [Fusionados] Merge Character and Planet data

  Scenario: Fetch data successfully
    Given character with "1" as ID exists
    When GET request is made upon /fusionados?id=1
    Then response status code must be 200
    And response body property 'characterName' must contain 'Luke Skywalker'
