const { Client, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const { prefix, token, chan } = require("./data/config.json");
const client = new Client({disableEveryone: true});

client.on("ready", () => {
  client.user.setActivity(`$ip of ${client.users.size} users`, { type: "WATCHING" });
  client.user.setStatus("dnd");
  console.log("Stalking... someone??");
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "help" || command === "cmds" || command === "commands" || command === "tools") {
    const botHelp = new MessageEmbed()
    .setAuthor(client.user.username + " commands", client.user.avatarURL)
    .setColor("#000000")
    .setThumbnail(client.user.displayAvatarURL)
    .addField(`**${prefix}ping**`, `Check bot ping.`)
    .addField(`**${prefix}check <option> <id/ip>**`, `Options: \n\`user\` - check user \n\`ip\` - check IP`)
    .setTimestamp()
    .setFooter(`Bot prefix is ${prefix}`, client.user.avatarURL());
    message.channel.send(botHelp);
  }

  if(command === "ping") {
    message.channel.send("Pinging...").then(m => {
        let ping = m.createdTimestamp - message.createdTimestamp
        let choices = ["Is this really my ping", "Is it okay? I cant look", "I hope it isnt bad"]
        let response = choices[Math.floor(Math.random() * choices.length)]

        m.edit(`${response}: Bot Latency: \`${ping}\``)
    })
  }
  
  if(command === "say") {
      if(!message.author.id == 422408402849890304) return message.channel.send("Insufficient permision!")
    
  let argsresult;
  let mChannel = message.mentions.channels.first()

  message.delete()
  if(mChannel) {
      argsresult = args.slice(1).join(" ")
      mChannel.send(argsresult)
  } else {
      argsresult = args.join(" ")
      message.channel.send(argsresult)
  }
  }

  const cchannel = client.channels.cache.find(channel => channel.id === chan.checks)
  const echannel = client.channels.cache.find(channel => channel.id === chan.errors)

  if(command === "check"){
    if(!args[0]) return message.channel.send(`Please provide an option: \`user\` or \`ip\``)
    if(args[0] == "user") {
      if(!args[1]) return message.channel.send(`Please provide an user ID.`)
      client.users.fetch(args[1])
      .then((User) => {
        const userInfo = new MessageEmbed()
        .setAuthor("CHECKING " + User.username + " iINFO", client.user.avatarURL())
        .setColor("#000000")
        .addField(`FULL NAME`, User.tag)
        .addField(`USERNAME`, User.username, true)
        .addField(`DISCRIMINATOR`, User.discriminator, true)
        .addField(`ID`, User.id, true)
        .addField(`CREATED AT`, User.createdAt, true)
        .addField(`BOT USER`, User.bot)
        .setImage(User.avatarURL())
        .setTimestamp()
        .setFooter(`Bot prefix is ${prefix}`, client.user.avatarURL());
        message.channel.send(userInfo);

        cchannel.send(`User \`${message.author.tag}(${message.author.id})\` checked \`USER\` : \`${User.tag}(${args[1]})\``)
      })
      .catch((err) => {
          // Do something with the Error object, for example, console.error(err);
          console.error("[Error] " + err);
          echannel.send(`Error \`${err}\``)
      })
    }
    if(args[0] == "ip") {
      if(!args[1]) return message.channel.send(`Please provide an IP.`)
      let ip = await superagent
      
      .get(`http://ip-api.com/json/${args[1]}?fields=33292287`);

      let ipEmbed = new MessageEmbed()
      .setColor("#000000")
      .setTimestamp()
      .setAuthor("CHECKING " + args[1], client.user.avatarURL)
      .addField("QUERY", args[1], true) 
      .addField("STATUS", ip.body.status, true)
      .addField("CONTINENT", ip.body.continent, true)
      .addField("CONTINENT CODE", ip.body.continentCode, true)
      .addField("COUNTRY", ip.body.country, true)
      .addField("COUNTRY CODE", ip.body.countryCode, true)
      .addField("REGION", ip.body.region, true)
      .addField("REGION NAME", ip.body.regionName, true)
      .addField("CITY", ip.body.city, true)
      .addField("LAT", ip.body.lat, true)
      .addField("LONG", ip.body.lon, true)          
      .addField("TIMEZONE", ip.body.timezone, true)     
      .addField("CURRENCY", ip.body.currency, true)     
      .addField("ISP", ip.body.isp, true)          
      .addField("ORG", ip.body.org, true)          
      .addField("AS", ip.body.as, true) 
      .addField("AS NAME", ip.body.asname, true)          
      .addField("MOBILE", ip.body.proxy, true)        
      .addField("HOSTING", ip.body.hosting, true)     
      .setFooter(`Bot prefix is ${prefix}`, client.user.avatarURL());
      message.channel.send(ipEmbed)
      cchannel.send(`User \`${message.author.tag}(${message.author.id})\` checked \`IP\` : \`${args[1]}\``)
    }
    else return message.channel.send(`Please provide an option: \`user\` or \`ip\``);
  }
});

client.on('guildMemberAdd', member => {
  const jchannel = client.channels.cache.find(channel => channel.id === chan.joins)
  jchannel.send(`\`${member.user.tag}(${member.user.id})\` joined the server.`);
});

client.on('guildMemberRemove', member => {
   const lchannel = client.channels.cache.find(channel => channel.id === chan.leaves)
  lchannel.send(`\`${member.user.tag}(${member.user.id})\` left the server.`);
});

//client.login(token);
client.login(process.env.BOT_TOKEN)
