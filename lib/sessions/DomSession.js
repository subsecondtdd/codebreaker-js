const eventually = require("./eventually");

module.exports = class DomSession {
  constructor({ webAppDomRenderer }) {
    this._webAppDomRenderer = webAppDomRenderer;
  }

  async startSession() {
    await this._ensureElement();
    await this._webAppDomRenderer.renderWebAppInElement({
      element: this._element,
      path: "/"
    });
  }

  async openLink(href) {
    await this._ensureElement();
    await this._webAppDomRenderer.renderWebAppInElement({
      element: this._element,
      path: href
    });
  }

  async _ensureElement() {
    if (this._element) {
      return;
    }
    this._element = document.createElement("div");
    this._element.style.border = "1px solid green";
    this._element.style.margin = "5px";
    this._element.style.padding = "5px";
    document.body.appendChild(this._element);
  }

  async dispatchCommand({ action, params }) {
    const forms = [].slice
      .apply(this._element.querySelectorAll("form"))
      .filter(form => form.getAttribute("data-action") === action);
    if (forms.length !== 1) {
      throw new Error(
        `Found ${forms.length} forms with data-action="${action}"`
      );
    }
    const form = forms[0];
    Object.keys(params).forEach(param => {
      const inputs = form.querySelectorAll(`input[name="${param}"]`);
      if (inputs.length !== 1) {
        throw new Error(`Found ${inputs.length} inputs for param '${param}'`);
      }
      const input = inputs[0];
      const value = params[param];
      if (input.type === "checkbox") {
        input.checked = value;
      } else if (input.type === "text") {
        input.value = value;
      } else {
        throw new Error(`Unable to set input with type="${input.type}"`);
      }
    });
    const submits = form.querySelectorAll('input[type="submit"]');
    if (submits.length !== 1) {
      throw new Error(`Found ${submits.length} submit elements`);
    }
    const submit = submits[0];

    const renderCount = () => this._element.getAttribute("data-render-count");
    const renderCountBeforeClicking = renderCount();
    submit.click();
    await eventually(async () => {
      if (renderCountBeforeClicking === renderCount()) {
        throw new Error("Expected data-render-count to change");
      }
    });
  }

  describeView() {
    const elements = this._element.querySelectorAll("[data-view-description]");
    if (elements.length === 1) {
      return elements[0].getAttribute("data-view-description");
    } else if (elements.length === 0) {
      return null;
    }
    throw new Error(
      `Found ${elements.length} elements with [data-view-description]`
    );
  }

  getVisibleLink({ action }) {
    const selector = `a[data-action="${action}"]`;
    const elements = this._element.querySelectorAll(selector);
    if (elements.length === 1) {
      return elements[0].getAttribute("href");
    }
    throw new Error(
      `Found ${elements.length} elements with selector ${selector}`
    );
  }

  getVisibleData(key) {
    function descendToAttribute(scope, attribute) {
      return [].slice.apply(scope.children).reduce(function(props, child) {
        return props.concat(
          child.hasAttribute(attribute)
            ? [child]
            : descendToAttribute(child, attribute)
        );
      }, []);
    }

    function scopesUnder(scope) {
      return descendToAttribute(scope, "itemscope");
    }

    function propsUnder(scope) {
      return descendToAttribute(scope, "itemprop");
    }

    function dataAtScope(scope) {
      return propsUnder(scope).reduce(function(props, element) {
        props[element.getAttribute("itemprop")] = dataInPropElement(element);
        return props;
      }, {});
    }

    function dataInPropElement(element) {
      const type = element.getAttribute("itemtype");
      switch (type) {
        case "http://schema.org/Text":
          return element.innerHTML;
        case "http://schema.org/Integer":
          return Number(element.innerHTML);
        case "http://schema.org/Boolean":
          return Boolean(element.innerHTML);
        case "http://schema.org/ItemList":
          return scopesUnder(element).map(dataAtScope);
        default:
          throw new Error(`Unable to parse element with itemtype '${type}'`);
      }
    }
    const scope = scopesUnder(this._element)[0];
    if (!scope)
      throw new Error(
        `Found no itemscope under element: ${this._element.innerHTML}`
      );
    const data = dataAtScope(scope);
    return data[key];
  }
};
