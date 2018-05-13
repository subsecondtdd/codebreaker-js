module.exports = class PlayAsBreakerApp {
  mount({ element, stream }) {
    element.innerHTML = "Loading Breaker App";

    const listener = async rendering => {
      element.innerHTML = `Breaker App
        (<label data-view-description="${rendering.description}"/>${
        rendering.description
      }</label>)
      ${this.renderLinks(rendering.links)}
      ${this.renderData(rendering.data)}
      ${this.renderForms(rendering.commands)}
      `;
    };

    stream(listener);
  }

  renderLinks(links) {
    if (!links) return "";
    return (
      "<div>" +
      links
        .map(link => {
          return `<a href="${this.generateLinkHref(link)}" data-action="${
            link.action
          }">${link.action}</a>`;
        })
        .join("<br />") +
      "</div>"
    );
  }

  renderData(data) {
    if (!data) return "";
    return (
      "<span>" +
      Object.keys(data)
        .map(key => {
          return `<span data-key="${key}" data-value="${data[key]}" />`;
        })
        .join("") +
      "</span>"
    );
  }

  renderForms(commands) {
    if (!commands) return "";
    return (
      "<div>" +
      commands
        .map(command => {
          return this.renderForm(command);
        })
        .join("<br />") +
      "</div>"
    );
  }

  renderForm(command) {
    switch (command.action) {
      case "guessWord":
        return `<form action="/games/${
          command.params.gameId
        }/guesses" data-action="guessWord">
          <input type="text" name="guess" />
          <input type="submit" value="Submit Guess" />
        </form>
        `;
      default:
        throw new Error(
          `Unable to render form for command ${JSON.stringify(command)}`
        );
    }
  }

  generateLinkHref(link) {
    // TODO: use a router of some sort
    switch (link.action) {
      default:
        throw new Error(`Unable to generate link for ${JSON.stringify(link)}`);
    }
  }
};
