exports.run = (client, message, args) => {
    if (message.channel.id != client.config.generalChannelGmbh) {
        return;
    }
    if (!message.member.roles.has(client.config.roleGmbh)) {
        return;
    }

    client.con.query("UPDATE statistics SET value = '0' WHERE identifier = 'daysSinceGmbhLoginCredentialsCall'", function (err, rows, fields) {
        message.channel.send('Oh no! Someone called for backend login credentails! It has been 0 days since the last call for backend login credentials.');
    });
};