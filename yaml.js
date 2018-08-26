const YAML = require('yamljs');

const comment = `
/*
* @api [get] /pet/{petId}
* description: "Returns all pets from the system that the user has access to"
* parameters:
*   - (path) petId=2* {Integer} The pet ID
*   - (query) limit {Integer:int32} The number of resources to return
* responses:
*   200:
*     $ref: 'hmm'
*/`;

const decomment = comment.replace(/(^\s*\*)|(^\s*\/\*)|(\s*\*\/)/gm, '');

const nativeObject = YAML.parse(decomment.replace(/.*@.*/, ''));

console.log(JSON.stringify(nativeObject, null, '    '));
