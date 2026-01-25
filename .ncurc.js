/** @type {import('npm-check-updates').RcOptions } */

module.exports = {
  upgrade: true,
  interactive: true,
  format: "group",
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  cooldown: packageName => (packageName.startsWith("@medrunner") ? 0 : 2),
  /**
     @param name - The name of the dependency.
     @param defaultGroup - The predefined group name which will be used by default.
     @param currentSpec - The current version range in your package.json.
     @param upgradedSpec - The upgraded version range that will be written to your package.json.
     @param upgradedVersion - The upgraded version number returned by the registry.
     @returns - A predefined group name ('major' | 'minor' | 'patch' | 'majorVersionZero' | 'none') or a custom string to create your own group.
     */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
  groupFunction: (name, defaultGroup, currentSpec, upgradedSpec, upgradedVersion) => {
    if (name.startsWith("@medrunner")) {
      return "Medrunner Packages";
    }
    return defaultGroup;
  },
  /**
      Upgrade major version zero to the next minor version, and everything else to latest.
     @param name - The name of the dependency.
     @param semver - A parsed Semver object of the upgraded version.
      (See: https://git.coolaj86.com/coolaj86/semver-utils.js#semverutils-parse-semverstring)
     @returns - One of the valid target values (specified in the table above).
     */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type
  target: (name, semver) => {
    if (name.startsWith("@medrunner")) return "@beta";
    if (name === "@types/node") return "minor";
    return "latest";
  },
};
