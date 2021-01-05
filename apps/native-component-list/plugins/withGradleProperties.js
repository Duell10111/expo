const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');

// Use this improve gradle builds
module.exports = (config, options) => {
  assert(options, 'gradle.properties must be defined');
  return withDangerousMod(config, [
    'android',
    async config => {
      const filePath = path.join(config.modRequest.projectRoot, 'android', 'gradle.properties');
      let contents = await fs.readFile(filePath, 'utf-8');
      let results = [];
      const lines = contents.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#')) {
          const eok = line.indexOf('=');
          const keyName = line.slice(0, eok);
          let value;
          if (keyName in options) {
            value = options[keyName];
          } else {
            value = line.slice(eok + 1, line.length);
          }
          results.push(`${keyName}=${value}`);
        } else {
          results.push(line);
        }
      }
      await fs.writeFile(filePath, results.join('\n'));
      return config;
    },
  ]);
};
