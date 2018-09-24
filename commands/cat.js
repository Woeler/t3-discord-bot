exports.run = (client, message, args) => {
    const https = require('https');

    var options = {
        host: "aws.random.cat",
        path: "https://aws.random.cat/meow",
    };

    var interim = '';

    https.get(options, function (res) {
        res.on('data', (chunk) => {
            interim += chunk;
        });
        res.on('end', () => {
            try {
                var cat = JSON.parse(interim);
            } catch (e) {
                return;
            }

            message.channel.send({
                embed: {
                    color: client.config.colour,
                    title: 'Awwwww',
                    image: {
                        url: cat.file
                    },
                    timestamp: new Date(),
                    footer: {
                        text: "Via TYPO3 Bot",
                        icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
                    }
                }
            });
        });
    })
};