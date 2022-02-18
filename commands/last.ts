import axios from 'axios'
import { ICommand } from 'wokcommands'
import { ColorResolvable, MessageEmbed } from 'discord.js'
var AsciiTable = require('ascii-table');

const riotkey = process.env.RIOTKEY
let id = '';
let match = '';
let cNameTeam: any;
let gameDuration: any;
let cName: any;

let summonerName: string[] = [];
let championName: string[] = [];
let cs: number[] = [];
let kda: string[] = [];
let goldEarned: number[] = [];
let totalDamageDealt: number[] = [];
let teamId: number[] = [];
let rep = '';
let type = '';
let patch = '';
let win: boolean;
let win_ = '';
let color : ColorResolvable = '#000000';
let iconId = '';
export default {
    category: 'API',
    description: 'Exemple de requete',


    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<name>',
    expectedArgsTypes: ['STRING'],

    slash: true,

    callback: async ({ args, interaction }) => {
        await getId(args);
        await getLast(id);
        let url = `https://europe.api.riotgames.com/lol/match/v5/matches/${match}?${riotkey}`

        axios
            .get(url)
            .then((res) => {
                gameDuration = res.data.info.gameDuration;
                type = res.data.info.gameType;
                patch = res.data.info.gameVersion;
                for (let i = 0; i < res.data.info.participants.length; i++) {
                    if (res.data.info.participants[i].summonerName == cName) {
                        cNameTeam = res.data.info.participants[i].teamId
                        win = res.data.info.participants[i].win
                    }
                    summonerName[i] = res.data.info.participants[i].summonerName;
                    championName[i] = res.data.info.participants[i].championName;
                    cs[i] = res.data.info.participants[i].totalMinionsKilled + res.data.info.participants[i].neutralMinionsKilled;
                    kda[i] = `${res.data.info.participants[i].kills}/${res.data.info.participants[i].deaths}/${res.data.info.participants[i].assists}`;
                    totalDamageDealt[i] = res.data.info.participants[i].totalDamageDealtToChampions;
                    teamId[i] = res.data.info.participants[i].teamId;
                }

                let minutes = Math.floor(gameDuration / 60);
                let seconds = gameDuration - minutes * 60;


                var table = new AsciiTable()
                table
                    .setHeading('Joueur', 'Champion', 'CS', 'KDA','Damage')
                    .addRow('Team Bleu')
                for (let i = 0; i < res.data.info.participants.length; i++) {
                    table.addRow(summonerName[i], championName[i], cs[i], kda[i],totalDamageDealt[i])
                    table.removeBorder()
                    if (i == 4) {
                        table.addRow('\u200B')
                        table.addRow('Team Rouge')
                    }

                }

                if (win){
                    win_ = 'VICTOIRE';
                    color = '#00ff00';
                } 
                else {
                    win_ = 'DÉFAITE';
                    color = '#ff0000';
                }
                console.log(table.toString())
                
                const exampleEmbed = new MessageEmbed()
                    .setColor(color)
                    .setTitle(win_)
                    .setAuthor({ name: cName, iconURL: `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${iconId}.png`})
                    .setDescription(`𝗠𝗼𝗱𝗲: ${type} \n𝗣𝗮𝘁𝗰𝗵: ${patch} \n`)
                    .addFields(
                        { name: 'Dernière game', value:"```"+`${table.toString()}`+"```"},
                    )
                    .setFooter({ text: `𝘋𝘶𝘳𝘦́𝘦 ${minutes}:${seconds} \u200B \u200B \u200B \u200B`});
                interaction.reply({ embeds: [exampleEmbed] });


            })
            .catch((err) => {
                console.error('ERR:', err)
            })
    },

} as ICommand

async function getId(name: any) {
    let url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?${riotkey}`

    const { data } = await axios.get(url)

    id = data.puuid;
    cName = data.name;
    iconId = data.profileIconId;
}

async function getLast(id: any) {
    let url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?start=0&count=1&${riotkey}`

    const { data } = await axios.get(url)

    match = data[0];
}
