const {handleMessageReact, handleMessageRemove} = require('../data/sqlite.js');

module.exports["AddReaction"] = async (reaction, user) => {
    if (reaction.emoji.name != '🔥')
        return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            return;
        }
    }

    const author = reaction.message.author; 
    if (user.id == author.id)
        return;

    await handleMessageReact(reaction.message);
}

module.exports["RemoveReaction"] = async (reaction, user) => {
    if (reaction.emoji.name != '🔥')
        return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            return;
        }
    }

    const author = reaction.message.author; 
    if (user.id == author.id)
        return;

    await handleMessageRemove(reaction.message);
}