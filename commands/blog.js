exports.run = (client, message, args) => {

    if (args[0] === 'typo3.com') {
        var q = "SELECT * FROM typo3_blogs WHERE source = 'typo3.com' ORDER BY created_at DESC LIMIT 1";
    } else if (args[0] === 'typo3.org') {
        var q = "SELECT * FROM typo3_blogs WHERE source = 'typo3.org' ORDER BY created_at DESC LIMIT 1";
    }  else {
        var q = "SELECT * FROM typo3_blogs ORDER BY created_at DESC LIMIT 1";
    }

    client.con.query(q,  function (err, rows, fields) {
        if (rows.length === 0) {
            message.channel.send(message.author.toString() + " sorry, I couldn't find a blog for you.");
            return;
        }
        for (var i = 0; i < rows.length; i++) {
            message.channel.send({
                embed: {
                    color: client.config.colour,
                    title: rows[i].title,
                    url: rows[i].url,
                    description: rows[i].description,
                    author: {
                        name: 'TYPO3',
                    },
                    image: {
                        url: rows[i].image
                    },
                    timestamp: Date.parse(rows[i].created_at),
                    footer: {
                        text: "Via " + rows[i].source,
                        icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
                    }
                }
            });
        }
    });
};