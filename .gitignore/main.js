const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')



const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoir: []})
.write()

var bot = new Discord.Client();
var prefix = ("*");


bot.on('ready', () => {
    bot.user.setPresence({ game: { name: 'T empêcher de faire des bétises', type: 0}});
    console.log("Bot Ready !");
});

bot.login(process.env.TOKEN);


bot.on('message', message => {
    let command = message.content.split(" ")[0];
    const args = message.content.slice(prefix.length).split(/ +/);
    command = args.shift().toLowerCase();

    if (command === "kick") {
        let modRole = message.guild.roles.find("name", "Modo");
        if(!message.member.roles.has(modRole.id)) {
            return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
        }
        if(message.mentions.users.size === 0) {
            return message.reply("Merci de mentionner l'utilisateur à expulser.").catch(console.error);
        }
        let kickMember = message.guild.member(message.mentions.users.first());
        if(!kickMember) {
            return message.reply("Cet utilisateur est introuvable ou impossible à expulser.")
        }
        if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
            return message.reply("Je n'ai pas la permission KICK_MEMBERS pour faire ceci.").catch(console.error);
        }
        kickMember.kick().then(member => {
            message.reply(`${member.user.username} a été expulsé avec succès.`).catch(console.error);
            message.guild.channels.find("name", "general").send(`**${member.user.username} a été expulsé du discord par **${message.author.username}**`)
        }).catch(console.error)
    
    }

    if (command === "ban") {
        let modRole = message.guild.roles.find("name", "Modo");
        if(!message.member.roles.has(modRole.id)) {
            return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
        }
        const member = message.mentions.members.first();
        if (!member) return message.reply("Merci de mentionner l'utilisateur à bannir.");
        member.ban().then(member => {
            message.reply(`${member.user.username} a été banni avec succès.`).catch(console.error);
            message.guild.channels.find("name", "general").send(`*${member.user.username}* a été banni du discord par **${message.author.username}**`)
        }).catch(console.error)
}})
