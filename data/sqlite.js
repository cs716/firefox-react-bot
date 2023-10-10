const sqlite3 = require('sqlite3').verbose();
const sql = new sqlite3.Database('./data.db');

function createTables() {
    sql.run(`
        CREATE TABLE IF NOT EXISTS quotes (
            messageId TEXT NOT NULL,
            userId TEXT NOT NULL,
            guildId TEXT NOT NULL,
            channelId TEXT NOT NULL,
            content TEXT NOT NULL,
            created DATE,
            rating INT(10) DEFAULT 0,
            PRIMARY KEY (messageId)
        )
    `);
}

async function handleMessageReact(message) {
    try {
        sql.run(`
            INSERT INTO quotes (messageId, userId, guildId, channelId, content, created, rating)
            VALUES('${message.id}', '${message.author.id}', '${message.guildId}', '${message.channelId}', ?, ?, 1)
            ON CONFLICT (messageId) DO
            UPDATE SET rating = rating + 1
        `, message.content, message.createdTimestamp);
        await message.react('🦊');
    } catch(error) {
        console.error(error);
        await message.react('😵');
    }
}
async function handleMessageRemove(message) {
    try {
        sql.get(`UPDATE quotes SET rating = rating - 1 WHERE messageId='${message.id}' RETURNING *`, async (err, row) => {
            if (err) {
                console.error(err);
                return;
            }

            if (row) {
                const rating = row["rating"];
                if (rating <= 0) {
                    sql.run(`DELETE FROM quotes WHERE messageId='${message.id}'`);
                    await message.reactions.removeAll();
                }
            }
        });
        
    } catch(error) {
        console.error(error);
        await message.react('😵');
    }
}

function getSavedMessages(userId, page, success) {
    const offset = (page - 1) * 25;
    try {
        sql.all(`SELECT * FROM quotes WHERE userId='${userId}' LIMIT 25 OFFSET ${offset}`, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            success(rows);
        });
    } catch (error) {
        console.error(error);
        return;
    }
}

function getTopFires(invert=false, page=1, success) {
    const offset = (page - 1) * 10;
    try {
        sql.all(`SELECT * FROM quotes ORDER BY rating ${(invert ? "ASC" : "DESC")} LIMIT 10 OFFSET ${offset}`, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            success(rows);
        });
    } catch (error) {
        console.error(error);
        return;
    }
}

function getRandomMessage(userId, success) {
    try {
        let query = `SELECT * FROM quotes ORDER BY RANDOM() LIMIT 1`;
        if (userId !== undefined)
            query = `SELECT * FROM quotes WHERE userId='${userId}' ORDER BY RANDOM() LIMIT 1`;
        sql.get(query, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            success(rows);
        });
    } catch (error) {
        console.error(error);
    }
}

function getLeaderboard(page=1, success) {
    const offset = (page - 1) * 10;
    try {
        sql.all(`SELECT userId, SUM(rating) AS totalRating, COUNT(messageId) AS totalMessages FROM quotes GROUP BY userId ORDER BY totalRating DESC LIMIT 10 OFFSET ${offset}`, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            success(rows);
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createTables,
    handleMessageReact,
    handleMessageRemove,
    getSavedMessages,
    getRandomMessage,
    getTopFires,
    getLeaderboard
}