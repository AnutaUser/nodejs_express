const fs = require('node:fs/promises');
const path = require('node:path');

const DBPath = path.join(process.cwd(), 'dataBase', 'usersDB.json');

module.exports = {
    reader: async () => {
        const buffer = await fs.readFile(DBPath);
        const json = buffer.toString();
        return json ? JSON.parse(json) : [];
    },

    writer: async (users) => {
        await fs.writeFile(DBPath, JSON.stringify(users));
    }
};
