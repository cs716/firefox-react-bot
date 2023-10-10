function limitMessage(message, maxLength = 256) {
    if (message.length <= maxLength) {
        return message;
    } else {
        return message.slice(0, maxLength - 3) + ' ..';
    }
}

function parseTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp)

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Return the formatted date as a string
    return `${month}/${day}/${year} ${hours}:${minutes}`;
}

module.exports = {
    parseTimestamp,
    limitMessage
}