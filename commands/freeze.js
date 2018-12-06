exports.run = (client, message, args) => {
    var allowed = ['feature', 'merge'];
    var allowedStates = ['true', 'false'];

    if (!message.member.roles.has(client.config.roleCoreTeam)) {
        message.channel.send(message.author.toString() + " you are not a core team member.");
        return;
    }

    if (!allowed.includes(args[0])) {
        message.channel.send(message.author.toString() + " that is an invalid command. You can freeze the following: " + allowed.join(', '));
        return;
    }
    if (!allowedStates.includes(args[1])) {
        message.channel.send(message.author.toString() + " that is an invalid command. You can use the following freeze states: " + allowedStates.join(', '));
        return;
    }

    var type = args[0];
    var state = 0;
    var stateString = 'off';

    if (args[1] === 'true') {
        var state = 1;
        var stateString = 'on';
    }

    const mysql = require('mysql');
    const mysqlConfig = {
        "host": "localhost",
        "database": client.config.db,
        "user": client.config.db_user,
        "password": client.config.db_pass,
        "multipleStatements": true
    };
    var con = mysql.createConnection(mysqlConfig);

    con.query("UPDATE freezes SET status = " + state + " WHERE name = " + client.con.escape(type));
    con.end();

    message.channel.send(message.author.toString() + " you have turned " + stateString + " " + type + " freeze.");
};