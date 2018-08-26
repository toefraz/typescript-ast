import * as _ from 'lodash';
import * as ts from 'typescript';

const comment = `
 * @api [get] /pet/{petId}
 * description: "Returns all pets from the system that the user has access to"
 * parameters:
 *   - (path) petId=2* {Integer} The pet ID
 *   - (query) limit {Integer:int32} The number of resources to return
 * responses:
 *   200:
 *     description: It works!
 `;

function mapProperty(key: string, value: any, required: boolean = true) {
    let type = undefined;

    if (_.isString(value)) {
        type = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    } else if (_.isNumber(value)) {
        type = ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    } else {
        type = ts.createTypeReferenceNode('BigInteger', undefined);
    }

    return ts.createPropertySignature(
        undefined,
        key,
        required ? undefined : ts.createToken(ts.SyntaxKind.QuestionToken),
        type,
        undefined
    );
}

function createResponseInterface() {
    const obj = {
        count: 1,
        blah: 'lol',
        num: true
    };

    const members = _.toPairs(obj).map((prop) => mapProperty(...prop));
    const members2 = _.toPairs(obj).map((prop) => mapProperty(...prop));
    members.push(
        ts.createPropertySignature(undefined, 'next', undefined, ts.createTypeLiteralNode(members2), undefined)
    );

    const responseInterface = ts.createInterfaceDeclaration(
        undefined,
        undefined,
        'RPCResponse',
        undefined,
        undefined,
        members
    );

    ts.addSyntheticLeadingComment(responseInterface, ts.SyntaxKind.MultiLineCommentTrivia, comment, true);

    return responseInterface;
}

function main(): string {
    const nodes = [createResponseInterface(), createResponseInterface()];

    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });

    const result = nodes.map((node) => printer.printNode(ts.EmitHint.Unspecified, node, undefined));

    return result.join('\n\n');
}

console.log(main());
