import axios from 'axios'
import { ICommand } from 'wokcommands'
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
let win : boolean;
let win_ = '';
export default {
    category: 'API',
    description: 'Exemple de requete',

    permissions: ['ADMINISTRATOR'],

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
                    goldEarned[i] = res.data.info.participants[i].goldEarned;
                    totalDamageDealt[i] = res.data.info.participants[i].totalDamageDealtToChampions;
                    teamId[i] = res.data.info.participants[i].teamId;
                }

                let minutes = Math.floor(gameDuration / 60);
                let seconds = gameDuration - minutes * 60;


                var table = new AsciiTable()
                table
                    .setHeading('Joueur', 'Champion', 'CS', 'KDA', 'Gold', 'Damage')
                    .addRow('Team Bleu')
                for (let i = 0; i < res.data.info.participants.length; i++) {
                    table.addRow(summonerName[i],championName[i], cs[i], kda[i], goldEarned[i], totalDamageDealt[i])
                    table.setAlign(i, AsciiTable.LEFT)
                    if (i == 4) {
                        table.addRow('Team Rouge')
                    }

                }
                
                if (win) win_ = 'VICTOIRE';
                else win_ = 'DÉFAITE';
                console.log(table.toString())
                interaction.reply("```"
                +`𝘔𝘰𝘥𝘦 ${type} \n`
                +`𝘗𝘢𝘵𝘤𝘩: ${patch} \n`
                +`𝘋𝘶𝘳𝘦́𝘦 ${minutes}:${seconds} \n`
                +`${win_} \n`
                +table.toString()+"```");
                
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
}

async function getLast(id: any) {
    let url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?start=0&count=1&${riotkey}`

    const { data } = await axios.get(url)

    match = data[0];
}