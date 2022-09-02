const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../samples');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        console.log(`removing ${file}...`); 
        let dirPath = path.join(directoryPath, file);
        fs.rm(dirPath, { recursive: true, force: true }, ()=> {
            console.log('... done');
        });
    });
});