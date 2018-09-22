const Discord = require("discord.js");
const Token = require('../../../token');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if(!message.guild) return;
    if(message.content === "!trombone") {
        if(message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => {
                    const dispatcher = connection.playFile("./Sans Trombone.mp3");
                    dispatcher.on('end', () => {
                        connection.disconnect();
                    })
                })
        }
    }
});

client.login(Token.token);