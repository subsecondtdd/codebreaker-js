const sessions = [require("./DirectSession"), require("./DomSession")];

exports.registerIn = container =>
  sessions.forEach(Constructor =>
    container.register({
      role: "session",
      Constructor
    })
  );
