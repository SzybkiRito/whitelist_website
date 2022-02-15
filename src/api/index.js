const express = require('express');
const auth = require('./auth');
const dashboard = require('./dashboard');
const router = express.Router();

// router.get('/', (req, res) => {
//   res.json({
//     message: 'API - OAuth2'
//   });
// });

router.use('/auth', auth);
router.use('/dashboard', dashboard);

module.exports = router;
