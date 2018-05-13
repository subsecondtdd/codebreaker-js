"use strict";

module.exports = function eventually(fn) {
  const originalStack = new Error(`Gave up waiting for ${fn.toString()}`).stack;
  let remainingAttempts = 10;
  const interval = 10;
  const attempt = () => new Promise(resolve => resolve(fn())).catch(reattempt);
  function reattempt(error) {
    if (--remainingAttempts <= 0 || error.giveUpNow) {
      error.stack = `${cleanStack(error.stack)}\n${cleanStack(originalStack)}`;
      return Promise.reject(error);
    }
    return new Promise(resolve => setTimeout(resolve, interval)).then(attempt);
  }
  return attempt();
};

function cleanStack(stack) {
  return stack
    .split("\n")
    .filter(line => line.indexOf(__filename) === -1)
    .join("\n");
}
