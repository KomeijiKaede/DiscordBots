const Discord = require('discord.js');
const Token = require('../../token');
const Resource = require('./resource.js');

const client = new Discord.Client();

function Ready() {
    console.log(`Logged in as PushPinBot: caching all recent messages...`);
    let guild;
    let channel;
    for ( guild of client.guilds.values() )
        for ( channel of guild.channels.values() ) {
            const channelName = channel.name;
            if (!channel.fetchMessages) continue;
            channel.fetchMessages({limit: 100})
                .then(messages => {
                    console.log(`Received ${messages.size} messages for #${channelName}`)
                })
                .catch(console.error);
    }
}

function Reaction(rea, user) {
    if (rea.count === 1) {
        const message = rea.message;
        const channel = message.channel;
        const guild   = message.guild;
        if ( channel.name === Resource.target_channel.channel)
            return;
        if ( rea.emoji.name !== "📌")
            return;
        PinMessage(guild, message, user);
    }
}

function PinMessage(guild, message, user) {
    let channel;
    let found;
    let pic;

    const guild_id = guild.id;
    const channel_id = message.channel.id;
    const message_link = `https://discordapp.com/channels/${guild_id}/${channel_id}/${message.id}`;

    for ( channel of guild.channels.values() ) {
        if (channel.name.toLowerCase() !== Resource.target_channel)
            continue;
        if (!channel.send) {
            console.error(`#${channel.name} is not text channel`);
            continue;
        }
        found = true;
        break;
    }
    if (!found) {
            console.error(`Not found #${Resource.target_channel}`);
            return;
    }
    if (message.attachments.array().length === 1) {
        pic = message.attachments.array()[0].url
    }
    let pinMessage = new Discord.RichEmbed()
        .setAuthor(user.username,user.avatarURL)
        .setColor(3447003)
        .addField("PushPin!!",`${message.channel} post by ${message.author} \n ${message.content} ${message_link}`)
        .setImage(pic)
        .setTimestamp(new Date());
    if (message.author.username !== Resource.bot_name) {
        channel.send(pinMessage)
            .then(nu => console.log(`Pinned ${user.tag} message: ${message.content}`))
            .catch(console.error);
    }
}

client.on("ready", Ready);
client.on("messageReactionAdd", Reaction);

client.login(Token.token);