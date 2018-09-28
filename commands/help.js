exports.run = (client, message, args) => {
    message.channel.send({
        content: message.author.toString() + " here is some useful information.",
        embed: {
            color: client.config.colour,
            title: 'TYPO3 Bot Help',
            description: '[Click here to go to the documentation](https://woeler.github.io/t3-discord-bot/)',
            fields: [
                {
                    name: '!beer [user mention]',
                    value: "Has someone been helpful to you? Give them a beer!"
                },
                {
                    name: '!blog',
                    value: "Fetch the latest blog. You can use `!blog typo3.com` or `!blog typo3.org` to filter by source."
                },
                {
                    name: '!certification',
                    value: "Returns information about TYPO3 certifications."
                },
                {
                    name: '!issue [issue number]',
                    value: "Shows issue information from forge. Pasting a forge link will also trigger this command."
                },
                {
                    name: '!review [review number]',
                    value: "Shows review information from gerrit. Pasting a gerrit link will also trigger this command."
                },
                {
                    name: '!cat',
                    value: "Posts a random cute cat picture."
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "Via TYPO3 Bot",
                icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
            }
        }
    });
};