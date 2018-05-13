module.exports = class PlayAsMakerApp {
  mount({ element, stream }) {
    element.innerHTML = "Loading Play As Maker App";

    const listener = async rendering => {
      element.innerHTML = `Play As Maker App
        (<label data-view-description="${rendering.description}"/>${
        rendering.description
      }</label>)
      <div>Turn 0</div>
      `;
    };

    stream(listener);
  }
};
