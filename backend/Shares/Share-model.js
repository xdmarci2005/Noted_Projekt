import { Shared } from "./Share.js";
import { Notes } from "../Notes/Notes.js";
import mysqlP from 'mysql2/promise';
import dbConfig from '../app/config.js';

export async function getSharedWithUserNotesFromToken(req, res) {
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        const [rows] = await conn.execute('Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`JegyzetTartalma` from `Jegyzetek`' +
            ' INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE `Megosztas`.`MegosztottFelhId` = ?', [res.decodedToken.UserId]);
        if (rows.length === 0) {
            res.status(404).send({ error: "Nincsenek jegyzetek" });
            return;
        }
        res.status(200).send({ success: "Sikeres lekérdezés", data: rows });
    } catch (err) {
        switch (err.errno) {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba az adatok lekérdezésekor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}

export async function getSharedByUserNotesFromToken(req, res) {
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        const [rows] = await conn.execute('Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`JegyzetTartalma` from `Jegyzetek`' +
            ' INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE Jegyzetek.Feltolto = ?', [res.decodedToken.UserId]);
        if (rows.length === 0) {
            res.status(404).send({ error: "Nincsenek jegyzetek" });
            return;
        }
        res.status(200).send({ success: "Sikeres lekérdezés", data: rows });
    } catch (err) {
        switch (err.errno) {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba az adatok lekérdezésekor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}

export async function ShareNewNoteWithToken(req, res) {
    if (!res.decodedToken.UserId && !req.body.JegyzetId && (!req.body.MegosztottFelhId || !req.body.GroupSharedId)) {   
        res.status(401).send({ error: "Hiányzó paraméter" });
        return;
    }
    let Share = req.body;
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        let sharedNote = await Notes.loadDataFromDB(Share.JegyzetId);
        if (!sharedNote) {
            res.status(404).send({ error: "Nem létezik ilyen jegyzet." });
            return;
        }
        if (sharedNote.Feltolto !== res.decodedToken.UserId) {
            res.status(403).send({ error: "Nem oszthatja meg más jegyzetét." });
            return;
        }
        if (Share.MegosztottFelhId == res.decodedToken.UserId) {
            res.status(403).send({ error: "Nem oszthatja meg a jegyzetét saját magával." });
            return;
        }
        const [rows] = await conn.execute('INSERT INTO `Megosztas` (`JegyzetId`,`MegosztottFelhId`,`MegosztottCsopId`,`Jogosultsag`) VALUES(?,?,?,?)', [Share.JegyzetId, Share.MegosztottFelhId, Share.GroupSharedId, Share.Jogosultsag]);
        if (rows.length === 0) {
            res.status(404).send({ error: "Nem létezik ilyen felhasználó vagy csoport" });
            return;
        }
        res.status(200).send({ success: "Sikeres megosztás", data: rows });
    } catch (err) {
        switch (err.errno) {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            case 1062: 
                res.status(500).send({ error: "Már meg van osztva ez a jegyzet az adott felhasználóvl" }); 
                break;
            default:
                res.status(500).send({ error: "Hiba a megosztáskor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}