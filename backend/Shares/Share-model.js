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
        const [rows] = await conn.execute('Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`JegyzetTartalma`,`MegosztottFelhId`,`MegosztottCsopId`,`Jogosultsag` from `Jegyzetek`' +
            ' INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE `Megosztas`.`MegosztottFelhId` = ?', [res.decodedToken.UserId]);
        if (rows.length === 0) {
            res.status(400).send({ error: "Nincsenek jegyzetek" });
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
        const [rows] = await conn.execute('Select `Jegyzetek`.`JegyzetId`,`JegyzetNeve`,`JegyzetTartalma`,`MegosztottFelhId`,`MegosztottCsopId`,`Jogosultsag` from `Jegyzetek`' +
            ' INNER JOIN `Megosztas` ON `Jegyzetek`.`JegyzetId` = `Megosztas`.`JegyzetId` WHERE Jegyzetek.Feltolto = ?', [res.decodedToken.UserId]);
        if (rows.length === 0) {
            res.status(404).send({ error: "Nincsenek jegyzeteid." });
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
    if (!res.decodedToken.UserId || !req.body.JegyzetId || (!req.body.MegosztottFelhId && !req.body.MegosztottCsopId) || !req.body.Jogosultsag) {   
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
            res.status(400).send({ error: "Nem oszthatja meg a jegyzetét saját magával." });
            return;
        }
        let rows = undefined;
        if(!req.body.MegosztottCsopId){
            [rows] = await conn.execute('INSERT INTO `Megosztas` (`JegyzetId`,`MegosztottFelhId`,`Jogosultsag`) VALUES(?,?,?)', [Share.JegyzetId, Share.MegosztottFelhId, Share.Jogosultsag]);   
        }
        else if(!req.body.MegosztottFelhId){
            [rows] = await conn.execute('INSERT INTO `Megosztas` (`JegyzetId`,`MegosztottCsopId`,`Jogosultsag`) VALUES(?,?,?)', [Share.JegyzetId, Share.MegosztottCsopId, Share.Jogosultsag]);   
        }
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
                res.status(500).send({ error: "Már meg van osztva ez a jegyzet az adott felhasználóval" }); 
                break;
            default:
                res.status(500).send({ error: "Hiba a megosztáskor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}
export async function DeleteShare(req, res) {
    const conn = await mysqlP.createConnection(dbConfig);
    if (!res.decodedToken.UserId || !req.body.JegyzetId || (!req.body.MegosztottFelhId && !req.body.MegosztottCsopId)) {   
        res.status(401).send({ error: "Hiányzó paraméter" });
        return;
    }
    try
    {
        let sharedNote = await Notes.loadDataFromDB(req.body.JegyzetId);
        if (!sharedNote) {
            res.status(404).send({ error: "Nem létezik ilyen jegyzet." });
            return;
        }
        if (sharedNote.Feltolto !== res.decodedToken.UserId) {
            res.status(403).send({ error: "Nem törölheti más megosztásait." });
            return;
        }
        let rows = undefined;
        if(!req.body.MegosztottFelhId){
            [rows] = await conn.execute('DELETE FROM `Megosztas` WHERE `JegyzetId` = ? AND `MegosztottCsopId` = ?', [req.body.JegyzetId, req.body.MegosztottCsopId]);
        }
        else if(!req.body.MegosztottCsopId){
            [rows] = await conn.execute('DELETE FROM `Megosztas` WHERE `JegyzetId` = ? AND `MegosztottFelhId` = ?', [req.body.JegyzetId, req.body.MegosztottFelhId]);
        }
        if (rows.length === 0)
        {
            res.status(404).send({ error: "Nem található a megosztás" });
            return;
        }
        res.status(200).send({ success: "Sikeres törlés", data: rows

        });
    }
    catch
    {
        switch (err.errno){
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba a törléskor: " + err });
                break;
        }
    }
    finally
    {
        conn.end();
    }
}
export async function UpdateSharePermissions(req,res){
    const conn = await mysqlP.createConnection(dbConfig);
    if (!res.decodedToken.UserId || !req.body.JegyzetId || (!req.body.MegosztottFelhId && !req.body.MegosztottCsopId) || !req.body.Jogosultsag) {   
        res.status(401).send({ error: "Hiányzó paraméter" });
        return;
    }
    try
    {
        let sharedNote = await Notes.loadDataFromDB(req.body.JegyzetId);
        if (!sharedNote) {
            res.status(404).send({ error: "Nem létezik ilyen jegyzet." });
            return;
        }
        if (sharedNote.Feltolto !== res.decodedToken.UserId) {
            res.status(403).send({ error: "Nem módosíthajta más megosztásait." });
            return;
        }
        let rows = undefined;
        if(!req.body.MegosztottFelhId){
            [rows] = await conn.execute('UPDATE `Megosztas` SET `Jogosultsag` = ? WHERE `JegyzetId` = ? AND `MegosztottCsopId` = ?', [req.body.Jogosultsag, req.body.JegyzetId, req.body.MegosztottCsopId]);
        }
        else if(!req.body.MegosztottCsopId){
            [rows] = await conn.execute('UPDATE `Megosztas` SET `Jogosultsag` = ? WHERE `JegyzetId` = ? AND `MegosztottFelhId` = ?', [req.body.Jogosultsag, req.body.JegyzetId, req.body.MegosztottFelhId]);
        }
        if (rows.length === 0)
        {
            res.status(404).send({ error: "Nem található a megosztás" });
            return;
        }
        res.status(200).send({ success: "Sikeres frissítés", data: rows

        });
    }
    catch(err)
    {
        switch (err.errno){
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba a frissítéskor: " + err });
                break;
        }
    }
    finally
    {
        conn.end();
    }

}