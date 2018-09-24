exports.run = (client, message, args) => {

    if (message.guild === null) {
        return;
    }

    if (undefined === args[0]) {
        client.con.query("SELECT * FROM beers WHERE user_id = " + client.con.escape(message.author.id), function (err, rows, fields) {
            if (rows.length === 0) {
                message.channel.send(message.author.toString() + " you have a total of 0 beers.");
                return;
            }
            message.channel.send(message.author.toString() + " you have a total of " + rows[0].beer_count + " beers.");
            return;
        });
        return;
    }

    if ('top10' === args[0].toLowerCase()) {
        client.con.query("SELECT * FROM beers ORDER BY beer_count DESC LIMIT 10", function (err, rows, fields) {
            var str = '';
            for (var i = 0; i < rows.length; i++) {
                if (client.users.get(rows[i].user_id) !== undefined) {
                    str += "#" + (i + 1) + ": `" + client.users.get(rows[i].user_id).toString() + "` with " + rows[i].beer_count + " beers.\n";
                }
            }
            message.channel.send(str);
        });
        return;
    }

    var receiver = message.guild.members.get(args[0].replace(/[\\<>@#&!]/g, ""));

    if (undefined === receiver) {
        message.channel.send(message.author.toString() + " sorry, I do not know that user.");
        return;
    }
    if (receiver.id === message.author.id) {
        message.channel.send(message.author.toString() + " you cannot give yourself a beer. Go away!");
        return;
    }

    client.con.query("SELECT * FROM beers WHERE user_id = " + client.con.escape(receiver.id), function (err, rows, fields) {
        if (rows.length === 0) {
            client.con.query("INSERT INTO beers (user_id, beer_count) VALUES (" + client.con.escape(receiver.id) + ", 1)");
            message.channel.send(message.author.toString() + " has given " + receiver.toString() + " a beer! " + receiver.toString() + " now has 1 beer. :beer:");
        } else {
            var count = rows[0].beer_count + 1;
            client.con.query("UPDATE beers SET beer_count = " + count + " WHERE user_id = " + client.con.escape(receiver.id));
            message.channel.send(message.author.toString() + " has given " + receiver.toString() + " a beer! " + receiver.toString() + " now has " + count + " beers. :beer:");
        }
    });
};