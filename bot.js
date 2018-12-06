process.env.TZ = 'UTC';

const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const mysql = require("mysql");
const Parser = require('rss-parser');
const ogs = require('open-graph-scraper');
const CronJob = require('cron').CronJob;

const client = new Discord.Client();
const config = require("./config.json");

const typo3ServerId = config.serverId;
const generalChannel = config.generalChannel;
const stackOverflowChannel = config.stackOverflowChannel;

client.login(config.token);
client.config = config;

const mysqlConfig = {
    "host": "localhost",
    "database": client.config.db,
    "user": client.config.db_user,
    "password": client.config.db_pass,
    "multipleStatements": true
};

client.on("ready", () => {
    client.user.setActivity('Install Tool');
    console.log('Bot ready!');
});

client.on("guildMemberAdd", (member) => {
    client.channels.get(generalChannel).send('Welcome to the TYPO3 Discord ' + member.toString());
});

fs.readdir("./events", (err, files) => {
    if (err) return console.error(err);

    files.forEach(file => {
        if (!file.endsWith(".js")) return;

        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];

        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        // Load the command file itself
        let props = require(`./commands/${file}`);
        // Get just the command name from the file name
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        // Here we simply store the whole thing in the command Enmap. We're not running it right now.
        client.commands.set(commandName, props);
    });
});

function fetchRssFeed(url, source, boot = false) {
    let parser = new Parser();
    (async () => {
        let feed = await parser.parseURL(url);

        feed.items.forEach(item => {
            const con = mysql.createConnection(mysqlConfig);
            con.query("SELECT * FROM typo3_blogs WHERE title = " + mysql.escape(item.title) + " AND source = '" + source + "'", function (err, rows, fields) {
                if (err) throw err;
                con.end();
                if (rows.length === 0) {
                    var arr = item.link.split('?');
                    arr = arr.map(function (val) {
                        return val;
                    });

                    var options = {'url': arr[0], 'timeout': 10000};

                    ogs(options, function (error, results) {
                        if (error) {
                            return;
                        }
                        var imageUrl = results.data.ogImage.url;
                        if (undefined === imageUrl) {
                            imageUrl = '';
                        }
                        var description = results.data.ogDescription;
                        if (undefined === description) {
                            description = '';
                        }
                        const con = mysql.createConnection(mysqlConfig);
                        con.query("INSERT INTO typo3_blogs (title, url, image, description, created_at, source) VALUES (" + mysql.escape(item.title) + ", '" + arr[0] + "', '" + imageUrl + "', " + mysql.escape(description) + ", '" + item.isoDate + "', '" + source + "')", function (err, rows, fields) {
                            if (err) throw err;
                            con.end();
                        });
                    });

                }
            });

        });
        con.end();
    })();
}

function fetchStackOverflow() {
    let parser = new Parser();
    var now = new Date();
    var latestPost = new Date();
    (async () => {
        let feed = await parser.parseURL('https://stackoverflow.com/feeds/tag/typo3');

        const con = mysql.createConnection(mysqlConfig);
        con.query("SELECT * FROM schedule_last_run WHERE name = 'stackoverflow' LIMIT 1", function (err, rows, fields) {
            con.end();
            var lastRun = new Date(Date.parse(rows[0].last_run));
            latestPost = lastRun;
            feed.items.forEach(item => {
                if (err) throw err;
                if (rows.length === 1) {
                    var itemDate = new Date(Date.parse(item.pubDate));
                    if (itemDate > lastRun) {
                        client.channels.get(stackOverflowChannel).send({
                            embed: {
                                color: client.config.colour,
                                title: item.title,
                                description: 'A new question was posted with the tag TYPO3 on Stackoverflow by user ' + item.author + '.',
                                url: item.link,
                                author: {
                                    name: 'Stack Overflow',
                                },
                                thumbnail: {
                                    url: 'https://i.stack.imgur.com/TsGSQ.png',
                                },
                                timestamp: itemDate,
                                footer: {
                                    text: "Via stackoverflow.com",
                                    icon_url: "https://i.stack.imgur.com/TsGSQ.png"
                                }
                            }
                        });
                        if (itemDate > latestPost) {
                            latestPost = itemDate;
                            const con = mysql.createConnection(mysqlConfig);
                            con.query("UPDATE schedule_last_run SET last_run = '" + itemDate.toISOString() + "' WHERE name = 'stackoverflow'", function (err, rows, fields) {
                                con.end();
                            });
                        }
                    }

                }

            });
        });
    })();
}

function setMemberRoles(member, roles) {
    var guild = client.guilds.get(typo3ServerId);
    for (var i = 0; i < roles.length; i++) {
        var role = guild.roles.get(roles[i]);
        member.addRole(role).catch(console.error);
        guild.roles.forEach(serverRole => {
            if (!roles.contains(serverRole.id)) {
                member.removeRole(serverRole);
            }
        })
    }
}

/*--------------------------*/
/**
 * SCHEDULED JOBS
 */
/*--------------------------*/

/**
 * Send the GmbH a reminder about the Daily
 */
const m = new CronJob({
    cronTime: '00 59 9 * * 1-5',
    onTick: function () {
        client.channels.get(config.generalChannelGmbh).send('@everyone It\'s daily time!');
    },
    start: true,
    timeZone: 'Europe/Berlin'
});

/**
 * Send the GmbH a fun reminder how many days it has been since the last backend credentials phone call
 */
const n = new CronJob({
    cronTime: '00 30 8 * * 1-5',
    onTick: function () {
        const con = mysql.createConnection(mysqlConfig);
        con.query("SELECT * FROM statistics WHERE identifier = 'daysSinceGmbhLoginCredentialsCall' LIMIT 1", function (err, rows, fields) {
            if ((rows[0].value + 1) === 1) {
                client.channels.get(config.generalChannelGmbh).send('It has been ' + (rows[0].value + 1) + ' day since the last call asking for backend login credentials!');
            } else {
                client.channels.get(config.generalChannelGmbh).send('It has been ' + (rows[0].value + 1) + ' days since the last call asking for backend login credentials!');
            }
            con.query("UPDATE statistics SET value = value + 1 WHERE identifier = 'daysSinceGmbhLoginCredentialsCall'", function (err, rows, fields) {
                con.end();
            });
        });
    },
    start: true,
    timeZone: 'Europe/Berlin'
});

/**
 * Fetch stackoverflow issues every 5 minutes
 */
const o = new CronJob({
    cronTime: '00 */5 * * * *',
    onTick: function () {
        fetchStackOverflow();
    },
    start: true,
    timeZone: 'Europe/Berlin'
});

/**
 * Fetch blogs every 30 minutes
 */
const p = new CronJob({
    cronTime: '00 */30 * * * *',
    onTick: function () {
        fetchRssFeed('https://typo3.org/?type=100', 'typo3.org');
        fetchRssFeed('https://typo3.com/blog/tx_blog_feed/posts/recent/rss/posts.xml', 'typo3.com');
    },
    start: true,
    timeZone: 'Europe/Berlin'
});
