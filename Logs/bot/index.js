const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const API_URL = 'http://localhost:5000/upload'; // Your backend API
const BOT_TOKEN = process.env.BOT_TOKEN;

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!blog') || message.author.bot) return;
    
    const args = message.content.split('"');
    if (args.length < 3) {
        message.reply('Please use the format: !blog "Title" and attach an image + .md file.');
        return;
    }
    
    const title = args[1];
    const attachments = message.attachments;
    
    if (attachments.size !== 2) {
        message.reply('Attach exactly 1 Markdown file and 1 image.');
        return;
    }

    let markdownFile, imageFile;
    attachments.forEach(att => {
        if (att.name.endsWith('.md')) markdownFile = att.url;
        else imageFile = att.url;
    });

    if (!markdownFile || !imageFile) {
        message.reply('Invalid file types. You need a .md file and an image.');
        return;
    }

    try {
        await axios.post(API_URL, { title, user: message.author.username, markdownUrl: markdownFile, imageUrl: imageFile });
        message.reply('Blog posted successfully!');
    } catch (error) {
        message.reply('Error uploading blog.');
        console.error(error);
    }
});

client.login(BOT_TOKEN);
