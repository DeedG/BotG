import DJS, { Intents } from 'discord.js'
import WOK from 'wokcommands'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const client = new DJS.Client({
    intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
    new WOK(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers : ['781891181260439558']
        
    })
    console.log("le bot est on");
})

client.login(process.env.TOKEN)