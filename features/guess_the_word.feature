Feature: Guess the word

  # Maker starts

  @wip
  Scenario: Maker starts a game
    When the Maker starts a game
    Then the Maker waits for a Breaker to join

  @wip
  Scenario: Breaker joins a game
    Given the Maker has started a game with the word "silky"
    When the Breaker joins the Maker's game
    Then the Breaker must guess a word with 5 characters

  # Turn based

  Scenario: Breaker guesses a word
    Given the Maker has chosen a word
    When the Breaker makes a guess
    Then the Maker is asked to score

  Scenario: Maker scores a guess
    Given the Breaker has made a guess
    When the Maker scores 2
    Then the Breaker sees the score 2

  # Guess must have length of secret word

  Scenario: Breaker guesses incorrect length
    Given the Maker has chosen "pints"
    When the Breaker guesses "pant"
    Then the Breaker must guess another word

  Scenario: Breaker guesses correct length
    Given the Maker has chosen "smart"
    When the Breaker guesses "pants"
    Then the guess is submitted

  # Finishing

  Scenario: Breaker guesses correct word
    Given the maker has chosen "steak"
    When the Breaker guesses "steak"
    Then the game is over

  Scenario: Breaker guesses incorrect word
    Given the maker has chosen "steak"
    When the Breaker guesses "stake"
    Then the Breaker sees the score 5
    But the game is not over
