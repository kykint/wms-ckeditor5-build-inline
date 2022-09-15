const fs = require('fs');

const fileName = 'node_modules/hyphens/Resources/Private/Scripts/HyphensEditor/src/plugins/hyphens.js';
const regexp = /evt\.stop\(\);\n/;
const file = fs.readFileSync(fileName, 'utf-8');
if (file.match(regexp)) {
	fs.writeFileSync(fileName, file.replace(regexp, "/*evt.stop();*/\n"));
}
