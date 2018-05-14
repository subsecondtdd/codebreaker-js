const components = {
  webApp: require("./WebApp"),
  webAppDomRenderer: require("./WebAppDomRenderer")
};

exports.registerIn = container =>
  Object.keys(components).forEach(role =>
    container.register({
      role,
      Constructor: components[role],
      scope: "singleton"
    })
  );
