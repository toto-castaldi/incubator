const router            = require('express').Router();

router.post('/info', (req, res) => {
    res.json({ver : '1.0'});
});

module.exports = router;
