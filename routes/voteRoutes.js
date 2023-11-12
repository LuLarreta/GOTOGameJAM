import express from 'express';
import voteController from '../controllers/voteController.js';

const router = express.Router();

//Agregar votos
router.post('/votes', voteController.createVote);

//Obtener votos de un juez por su ID
router.get('/judges/:id/votes', voteController.getJudgeVotes);

//Obtener votos de un juego por su ID 
router.get('/games/:id/votes', voteController.getGameVotes);

export default router;