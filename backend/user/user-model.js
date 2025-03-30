import mysqlP from 'mysql2/promise'
import dbConfig from '../app/config.js'
import {User} from './user.js'
import {Functions} from '../app/functions.js'
import crypto from 'crypto'

export async function Register(req, res) {
    const user = req.body
    if (!user.Email || !user.FelhasznaloNev || !user.Jelszo) {
        let missingdata = 
        {
            Email: !user.Email,
            FelhasznaloNev: !user.FelhasznaloNev,
            Jelszo: !user.Jelszo
        }
        res.status(400).send({ error: "Hiányzó adatok", MissingData: missingdata})
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        if (Functions.checkInput(user.Email) || Functions.checkInput(user.FelhasznaloNev) || Functions.checkInput(user.Jelszo)) {
            res.status(400).send({ error: "Nem megengedett karakterek használata." })
            return
        }
        let IsPasswordValid = Functions.IsPasswordValid(user.Jelszo)
        if (IsPasswordValid != "") {
            res.status(400).send({ error: IsPasswordValid })
            return
        }
        let IsUsernameValid = Functions.IsUsernameValid(user.FelhasznaloNev);
        if (IsUsernameValid != "") {
            res.status(400).send({ error: IsUsernameValid })
            return
        }
        let IsEmailValid = Functions.checkEmail(user.Email);
        if (IsEmailValid != "") {
            res.status(400).send({ error: IsEmailValid })
            return
        }
        const [rows] = await conn.execute('insert into Felhasznalok values(null,?,?,?,?,?)', [user.FelhasznaloNev, user.Jelszo, user.Email, user.Statusz, user.JogosultsagId])
        if (rows.affectedRows > 0) {
            res.status(201).send({ success: "Sikeres regisztráció", data: user })
            return
        }
        res.status(400).send({ error: "Hiba a regisztrációkor!" })
    }
    catch (err) {
        switch (err.errno) {
            case 1062: 
                res.status(500).send({ error: "Már létező felhasználó." }); 
                break;
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}

export async function getUserFromToken(req, res) {
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        let user = await User.loadDataFromDB(res.decodedToken.UserId)
        if (user.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        res.status(200).send({ success: "Sikeres lekérdezés", data: user })
        return
    }
    catch (err) {
        switch (err.errno) {
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}

export async function updateUserWithToken(req, res) {
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    if (!req.body.Email && !req.body.FelhasznaloNev && !req.body.Jelszo) {
        res.status(404).send({ error: "Hiányzó adatok" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        if (Functions.checkInput(req.body.Email) || Functions.checkInput(req.body.FelhasznaloNev) || Functions.checkInput(req.body.Jelszo)) {
            res.status(400).send({ error: "Nem megengedett karakterek használata." })
            return
        }
        let olduser = await User.loadDataFromDB(res.decodedToken.UserId)
        let user = olduser
        if (user.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }

        if(req.body.Jelszo !== undefined){
            let IsPasswordValid = Functions.IsPasswordValid(req.body.Jelszo)
            if (IsPasswordValid != "") {
                res.status(400).send({ error: IsPasswordValid })
                return
            }
            req.body.Jelszo = crypto.createHash('sha256').update(req.body.Jelszo).digest('hex');
        }

        if(req.body.FelhasznaloNev !== undefined){
            let IsUsernameValid = Functions.IsUsernameValid(req.body.FelhasznaloNev);
            if (IsUsernameValid != "") {
                res.status(400).send({ error: IsUsernameValid })
                return
            }
        }

        if(req.body.Email !== undefined){
            let IsEmailValid = Functions.checkEmail(req.body.Email);
            if (IsEmailValid != "") {
                res.status(400).send({ error: IsEmailValid })
                return
            }
        }

        Object.assign(user, req.body)
        const [rows2] = await conn.execute('Update Felhasznalok set FelhasznaloNev =?,Email=?, Jelszo=? where FelhasznaloId =?', [user.FelhasznaloNev, user.Email, user.Jelszo, res.decodedToken.UserId])
        user.Jelszo = undefined
        if (rows2.affectedRows > 0) {
            res.status(201).send({ success: "Sikeres frissítés", data: user })
            return
        }
        res.status(404).send({ error: "Sikertelen az adatok frissítése!" })
    }
    catch (err) {
        switch (err.errno) {
            case 1062: 
                res.status(500).send({ error: "Már létező felhasználó." }); 
                break;
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}

export async function updateUserByIdAdmin(req, res) {
    if (!req.params.UserId || !req.body) {
        res.status(400).send({ error: "Hiányzó felhasználó azonosító" })
        return
    }
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        
        if (Functions.checkInput(req.body.Email) || Functions.checkInput(req.body.FelhasznaloNev) || Functions.checkInput(req.body.Jelszo)) {
            res.status(400).send({ error: "Nem megengedett karakterek használata." })
            return
        }

        let adminuser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (adminuser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        if (adminuser.JogosultsagId < 2) {
            res.status(404).send({ error: "Nincs joga más adatainak a frissítéséhez!" })
            return
        }

        let olduser = await User.loadDataFromDB(req.params.UserId)

        if (!olduser) {
            res.status(500).send({ error: 'A felhasználó nem létezik' })
            return
        }
        
        let user = olduser
        
        if(req.body.Jelszo !== undefined){
            let IsPasswordValid = Functions.IsPasswordValid(req.body.Jelszo)
            if (IsPasswordValid != "") {
                res.status(400).send({ error: IsPasswordValid })
                return
            }
            req.body.Jelszo = crypto.createHash('sha256').update(req.body.Jelszo).digest('hex');
        }
        
        if(req.body.FelhasznaloNev !== undefined){
            let IsUsernameValid = Functions.IsUsernameValid(req.body.FelhasznaloNev);
            if (IsUsernameValid != "") {
                res.status(400).send({ error: IsUsernameValid })
                return
            }
        }

        if(req.body.Email !== undefined){
            let IsEmailValid = Functions.checkEmail(req.body.Email);
            if (IsEmailValid != "") {
                res.status(400).send({ error: IsEmailValid })
                return
            }
        }

        Object.assign(user, req.body)
        const [rows3] = await conn.execute('Update Felhasznalok set FelhasznaloNev =?,Email=?, Jelszo=?, Statusz=? where FelhasznaloId =?', [user.FelhasznaloNev, user.Email, user.Jelszo, user.statusz, req.params.UserId])
        user.Jelszo = undefined
        if (rows3.affectedRows > 0) {
            res.status(201).send({ success: "Sikeres frissítés", data: user })
            return
        }
        res.status(404).send({ error: "Sikertelen az adatok frissítése!" })
    }
    catch (err) {
        switch (err.errno) {
            case 1062: 
                res.status(500).send({ error: "Már létező felhasználó." }); 
                break;
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}


export async function deleteUserByIdAdmin(req, res) {
    if (!req.params.UserId) {
        res.status(401).send({ error: "Hiányzó felhasználó azonosító" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    try {
        let adminuser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (adminuser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        if (adminuser.JogosultsagId != 3) {
            res.status(404).send({ error: "Nincs joga más adatainak a törléséhez!" })
            return
        }
        let user = await User.loadDataFromDB(req.params.UserId)
        if (!user) {
            res.status(500).send({ error: 'A felhasználó nem létezik' })
            return
        }

        const [rows] = await conn.execute('DELETE from Felhasznalok where FelhasznaloId =?', [req.params.UserId])

        if (rows.affectedRows > 0) {
            res.status(201).send({ success: "Sikeres törlés", data: user })
            return
        }
        res.status(404).send({ error: "Sikertelen a felhasználó törlése." })
    }
    catch (err) {
        switch (err.errno) {
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}
export async function getUserByIdAdmin(req, res) {
    if (!req.params.UserId) {
        res.status(401).send({ error: "Hiányzó felhasználó azonosító" })
        return
    }
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        let adminuser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (adminuser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        if (adminuser.JogosultsagId < 2) {
            res.status(404).send({ error: "Nincs joga más adatainak a megtekintéséhez!" })
            return
        }
        let user = await User.loadDataFromDB(req.params.UserId)
        if (!user) {
            res.status(500).send({ error: 'A felhasználó nem létezik' })
            return
        }

        res.status(200).send({ success: "Sikeres lekérdezés", data: user })
    }
    catch (err) {
        switch (err.errno) {
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}

export async function getUsersAdmin(req, res) {
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        let adminuser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (adminuser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        if (adminuser.JogosultsagId < 2) {
            res.status(404).send({ error: "Nincs joga más adatainak a megtekintéséhez!" })
            return
        }

        const [rows2] = await conn.execute('Select FelhasznaloId,FelhasznaloNev,Email from Felhasznalok')
        let users = rows2
        if (!users) {
            res.status(500).send({ error: 'Sikertelen lekérdezés' })
            return
        }
        res.status(200).send({ success: "Sikeres lekérdezés", data: users })
    }
    catch (err) {
        switch (err.errno) {
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}