const fs = require('fs');
const yaml = require('js-yaml');

try {
  console.log('opening up files now')
  const fileContents = fs.readFileSync('./sample.yaml', 'utf8');
  console.log(fileContents)
  const data = yaml.load(fileContents);
  console.log(data);
} catch (e) {
  console.error(e);
}
