import voteService from "../services/voteService.js";

const createVote = async (req, res) => {
  //hacer validaciones
  try {
    const newVote = await voteService.createVote(req.body);
    res.status(201).json(newVote);
  } catch (error) {
    if (error.message === "El juez ya votó por este juego.") {
        res.status(400).json({ message: "El juez ya votó por este juego." });
      }  else if (error.message === "El juez no existe.") {
        res.status(400).json({ message: "El juez no existe." });
      } else if (error.message === "El juego no existe.") {
        res.status(400).json({ message: "El juego no existe." });
      } else if (error.message === "Las puntuaciones deben estar entre 1 y 10.") {
        res.status(400).json({ message: "Las puntuaciones deben estar entre 1 y 10." });
      } else if (error.message === "El juez debe votar por todas las categorías.") {
        res.status(400).json({ message: "El juez debe votar por todas las categorías." });
      } else {
        res.status(500).json({ message: "Error al generar el voto" });
      }
  }
};

const getJudgeVotes = async (req,res) => {
  try {
    const judgeVotes = await voteService.getVotesByJudge(req.params.id);
    if (judgeVotes) {
      res.status(200).json(judgeVotes);
    } else {
      res.status(404).json({ message: "Votos del juez no encontrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los votos del juez" });
  }
};

const getGameVotes = async (req,res) => {
  try {
    const gameVotes = await voteService.getVotesByGame(req.params.id);
    if (gameVotes) {
      res.status(200).json(gameVotes);
    } else {
      res.status(404).json({ message: "Votos del juego no encontrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los votos del juego" });
  }
};

export default { createVote, getJudgeVotes, getGameVotes };
