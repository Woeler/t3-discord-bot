exports.run = (client, message, args) => {
    const https = require('https');

    var options = {
        host: "geek-jokes.sameerkumar.website",
        path: "https://geek-jokes.sameerkumar.website/api",
    };

    var interim = '';

    https.get(options, function (res) {
        res.on('data', (chunk) => {
            interim += chunk;
        });
        res.on('end', () => {

            message.channel.send({
                embed: {
                    color: client.config.colour,
                    title: 'composer require organic-abilities/humour',
                    description: unescape(interim),
                    timestamp: new Date(),
                    footer: {
                        text: "Via GeekJokes API",
                        icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
                    }
                }
            });
        });
    })
};