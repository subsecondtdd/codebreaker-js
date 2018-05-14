module.exports = class PlayAsMakerApp {
  mount({ element, stream }) {
    element.innerHTML = "Loading Maker App";

    const listener = async rendering => {
      element.innerHTML = `Maker App
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
    // TODO: embed data in microformat
    return `<br />Data: <pre data-role="data">${JSON.stringify(data)}</pre>`;
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
      case "scoreLatestGuess":
        return `<form action="/games/${
          command.params.gameId
        }/scores" data-action="scoreLatestGuess">
          <input type="text" name="points" />
          <input type="checkbox" name="correct" value="1" /> Correct!
          <input type="submit" value="Submit Score" />
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
      case "joinGame":
        return `/games/${link.params.gameId}/breaker`;
        break;
      default:
        throw new Error(`Unable to generate link for ${JSON.stringify(link)}`);
    }
  }
};
