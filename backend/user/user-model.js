import mysqlP from 'mysql2/promise'
import dbConfig from '../app/config.js'
import checkInput from '../app/functions.js'
import {User} from './user.js'

export async function Register(req, res) {
    const user = req.body
    if (!user.Email || !user.FelhasznaloNev || !user.Jelszo) {
        res.status(400).send({ error: "Hiányzó adatok" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        if (!checkInput(user.Email) || !checkInput(user.FelhasznaloNev) || !checkInput(user.Jelszo)) {
            res.status(404).send({ error: "Nem megengedett karakterek használata." })
            return
        }

        if (user.Jelszo.length < 8) {
            res.status(404).send({ error: "túl rövid a jelszó minimum hossz: 8!" })
            return
        }
        if (user.FelhasznaloNev.length < 5) {
            res.status(404).send({ error: "túl rövid a felhasználó név minimum hossz: 5!" })
            return
        }
        if (!(/\d/.test(user.Jelszo))) {
            res.status(404).send({ error: "A jelszónak tartalmaznia kell számokat!" })
            return
        }
        if (!(/[A-Z]/.test(user.Jelszo))) {
            res.status(404).send({ error: "A jelszónak tartalmaznia kell nagy betűt!" })
            return
        }
        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(user.Email)) {
            res.status(404).send({ error: "Nem megfelelő a email formátuma." })
            return
        }
        const [rows] = await conn.execute('insert into Felhasznalok values(null,?,?,?,?,?)', [user.FelhasznaloNev, user.Jelszo, user.Email, user.Statusz, user.JogosultsagId])
        if (rows.affectedRows > 0) {
            res.status(201).send({ success: "Sikeres regisztráció", data: user })
            return
        }
        res.status(404).send({ error: "Hiba a regisztrációkor!" })
    }
    catch (err) {
        console.log();
        switch (err.errno) {
            case 1062: res.status(500).send({ error: "Már létező felhasználó " }); break;
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba a regisztrációkor" }); break;
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
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba az adatok lekérdezésekor: " + err }); break;
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
    if (!req.body) {
        res.status(404).send({ error: "Hiányzó adatok" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {
        let olduser = await User.loadDataFromDB(res.decodedToken.UserId)
        let user = olduser
        if (user.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
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
            case 1062: res.status(500).send({ error: "Már létező felhasználó " }); break;
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba az adatok frissítésekor: " + err }); break;
        }
        return
    }
    finally {
        conn.end()
    }
}

export async function updateUserByIdAdmin(req, res) {
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
            res.status(404).send({ error: "Nincs joga más adatainak a frissítéséhez!" })
            return
        }

        let olduser = await User.loadDataFromDB(req.params.UserId)
        if (!olduser) {
            res.status(500).send({ error: 'A felhasználó nem létezik' })
            return
        }
        let user = olduser
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
            case 1062: res.status(500).send({ error: "Már létező felhasználó " }); break;
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba a frissítéskor: " + err }); break;
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
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba a törléskor: " + err }); break;
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
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba az adatok lekérdezésekor: " + err }); break;
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
            case 1045: res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" }); break;
            default: res.status(500).send({ error: "Hiba a lekérdezéskor: " + err }); break;
        }
        return
    }
    finally {
        conn.end()
    }
}