import axios from 'axios'
import { ICommand } from 'wokcommands'
import { ColorResolvable, MessageEmbed } from 'discord.js'
const riotkey = process.env.RIOTKEY
let id = '';
let lvl = '';
let cName = '';
let iconId = '';

export default {
    name: 'profile',
    category: 'league',
    description: 'affiche votre profile',

    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<name>',
    expectedArgsTypes: ['STRING'],

    slash: true,

    callback: async ({ args, interaction }) => {
        await getId(args);
        let url = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?${riotkey}`

        try {
            const { data } = await axios.get(url)
            const exampleEmbed = new MessageEmbed()
                .setColor('#0000ff')
                .setTitle('Profile')
                .setAuthor({ name: cName, iconURL: `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${iconId}.png` })
                .setDescription(data[0].queueType)
                .setThumbnail(`http://raw.githubusercontent.com/DeedG/BotG/main/ranked-emblems/Emblem_${data[0].tier}.png`)
                .addFields(
                    { name: `${data[0].tier} ${data[0].rank} ${data[0].leaguePoints} LP`, value: `${Math.round((data[0].wins/(data[0].wins+data[0].losses))*100)} %` },
                    { name: 'Victoires', value: `${data[0].wins} V`, inline: true },
                    { name: 'Défaites', value: `${data[0].losses} D`, inline: true },
                    { name: 'Total', value: `${data[0].wins+data[0].losses} G`, inline: true },
                )
            interaction.reply({ embeds: [exampleEmbed] });

        } catch (err) {
            console.error(err);
        }
    },

} as ICommand

async function getId(name: any) {
    let url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?${riotkey}`

    try {
        const { data } = await axios.get(url)
        id = data.id;
        lvl = data.summonerLevel;
        cName = data.name;
        iconId = data.profileIconId
        console.log(id)
    } catch (err) {
        console.error(err);
    }
}



