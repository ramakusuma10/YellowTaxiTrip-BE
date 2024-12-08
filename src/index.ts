import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandle';
import cors from 'cors';
import TripController from './controllers/tripController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Menyediakan default port jika tidak ada

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello welcome to Yellow Taxi Trip!");
});

// Menggunakan route trip
app.get("/trips",TripController.getTrips);
app.get("/trips/filter",TripController.getTripsByFilter);

// Middleware error handler
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});