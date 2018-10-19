Feature: Codebreaker

  # Rule: A game starts when the first person joins

  Scenario: Breaker joins Maker's 5 letter game
    Given Molly has started a game with the word "steak"
    When Benny joins Molly's game
    Then Benny must guess a word with 5 letters

  Scenario: Breaker joins Maker's 3 letter game
    Given Molly has started a game with the word "bun"
    When Benny joins Molly's game
    Then Benny must guess a word with 3 letters






























  # Rules to add later:
  # Rule: A player must pick a unique name
  # Rule: A player can only play one game at a time
  # Rule: A game can only be joined by one player
  # Rule: A player can't join their own game

  # New Rules: Watch a game someone else is playing

  # Maker starts

#  Scenario: Maker starts a game
#    When the Maker starts a game
#    Then the Maker waits for a Breaker to join
#
#  Scenario: Breaker joins a game
#    Given the Maker has started a game with the word "silky"
#    When the Breaker joins a game
#    Then the Breaker must guess a word with 5 letters
#
#  # Turn based
#
#  Scenario: Breaker guesses a word
#    Given the Breaker has joined the Maker's game
#    When the Breaker makes a guess
#    Then the Maker is asked to score the guess
#
#  Scenario: Maker scores a guess
#    Given the Breaker has made the first guess in the Maker's game
#    When the Maker scores 3
#    Then the Breaker sees the score 3
#
#  # Guess must have length of secret word
#
#  Scenario: Breaker guesses incorrect length
#    Given the Breaker has joined the Maker's game
#    When the Breaker guesses "pant"
#    Then the Breaker is told "Guess must have 5 letters"
#    And the Breaker's guess is not submitted
#
#  # Finishing
#
#  Scenario: Breaker guesses correct word
#    Given the Breaker has joined the Maker's game
#    And the Breaker has guessed "steak"
#    When the Maker scores the guess as correct
#    Then the Breaker sees that the game is over
