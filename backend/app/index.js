import app from "./app.js"
import dotenv from "dotenv"
dotenv.config()
const { PORT } = process.env;

//Gyökér végpont definiálása, a szerver státuszának kiírására 
app.get('/', (req, res) => {
    res.send("szerver fut")
})
//szerver futtatása a megadott porton
app.listen(PORT, () => {
    console.log(`Fut a szerver a ${PORT}-on`);
})