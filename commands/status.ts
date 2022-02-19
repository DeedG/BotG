import axios from 'axios'
import { ICommand } from 'wokcommands'
import { ColorResolvable, MessageEmbed } from 'discord.js'
const riotkey = process.env.RIOTKEY
let id = '';
let lvl = '';
let cName = '';
let iconId = '';
let maintenanceEmbed: MessageEmbed;
let incidentEmbed: MessageEmbed;
let incident: boolean = false;
let maintenance: boolean = false;
export default {
    name: 'status',
    category: 'league',
    description: 'Affiche le statut du jeu',
    slash: true,

    callback: async ({ args, interaction }) => {
        let url = `https://euw1.api.riotgames.com/lol/status/v4/platform-data?${riotkey}`
        try {
            const { data } = await axios.get(url)

            let rep: any;
            for (let i = 0; i < data.incidents.length; i++) {
                console.log(data.incidents[i])

                incidentEmbed = new MessageEmbed()
                    .setColor('#0050ff')
                    .setTitle(data.incidents[i].incident_severity)
                    //.setAuthor({ name: cName, iconURL: `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${iconId}.png` })
                    .setDescription(data.incidents[i].titles[3].content)
                    //.setThumbnail(`http://raw.githubusercontent.com/DeedG/BotG/main/ranked-emblems/Emblem_${data[0].tier}.png`)
                    .addFields(
                        { name: `\u200B`, value: `${data.incidents[i].updates[0].translations[3].content}` },

                    )
            }
            for (let i = 0; i < data.maintenances.length; i++) {
                console.log(data.maintenances[i])

                maintenanceEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle(data.maintenances[i].incident_severity)
                    //.setAuthor({ name: cName, iconURL: `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${iconId}.png` })
                    .setDescription(data.maintenances[i].titles[3].content)
                    //.setThumbnail(`http://raw.githubusercontent.com/DeedG/BotG/main/ranked-emblems/Emblem_${data[0].tier}.png`)
                    .addFields(
                        { name: `\u200B`, value: `${data.maintenances[i].updates[0].translations[3].content}` },
                    )
            }

            interaction.reply({ embeds: [incidentEmbed] });


        } catch (err) {
            console.error(err);
        }
    },

} as ICommand

