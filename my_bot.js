const Discord = require('discord.js')
const client = new Discord.Client()

var botChannel;
client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
            if (channel.name=="bot"){
                console.log(channel.id)
                botChannel = client.channels.get(channel.id)
            }
        })
    })

    // botChannel.send("Hello")
    client.user.setActivity("every word you say", {type: "LISTENING"})
})

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    if (receivedMessage.content.startsWith("?")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let command = splitCommand[0]
    let args = splitCommand.slice(1)
    
    console.log("Command received: " + command)
    console.log("Args: " + args)
    if (command == "DotaMatch") {
        console.log("DOTAMATCH ARGS: " + args)
        DotaMatchCommand(args)
    }    
}

function DotaMatchCommand(args) {
    // Accepts match ID
    
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
    var request = new XMLHttpRequest()
    const embed = new Discord.RichEmbed()

    request.open('GET', 'https://api.opendota.com/api/matches/' + args, true)
    request.send()
    request.onload = function() {
        var match_data = JSON.parse(request.responseText)
        //console.log(match_data)
        var output_data = ""
        //botChannel.send("Players: ")
        
        embed.setTitle("https://www.opendota.com/matches/" + args)
        embed.setThumbnail("https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png")
        embed.setColor(0x00AE86)
        embed.setAuthor("Dota Match", "https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png", "https://www.opendota.com/matches/" + args)
        embed.setFooter("?DotaPlayer PlayerID", "https://seeklogo.com/images/D/dota-2-logo-A8CAC9B4C9-seeklogo.com.png")

        for (i in match_data.players) {
            var accountID = match_data.players[i].account_id
            var player_request = new XMLHttpRequest()
            player_request.open('GET', 'https://api.opendota.com/api/players/' + accountID, false)
            player_request.send()
            var player_data = JSON.parse(player_request.responseText)
            //console.log(player_data)
            if (match_data.players[i].personaname == null) {
                //console.log("User: " + match_data.players[i].personaname + " , LH: " + 
                //match_data.players[i].last_hits + " , Hero Damage: " + match_data.players[i].hero_damage + " , MMR: unavailable")
                //botChannel.send("User: " + match_data.players[i].personaname + " , LH: " + 
                //match_data.players[i].last_hits + " , Hero Damage: " + match_data.players[i].hero_damage + " , MMR: unavailable")
                output_data += "User: " + match_data.players[i].personaname + " , LH: " + 
                match_data.players[i].last_hits + " , Hero Damage: " + match_data.players[i].hero_damage + " , MMR: unavailable\n\n"
                embed.addField("Unavailable","gg",true)
            } else {
                //console.log("User: " + match_data.players[i].personaname + " , LH: " + 
                //match_data.players[i].last_hits + " , Hero Damage: " + match_data.players[i].hero_damage + " , MMR: " + player_data.mmr_estimate.estimate)
                //botChannel.send("User: " + match_data.players[i].personaname + " , LH: " + 
                //match_data.players[i].last_hits + " , Hero Damage: " + match_data.players[i].hero_damage + " , MMR: " + player_data.mmr_estimate.estimate)
                output_data += "User: " + match_data.players[i].personaname + " , LH: " + 
                match_data.players[i].last_hits + " , Hero Damage: " + match_data.players[i].hero_damage + " , MMR: " + player_data.mmr_estimate.estimate + "\n\n"
                embed.addField(match_data.players[i].personaname + 
                    " \\|| MMR: " + player_data.mmr_estimate.estimate + 
                    " \\|| ID: " + accountID, 
                    "Lvl: " + match_data.players[i].level + 
                    " \\|| KDA: " + match_data.players[i].kills+"/"+match_data.players[i].deaths+"/"+match_data.players[i].assists + 
                    " \\|| LH/DN: " + match_data.players[i].last_hits+"/"+match_data.players[i].denies + 
                    " \\|| GPM/XPM: " + match_data.players[i].gold_per_min+"/"+match_data.players[i].xp_per_min +
                    " \\|| HD: " + match_data.players[i].hero_damage +
                    " \\|| TD: " + match_data.players[i].tower_damage + 
                    " \\|| HH: " + match_data.players[i].hero_healing + 
                    " \\|| G: " + match_data.players[i].total_gold, true)
            }
            
        }
        //botChannel.send("```" + output_data + "```")
        botChannel.send(embed)
    }
    // user, K/D/A, lh/deny, dmg/heal, gpm, items, heroes, lvl, rank
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = ""

client.login(bot_secret_token)