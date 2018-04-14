module.exports = class Assembly {
  chooseRegistration({ role, registrations }) {
    switch (registrations.length) {
      case 1:
        return registrations[0];
      case 0:
        throw new Error(`No registration for role '${role}'`);
      default:
        throw new Error(
          `${registrations.length} registrations for role '${role}'`
        );
    }
  }
};
