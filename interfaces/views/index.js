module.exports = {
  waitingForBreakerToJoin: [
    require("./waitingForBreakerToJoin/DomainWaitingForBreakerToJoin")
  ],
  waitingForMakerToStartGame: [
    require("./waitingForMakerToStartGame/DomainWaitingForMakerToStartGame")
  ],
  waitingForInvitation: [
    require("./waitingForInvitation/DomainWaitingForInvitation")
  ],
  waitingForBreakerToGuess: [
    require("./waitingForBreakerToGuess/DomainWaitingForBreakerToGuess")
  ]
};
