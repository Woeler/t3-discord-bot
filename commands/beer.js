exports.run = (client, message, args) => {

    if (message.guild === null) {
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

    if (undefined === args[0]) {
        con.query("SELECT * FROM beers WHERE user_id = " + con.escape(message.author.id), function (err, rows, fields) {
            if (rows.length === 0) {
                message.channel.send(message.author.toString() + " you have a total of 0 beers.");
                con.end();
                return;
            }
            message.channel.send(message.author.toString() + " you have a total of " + rows[0].beer_count + " beers.");
            con.end();
        });
        return;
    }

    if ('top10' === args[0].toLowerCase()) {
        con.query("SELECT * FROM beers ORDER BY beer_count DESC LIMIT 10", function (err, rows, fields) {
            var str = '';
            for (var i = 0; i < rows.length; i++) {
                if (client.users.get(rows[i].user_id) !== undefined) {
                    str += "#" + (i + 1) + ": " + client.users.get(rows[i].user_id).tag + " with " + rows[i].beer_count + " beers.\n";
                }
            }
            message.channel.send(str);
            con.end();
        });
        return;
    }

    var receiver = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));

    if (undefined === receiver) {
        message.channel.send(message.author.toString() + " sorry, I do not know that user.");
        con.end();
        return;
    }
    if (receiver.id === message.author.id) {
        message.channel.send(message.author.toString() + " you cannot give yourself a beer. Go away!");
        con.end();
        return;
    }

    con.query("SELECT * FROM beers WHERE user_id = " + con.escape(receiver.id), function (err, rows, fields) {
        if (rows.length === 0) {
            con.query("INSERT INTO beers (user_id, beer_count) VALUES (" + con.escape(receiver.id) + ", 1)");
            message.channel.send(message.author.toString() + " has given " + receiver.toString() + " a beer! " + receiver.toString() + " now has 1 beer. :beer:");
            con.end();
        } else {
            var count = rows[0].beer_count + 1;
            con.query("UPDATE beers SET beer_count = " + count + " WHERE user_id = " + con.escape(receiver.id));
            message.channel.send(message.author.toString() + " has given " + receiver.toString() + " a beer! " + receiver.toString() + " now has " + count + " beers. :beer:");
            con.end();
        }
    });
};