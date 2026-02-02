const fs = require('fs');
try {
    const data = fs.readFileSync('server_error_v4.log', 'utf16le');
    const lines = data.split('\n');
    const errorLine = lines.find(l => l.includes('MODULE_NOT_FOUND'));
    if (errorLine) {
        console.log('FOUND ERROR:', errorLine.trim());
        const index = lines.indexOf(errorLine);
        console.log('SURROUNDING LINES:');
        console.log(lines.slice(Math.max(0, index - 10), index + 10).join('\n'));
    } else {
        console.log('No "MODULE_NOT_FOUND" error found. Full content tail:');
        console.log(lines.slice(-50).join('\n'));
    }
} catch (e) {
    console.error(e);
}
