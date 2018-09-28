exports.run = (client, message, args) => {
    const https = require('https');

    var options = {
        host: "get.typo3.org",
        path: "https://get.typo3.org/json",
    };

    var interim = '';

    https.get(options, function (res) {
        res.on('data', (chunk) => {
            interim += chunk;
        });
        res.on('end', () => {

            var t3versions = JSON.parse(interim);

            message.channel.send({
                embed: {
                    color: client.config.colour,
                    title: 'The latest supported TYPO3 releases',
                    url: 'https://get.typo3.org/',
                    fields: [
                        {
                            name: 'Latest Stable',
                            value: t3versions.latest_stable,
                            inline: true
                        },
                        {
                            name: 'Latest LTS',
                            value: t3versions.latest_lts,
                            inline: true
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Via typo3.org",
                        icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
                    }
                }
            });
        });
    })
};