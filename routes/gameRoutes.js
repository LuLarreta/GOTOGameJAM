import express from 'express';
import GameController from '../controllers/gameController.js';

const router = express.Router();

// Listar juegos
router.get('/games', GameController.getGames);

// Crear un juego
router.post('/games', GameController.createGame);

// Obtener un juego por ID
router.get('/games/:id', GameController.getGameById);

// Actualizar un juego por ID
router.patch('/games/:id', GameController.updateGame);

// Eliminar un juego por ID
router.delete('/games/:id', GameController.deleteGame);

// Obtener un juego por edicion
router.get('/games/edition/:edition', GameController.getGamesByEdition);
router.get('/games/edition/:edition/genre/:genre', GameController.getGamesByEdition);

//Obtener un juego con su promedio de puntuacion
router.get('/games/:id/average-score', GameController.getGameAverageScore);

export default router; 