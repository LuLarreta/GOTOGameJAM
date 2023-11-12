import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("GOTOGameJAM");
const gamesCollection = db.collection("games");
const votesCollection = db.collection("votes");
//Generar la coneccion a la base
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB establecida");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}
/* 
------------------------------------------------------------------- 
CRUD DE LOS JUEGOS 
----------------------------------------------------------------------
*/

const getGames = async () => {
  const games = await gamesCollection.find().toArray();
  return games;
};

const createGame = async (gameData) => {
  try {
    const newGame = { ...gameData };
    await gamesCollection.insertOne(newGame);
    return newGame;
  } catch (error) {
    throw error;
  }
};

const getGameById = async (gameId) => {
  try {
    const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });
    return game;
  } catch (error) {
    throw error;
  }
};

const updateGame = async (gameId, updatedData) => {
  try {
    const idGame = { _id: new ObjectId(gameId) };
    const update = { $set: updatedData };
    const options = { returnOriginal: false };

    const result = await gamesCollection.findOneAndUpdate(
      idGame,
      update,
      options
    );
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteGame = async (gameId) => {
  try {
    const deleteGame = await gamesCollection.deleteOne({
      _id: new ObjectId(gameId),
    });
    return deleteGame;
  } catch (error) {
    throw error;
  }
};

/* 
------------------------------------------------------------------- 
ENDPOINTS
---------------------------------------------------------------------- 
*/

const getGamesByEdition = async (edition, genre) => {
  try {
    //Convierte lo que se manda por la uri a numero
    edition = parseInt(edition);
    const query = { edition };
    if (genre) {
      query.genre = genre;
    }
    // Busca los juegos mediante su edición
    const editionGames = await gamesCollection.find(query).toArray();
    //Calcula el puntaje para cada juego
    const getGamesWithScore = await Promise.all(
      editionGames.map(async (game) => {
        const votes = await votesCollection.find({ game: game._id.toString() }).toArray();
        const totalScore = votes.reduce((acc, vote) => {
          return (
            acc +
            parseInt(vote.gameplay) +
            vote.art +
            vote.sound +
            vote.themeAffinity
          );
        }, 0);
        return {
          name: game.name,
          genre: game.genre,
          totalScore,
        };
      })
    );
    const sortedGames = getGamesWithScore.sort((a, b) => b.totalScore - a.totalScore);
    return sortedGames;
  } catch (error) {
    throw error;
  }
};

const getGameAverageScore = async (gameId) => {
  try {
    const game = await gamesCollection.findOne({ _id: new ObjectId(gameId) });
    const votes = await votesCollection.find({ game: game._id.toString() }).toArray();
    const averageScores = {
      gameplay: calculateAverage(votes, 'gameplay'),
      art: calculateAverage(votes, 'art'),
      sound: calculateAverage(votes, 'sound'),
      themeAffinity: calculateAverage(votes, 'themeAffinity'),
    };
    const result = {
      game,
      averageScores
    };

    return result;
  } catch (error) {
    throw error;
  }
};

const calculateAverage = (votes, category) => {
  const totalScore = votes.reduce((acc, vote) => acc + vote[category], 0);
  const averageScore = votes.length > 0 ? totalScore / votes.length : 0;
  return averageScore;
};

export default {
  connectToDatabase,
  getGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame,
  getGamesByEdition,
  getGameAverageScore,
};
