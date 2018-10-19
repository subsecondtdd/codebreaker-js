/**
 * VersionWatchers are used to synchronize multiple agents, waiting until they all have the same version number.
 */
module.exports = class VersionWatcher {
  constructor(subject, sub) {
    if (!sub) throw new Error("No sub")
    if (typeof sub.subscribe !== 'function') throw new Error(`No #subscribe for ${sub}`)
    this._subject = subject
    this._sub = sub
  }

  /**
   * Wait for several version watchers to synchronize
   *
   * @param versionWatchers the watchers to wait for
   * @param timeout how long to wait (defaults to 500ms)
   * @returns {Promise<void>}
   */
  static synchronized(versionWatchers, timeout=1000) {
    if (versionWatchers.length === 0) {
      throw new Error("No versions to synchronize")
    }
    const versions = versionWatchers.map(versionWatcher => {
      const version = versionWatcher.getVersion();
      if (typeof version !== 'number' || isNaN(version)) throw new Error(`Not a version number: ${expectedVersion}`)
      return version
    });
    const maxVersion = Math.max(...versions)
    return Promise.all(
      versionWatchers.map(versionWatcher => versionWatcher.waitForVersion(maxVersion, timeout))
    )
  }

  getVersion() {
    return this._subject.getVersion()
  }

  async waitForVersion(expectedVersion, timeout) {
    const synchronized = new Promise((resolve, reject) => {
      if (this.getVersion() === expectedVersion) {
        return resolve()
      }
      this._sub.subscribe('version', version => {
        if (version === expectedVersion) resolve()
      }).catch(reject)
    })
    const timedOut = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Timed out waiting for ${this._subject.constructor.name} to get version ${expectedVersion}. Current version: ${this.getVersion()}`))
      }, timeout)
    })
    return Promise.race([synchronized, timedOut])
  }
}
