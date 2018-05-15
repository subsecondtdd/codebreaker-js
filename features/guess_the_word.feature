Feature: Guess the word

  # Maker starts

  Scenario: Maker starts a game
    When the Maker starts a game
    Then the Maker waits for a Breaker to join

  Scenario: Breaker joins a game
    Given the Maker has started a game with the word "silky"
    When the Breaker joins the Maker's game
    Then the Breaker must guess a word with 5 characters

  # Turn based

  Scenario: Breaker guesses a word
    Given the Breaker has joined the Maker's game
    When the Breaker makes a guess
    Then the Maker is asked to score the guess

  Scenario: Maker scores a guess
    Given the Breaker has made the first guess
    When the Maker scores 2
    Then the Breaker sees the score 2

  # Guess must have length of secret word

  Scenario: Breaker guesses incorrect length
    Given the Breaker has joined a game started with the word "pints"
    When the Breaker guesses "pant"
    Then the Breaker's guess is not submitted

  Scenario: Breaker guesses correct length
    Given the Breaker has joined a game started with the word "smart"
    When the Breaker guesses "pants"
    Then the Breaker's guess is submitted

  # Finishing

  Scenario: Breaker guesses correct word
    Given the Breaker has joined a game started with the word "steak"
    When the Breaker guesses "steak"
    And the Maker scores the guess as correct
    Then the Breaker sees that the game is over

  Scenario: Breaker guesses incorrect word
    Given the Breaker has joined a game started with the word "break"
    When the Breaker guesses "brake"
    And the Maker scores the guess as incorrect
    Then the Breaker sees that the game is not over
