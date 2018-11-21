exports.run = (client, message, args) => {
    const https = require('https');

    var options = {
        host: "typo3.org",
        path: "https://review.typo3.org/changes/?q=" + encodeURIComponent(args[0]),
    };

    var interim = '';

    https.get(options, function (res) {
        res.on('data', (chunk) => {
            interim += chunk;
        });
        res.on('end', () => {
            interim = interim.replace(")]}'", '');
            try {
                var arr = JSON.parse(interim);
                // Extract the title, if the review doesnt exist this will error and trigger the catch
                var title = arr[0].title;
            } catch (e) {
                message.channel.send(message.author.toString() + ' sorry, I could not find that review.');
                return;
            }
            var review = arr[0];
            var description = '';

            const mysql = require('mysql');
            const mysqlConfig = {
                "host": "localhost",
                "database": client.config.db,
                "user": client.config.db_user,
                "password": client.config.db_pass,
                "multipleStatements": true
            };
            var con = mysql.createConnection(mysqlConfig);

            con.query("SELECT * FROM freezes", function (err, rows, fields) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].status === 1) {
                        if (rows[i].name === 'feature' && review.subject.toString().toLocaleLowerCase().includes('[feature]')) {
                            description += 'A ' + rows[i].name + " freeze is currently in effect.\n";
                        } else if (rows[i].name !== 'feature') {
                            description += 'A ' + rows[i].name + " freeze is currently in effect.\n";
                        }
                    }
                }
                con.end();
            });
            if (description !== '') {
                description = "```" + description + "```";
            }
            message.channel.send({
                embed: {
                    color: client.config.colour,
                    title: review.subject,
                    description: description,
                    url: 'https://review.typo3.org/#/c/' + review._number + '/',
                    author: {
                        name: 'TYPO3 Gerrit',
                    },
                    fields: [
                        {
                            name: 'Project',
                            value: review.project,
                            inline: true
                        },
                        {
                            name: 'Branch',
                            value: review.branch,
                            inline: true
                        },
                        {
                            name: 'Status',
                            value: review.status,
                            inline: true
                        }
                    ],
                    timestamp: Date.parse(review.created),
                    footer: {
                        text: "Via review.typo3.org",
                        icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
                    }
                }
            });
        });
    })
};