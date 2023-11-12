import express from 'express';
import gameRoutes from './routes/gameRoutes.js';
import voteRoutes from './routes/voteRoutes.js';

const app = express();

app.use(express.json());
app.use(gameRoutes);
app.use(voteRoutes);

app.listen(2023, function(){
    console.log("El servidor esta levantado: http://localhost:2023");
})