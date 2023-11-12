import gameService from "../services/gameService.js";

// Listar todos los juegos
const getGames = async (req, res) => {
  try {
    const games = await gameService.getGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Error al listar juegos" });
  }
};
// Crear un juego
const createGame = async (req, res) => {
  try {
    const newGame = await gameService.createGame(req.body);
    res.status(201).json(newGame); 
  } catch (error) {
    res.status(500).json({ message: "Error al crear un juego" });
  }
};

// Obtener un juego por ID
const getGameById = async (req, res) => {
  try {
    const gameById = await gameService.getGameById(req.params.id);
    if (gameById) {
      res.status(200).json(gameById);
    } else {
      res.status(404).json({ message: "Juego no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el juego por ID" });
  }
};

// Actualizar un juego por ID
const updateGame = async (req, res) => {
  try {
    const updateGame = await gameService.updateGame(req.params.id, req.body);
    if (updateGame) {
      res.status(200).json(updateGame);
    } else {
      res.status(404).json({ message: "Juego no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el juego por ID" });
  }
};

// Eliminar un juego por ID
const deleteGame = async (req, res) => {
  try {
    const deleteGame = await gameService.deleteGame(req.params.id);
    if (deleteGame) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Juego no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el juego por ID" });
  }
};

// Obtener juegos ordenados por puntaje y filtrados por género
const getGamesByEdition = async (req, res) => {
  try {
    const games = await gameService.getGamesByEdition(req.params.edition, req.params.genre);
    if (games.length > 0) {
      res.status(200).json(games);
    } else {
      res.status(404).json({ message: 'No se encontraron juegos para la edición o genero especificado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener juegos por edición' });
  }
};

const getGameAverageScore = async (req, res) => {
  try {
    const gameById = await gameService.getGameAverageScore(req.params.id);
    if (gameById) {
      res.status(200).json(gameById);
    } else {
      res.status(404).json({ message: "Juego no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el juego por ID" });
  }
};

export default {
  getGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame,
  getGamesByEdition,
  getGameAverageScore
};
