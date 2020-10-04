const fs = require('fs');
const db = require('diskdb');

// nuke will nuke all the json files in the data directory
let nuke = fs.promises.readdir('./data')
            .then(async (filesInTheDataDir) => {
                if (filesInTheDataDir) {
                    db.connect('./data', filesInTheDataDir);
                    for await (let file of filesInTheDataDir) {
                        db[`${file.split('.')[0]}`].remove();
                    }
                }
            });

let backedUpFiles = async () => {
    await nuke;
    const files = await fs.promises.readdir('./backup');
    const fMap = files.map(e => e.split('.')[0]); // will return an array of files without the .json ex: [ users, pictures ]
    for (let file of  files) {
        await fs.promises.copyFile(`./backup/${file}`, `./data/${file}`);
    }
};

// comment out backedUpFiles, if you don't want to restore from the backed up files directory
backedUpFiles();

module.exports = { backedUpFiles };
