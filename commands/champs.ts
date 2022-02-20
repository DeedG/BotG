import axios from 'axios'
import { ICommand } from 'wokcommands'
import { ColorResolvable, MessageEmbed } from 'discord.js'
var AsciiTable = require('ascii-table');

const riotkey = process.env.RIOTKEY
let id: string;
let cNameTeam: any;
let cName: any;

let championId: string[] = [];
let championName: string[] = [];
let championLevel: string[] = [];
let championPoints: number[] = [];
let chestGranted: boolean[] = [];
let chest: string[] = [];
let iconId = '';
export default {
    name: 'champs',
    category: 'league',
    description: 'Affiche vos 10 meilleur champions',


    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<name>',
    expectedArgsTypes: ['STRING'],

    slash: true,

    callback: async ({ args, interaction }) => {
        await getId(args);
        let url = `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}?${riotkey}`

        try {
            const { data } = await axios.get(url)
            for (let i = 0; i < 9; i++) {
                console.log(data[0].championId)
                championId[i] = data[i].championId
                championLevel[i] = data[i].championLevel
                championPoints[i] = data[i].championPoints
                chestGranted[i] = data[i].chestGranted
            }

            await getChampName(championId)

            for (let i = 0; i < chestGranted.length; i++) {
                if (chestGranted[i]) chest[i] = '✔';
                else chest[i] = '✖'

            }


            var table = new AsciiTable()
            table
                .setHeading('Champion', 'Lvl', 'Points', 'Coffre ?')
                .removeBorder()
                .setAlign(4, AsciiTable.CENTER)
            for (let i = 0; i < championId.length; i++) {
                table.addRow(championName[i], championLevel[i], championPoints[i], chest[i])
                
                
            }

            

            console.log(table.toString())

            const exampleEmbed = new MessageEmbed()
                //.setColor(color)
                //.setTitle(win_)
                .setAuthor({ name: cName, iconURL: `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${iconId}.png` })
                //.setDescription(`𝗠𝗼𝗱𝗲: ${type} \n𝗣𝗮𝘁𝗰𝗵: ${patch} \n`)
                .addFields(
                    { name: '10 Meilleurs champions', value: "```" + `${table.toString()}` + "```" },
                )
            //.setFooter({ text: `𝘋𝘶𝘳𝘦́𝘦 ${minutes}:${seconds} ` });
            interaction.reply({ embeds: [exampleEmbed] });

        } catch (error) {
            console.error(error);

        }
    },

} as ICommand

async function getId(name: any) {
    let url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?${riotkey}`
    let encoded = encodeURI(url)


    try {
        const { data } = await axios.get(encoded)
        id = data.id;
        cName = data.name;
        iconId = data.profileIconId;
    } catch (error) {
        console.error(error);

    }
}

async function getChampName(champId: string[]) {
    let link = `http://ddragon.leagueoflegends.com/cdn/12.3.1/data/en_US/champion.json`;

    try {
        const { data } = await axios.get(link)
        interface Champion {
            name: string;
            key: string;
        }
        const champions = Object.values(data.data) as Champion[];
        

        for (let i = 0; i < champId.length; i++) {
            const aChampion = champions.find(v => v.key === champId[i].toString());
            championName[i] = aChampion!.name;
        }

    } catch (error) {
        console.error(error);

    }

}
