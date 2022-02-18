import axios from 'axios'
import { ICommand } from 'wokcommands'
const riotkey = process.env.RIOTKEY
let id = '';
let lvl = '';
let sName = '';
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
        let url = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?${riotkey}`
        
        const { data } = await axios.get(url)

        console.log(data[0]);
        
        interaction.reply(`${sName} lvl ${lvl} est classé ${data[0].tier} ${data[0].rank}, ${data[0].wins}W | ${data[0].losses}L`)

    },
    
} as ICommand

async function getId(name: any) {
    let url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?${riotkey}`
        
    const { data } = await axios.get(url)
    console.log(data);
    id = data.id;
    lvl = data.summonerLevel;
    sName = data.name;
}



