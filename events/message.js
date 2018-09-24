module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    if (null !== message.content.match(/http[s]*:\/\/review.typo3.org\/[#\/c]*([\d]*)(?:.*)/i)) {
        var args = [];

        let result = message.content.match(/http[s]*:\/\/review.typo3.org\/[#\/c]*([\d]*)(?:.*)/i);

        var command = 'review';
        args[0] = result[1];
    } else if (null !== message.content.match(/http[s]*:\/\/forge.typo3.org\/issues\/([\d]*)(?:.*)/i)) {
        var args = [];

        let result = message.content.match(/http[s]*:\/\/forge.typo3.org\/issues\/([\d]*)(?:.*)/i);

        var command = 'issue';
        args[0] = result[1];
    } else if (message.content.indexOf(client.config.prefix) !== 0) {
        return;
    } else {
        // Our standard argument/command name definition.
        var args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        var command = args.shift().toLowerCase();
    }


    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;

    // Run the command
    cmd.run(client, message, args);
};