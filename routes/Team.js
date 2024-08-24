const express = require('express'); 
const router = express.Router();
const {auth} = require('../middlewares/auth')
const { addTeam, showAllTeams, updateTeam,deleteTeam } = require('../controllers/Team');
router.post('/add',auth , addTeam);
router.get('/all', showAllTeams);
router.put('/update',auth , updateTeam);
router.delete('/delete',auth , deleteTeam);
module.exports = router;
