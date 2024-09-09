import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './Routes/User.Routes.js'
import productRoutes from './Routes/Product.Routes.js'
import orderRoutes from './Routes/Order.Routes.js'
import {EventEmitter} from 'events'

import cookieParser from 'cookie-parser';


dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(cors());

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

EventEmitter.defaultMaxListeners = 20



app.use("/users",userRouter);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);


app.get('/', (req, res) => {
    res.send("form test");
})



