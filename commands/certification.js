exports.run = (client, message, args) => {
    message.channel.send({
        embed: {
            color: client.config.colour,
            title: 'TYPO3 Certifications',
            url: 'https://typo3.org/certification/',
            author: {
                name: 'TYPO3',
            },
            thumbnail: {
                url: 'https://webberry.ua/fileadmin/_processed_/0/e/csm_t3certification_1bb6d468cb.png'
            },
            fields: [
                {
                    name: 'TYPO3 Certified Editor',
                    value: "[Click for more information](https://typo3.org/certification/editor/)"
                },
                {
                    name: 'TYPO3 Certified Integrator',
                    value: "[Click for more information](https://typo3.org/certification/integrator/)"
                },
                {
                    name: 'TYPO3 Certified Developer',
                    value: "[Click for more information](https://typo3.org/certification/developer/)"
                },
                {
                    name: 'TYPO3 Certified Consultant',
                    value: "[Click for more information](https://typo3.org/certification/consultant/)"
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "Via typo3.org",
                icon_url: "https://www.typo3-shop.com/media/catalog/product/cache/1/image/9a986cddb224ee483b801398de45533b/placeholder/default/typo3-watermark_1.png"
            }
        }
    });
};