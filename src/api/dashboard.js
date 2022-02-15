const express = require('express');
const router = express.Router();
const database = require('../database');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const jwt = require('jsonwebtoken');
const { roleId, serverId } = require('../../config.json');

client.once('ready', () => {
    console.log('==> Started!')
});

client.login(process.env.TOKEN);

router.post('/login', (req, res) => {
    const token = generateAccessToken({ username: req.body.username });
    res.json({
        token: token
    });
});

router.get('/', (req, res) => {
    database.query('SELECT discordUserId FROM admins', (err, response) => {
        if (err) res.json({
            err: err
        })
        if (response) {
            res.json({
                msg: response
            })
        }
    });
});

router.get('/getQuestions', authenticateToken, (req, res) => {
    database.query(`SELECT * FROM answer WHERE state = 'waiting'`, (err, response) => {
        if (err) res.json({
            err: err
        })
        if (response) {
            res.json({
                msg: response
            })
        }
    });
});

router.post('/accept', authenticateToken, (req, res) => {
    database.query('UPDATE answer SET state = ? WHERE discordUserId = ?', [
        'accepted',
        req.body.discordUserId
    ], (err, response) => {
        if (err) res.json({
            msg: err
        });
        if (response) res.json({
            msg: 'Succesfull'
        });
    });
});

router.post('/reject', authenticateToken, (req, res) => {
    database.query('UPDATE answer SET state = ? WHERE discordUserId = ?', [
        'reject',
        req.body.discordUserId
    ], (err, response) => {
        if (err) res.json({
            msg: err
        });
        if (response) res.json({
            msg: 'Succesfull'
        });
    });
});

router.post('/userId', authenticateToken, (req, res) => {
    const userId = req.body.discordUserId;
    const adminId = req.body.adminDiscordUserId;
    const action = req.body.action;
    const role = roleId;
    client.users.fetch(userId, false).then(async (user) => {
        if (action == 'reject') user.send(`Przykro nam, twoje podanie zostało odrzucone przez <@${adminId}>. Spróbuj swoich sił następnym razem, powodzenia!`);
        else if (action == 'accept') {
            const guild = client.guilds.cache.get(serverId);
            const members = guild.members.fetch(userId, false).then((users) => {
                users.guild.members.cache.get(userId).roles.add(role);
            });

            user.send(`Gratulacje! Twoje podanie zostało zaakceptowane przez <@${adminId}> \nZostaje Ci teraz krótka rozmowa na kanale głosowym.`);
        }
    });
    res.sendStatus(200);
});

function authenticateToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
          throw new Error('Authentication failed!');
        }
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;  
        next();
      } catch (err) {
        res.status(400).send('Invalid token !');
      }
}

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

module.exports = router;
