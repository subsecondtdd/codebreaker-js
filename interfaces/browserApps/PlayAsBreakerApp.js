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

  generateLinkHref(link) {
    // TODO: use a router of some sort
    switch (link.action) {
      default:
        throw new Error(`Unable to generate link for ${JSON.stringify(link)}`);
    }
  }
};
