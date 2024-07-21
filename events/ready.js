const { Events } = require('discord.js');
const Log = require('../helpers/fancyLogs/log');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        Log.success(`Logged in as ${client.user.tag}`);

        //client.user.setStatus('dnd');
        client.user.setActivity(`/help for more information`);
        //client.user.setActivity(`🛠️🛠️🛠️`);
    },
};