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

  @wip
  Scenario: Breaker guesses a word
    Given the Breaker has joined the Maker's game
    When the Breaker makes a guess
    Then the Maker is asked to score

  Scenario: Maker scores a guess
    Given the Breaker has made the first guess
    When the Maker scores 2
    Then the Breaker sees the score 2

  # Guess must have length of secret word

  Scenario: Breaker guesses incorrect length
    Given the Maker has started with the word "pints"
    When the Breaker guesses "pant"
    Then the Breaker must guess another word

  Scenario: Breaker guesses correct length
    Given the Maker has started with the word "smart"
    When the Breaker guesses "pants"
    Then the guess is submitted

  # Finishing

  Scenario: Breaker guesses correct word
    Given the maker has started with the word "steak"
    When the Breaker guesses "steak"
    Then the game is over

  Scenario: Breaker guesses incorrect word
    Given the maker has started with the word "steak"
    When the Breaker guesses "stake"
    Then the Breaker sees the score 5
    But the game is not over
