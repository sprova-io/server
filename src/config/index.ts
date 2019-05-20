import fs from 'fs';
import path from 'path';
const execMode = process.env.NODE_ENV || 'development';

switch (execMode) {
    case 'development':
    case 'production':
    case 'test':
        break;
    default:
        throw new Error('execution mode should be one of the following [development|production|test]');
}

const configFilePath = path.join(__dirname, `../../config/${execMode}.json`);

if (!fs.lstatSync(configFilePath).isFile()) {
    throw new Error(configFilePath + ' config file missing');
}
// tslint:disable-next-line no-var-requires
const config: any = require(configFilePath);

export default config;
