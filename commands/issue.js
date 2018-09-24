exports.run = (client, message, args) => {
    const https = require('https');

    var options = {
        host: "typo3.org",
        path: "https://forge.typo3.org/issues/" + encodeURIComponent(args[0]) + ".json",
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
            } catch (e) {
                message.channel.send(message.author.toString() + ' sorry, I could not find that issue.');
                return;
            }
            var issue = arr.issue;

            message.channel.send({
                embed: {
                    color: client.config.colour,
                    title: issue.subject,
                    url: 'https://forge.typo3.org/issues/' + issue.id + '/',
                    author: {
                        name: 'TYPO3 Forge',
                    },
                    fields: [
                        {
                            name: 'Project',
                            value: issue.project.name,
                            inline: true
                        },
                        {
                            name: 'Type',
                            value: issue.tracker.name,
                            inline: true
                        },
                        {
                            name: 'Status',
                            value: issue.status.name,
                            inline: true
                        }
                    ],
                    timestamp: Date.parse(issue.created_on),
                    footer: {
                        text: "Via forge.typo3.org",
                        icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
                    }
                }
            });
        });
    })
};