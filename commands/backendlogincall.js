exports.run = (client, message, args) => {
    if (message.channel.id != client.config.generalChannelGmbh) {
        return;
    }
    if (!message.member.roles.has(client.config.roleGmbh)) {
        return;
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

    con.query("UPDATE statistics SET value = '0' WHERE identifier = 'daysSinceGmbhLoginCredentialsCall'", function (err, rows, fields) {
        message.channel.send('Oh no! Someone called for backend login credentails! It has been 0 days since the last call for backend login credentials.');
        con.end();
    });
};