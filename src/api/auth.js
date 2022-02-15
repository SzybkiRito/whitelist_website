const express = require('express');
const router = express.Router();
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const database = require('../database');

router.post('/answer', (req, res) => {
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    const answer = JSON.stringify(req.body.answer);
    const cleanAnswer = DOMPurify.sanitize(answer)
    const discordData = req.body.discordData;
    database.query('INSERT INTO `answer`(`discordUserId`, `discordName`, `discordEmail`, `answers`, `state`) VALUES (?, ?, ?, ?, ?)', [
        discordData.discordUserId,
        discordData.discordName,
        discordData.discordEmail,
        cleanAnswer,
        'waiting'
    ], (err, response) => {
        if (err) res.json({
            msg: err
        });
        if (response) res.json({
            msg: 'Succesfull'
        });
    });
});

module.exports = router;
