import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("GOTOGameJAM");
const votesCollection = db.collection("votes");
const gamesCollection = db.collection("games");
const judgesCollection = db.collection("judge");
//Generar la coneccion a la base
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conexión a MongoDB establecida");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
}

const createVote = async (voteData) => {
  try {
    //Verificar que el juez y juego existan en la base de datos
    const existingJudge = await judgesCollection.findOne({
      _id: new ObjectId(voteData.judge),
    });
    const existingGame = await gamesCollection.findOne({
      _id: new ObjectId(voteData.game),
    });

    if (!existingJudge) {
      throw new Error("El juez no existe.");
    }
    if (!existingGame) {
      throw new Error("El juego no existe.");
    }
    //Verificar que el juez no haya votado ya ese juego
    const existingVote = await votesCollection.findOne({
      judge: voteData.judge,
      game: voteData.game,
    });
    if (existingVote) {
      throw new Error("El juez ya votó por este juego.");
    }

    //Verifica que las puntuaciones sean del 1 al 10
    if (
      voteData.gameplay < 1 ||
      voteData.gameplay > 10 ||
      voteData.art < 1 ||
      voteData.art > 10 ||
      voteData.sound < 1 ||
      voteData.sound > 10 ||
      voteData.themeAffinity < 1 ||
      voteData.themeAffinity > 10
    ) {
      throw new Error("Las puntuaciones deben estar entre 1 y 10.");
    }

    //Verificamos que el juez no deje una categoria vacia
    if (
      voteData.gameplay == null ||
      voteData.art == null ||
      voteData.sound == null ||
      voteData.themeAffinity == null
    ) {
      throw new Error("El juez debe votar por todas las categorías.");
    }

    const newVote = { ...voteData };
    await votesCollection.insertOne(newVote);
    return newVote;
  } catch (error) {
    throw error;
  }
};

const getVotesByJudge = async (judgeId) => {
  try {
    //Busca las votaciones de un juez por su Id
    const judgeVotes = await votesCollection.find({ judge: judgeId }).toArray();
    //Busca el nombre del juego asociado al gameId
    const getVotesWithGame = await Promise.all(
      judgeVotes.map(async (vote) => {
        const gameInfo = await gamesCollection.findOne({ _id: new ObjectId(vote.game) });
        //retorna la info en un solo objeto
        return {
          name: gameInfo.name,
          gameplay: vote.gameplay,
          art: vote.art,
          sound: vote.sound,
          themeAffinity: vote.themeAffinity,
        };
      })
    );

    return getVotesWithGame;
  } catch (error) {
    throw error;
  }
};

const getVotesByGame = async (gameId) => {
  try {
    //Busca las votaciones de un juego por su Id
    const gameVotes = await votesCollection.find({ game: gameId }).toArray();
    //Busca el nombre del juez asociado al judgeId
    const getVotesWithJudge = await Promise.all(
      gameVotes.map(async (vote) => {
        const judgeInfo = await judgesCollection.findOne({ _id: new ObjectId(vote.judge) });
        //retorna la info en un solo objeto
        return {
          name: judgeInfo.name,
          gameplay: vote.gameplay,
          art: vote.art,
          sound: vote.sound,
          themeAffinity: vote.themeAffinity,
        };
      })
    );

    return getVotesWithJudge;
  } catch (error) {
    throw error;
  }

}

export default { connectToDatabase, createVote, getVotesByJudge, getVotesByGame };