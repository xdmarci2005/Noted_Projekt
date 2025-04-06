import mysqlP from 'mysql2/promise';
import { User } from '../user/user.js';
import dbConfig from '../app/config.js';
import {Notes} from './Notes.js';
import dotenv from 'dotenv';
import * as fs from "fs"
import {uploadFile} from './upload.js';
dotenv.config();

export async function getNotesFromToken(req, res) {
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        const [rows] = await conn.execute('SELECT * FROM Jegyzetek WHERE Feltolto = ?', [res.decodedToken.UserId]);
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

export async function createNoteWithToken(req, res) {
    await uploadFile(req, res); 
    const { Lathatosag } = req.body;
    const JegyzetNeve = req.file.filename;

    if (!JegyzetNeve || !Lathatosag || !res.decodedToken.UserId || !req.file) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }

    const conn = await mysqlP.createConnection(dbConfig);
    try {
        const [rows] = await conn.execute(
            'INSERT INTO Jegyzetek (Feltolto, Lathatosag, JegyzetNeve, UtolsoFrissito) VALUES (?, ?, ?, ?)',
            [res.decodedToken.UserId, Lathatosag, JegyzetNeve, res.decodedToken.UserId]
        );
        res.status(201).send({ success: "Jegyzet létrehozva", id: rows.insertId });
    } catch (err) {
        switch (err.errno) {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba a jegyzet létrehozásakor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}

export async function getNoteById(req, res) {
    const { JegyzetId } = req.params;
    if (!res.decodedToken.UserId) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        let Note = await Notes.loadDataFromDB(JegyzetId);
        let requestingUser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (requestingUser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        if (res.decodedToken.UserId != Note.Feltolto && Note.Lathatosag != 1 && requestingUser.JogosultsagId < 3) {
            res.status(401).send({ error: "Nincs jogosultága megnézni ezt a jegyzetet." })
            return
        }
        if (!Note) {
            res.status(404).send({ error: "Jegyzet nem található." });
            return;
        }
        res.status(200).send({ success: "Sikeres lekérdezés", data: Note });
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

export async function updateNoteById(req, res) {
    const { JegyzetId } = req.params;
    if (!res.decodedToken.UserId || req.body.length === 0 || req.params.length === 0) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        let OldNote = await Notes.loadDataFromDB(JegyzetId);
        if (!OldNote) {
            res.status(404).send({ error: "A jegyzet nem található" });
            return;
        }
        if (res.decodedToken.UserId != OldNote.Feltolto) {
            res.status(401).send({ error: "Nincs jogosultága frissíteni ezt a jegyzetet." })
            return
        }
        let NewNote = OldNote;
        Object.assign(NewNote, req.body);
        const [result] = await conn.execute(
            'UPDATE Jegyzetek SET JegyzetNeve = ?, Lathatosag = ?, UtolsoFrissites = CURRENT_TIMESTAMP, UtolsoFrissito = ? WHERE JegyzetId = ?',
            [NewNote.JegyzetNeve, NewNote.Lathatosag, NewNote.UtolsoFrissito, JegyzetId]
        );
        if (result.affectedRows === 0) {
            res.status(404).send({ error: "Hiba a jegyzet frissítésekor" });
            return;
        }
        res.status(200).send({ success: "Jegyzet frissítve" });
    } catch (err) {
        switch (err.errno) {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba a jegyzet frissítésekor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}

export async function deleteNoteById(req, res) {
    const { JegyzetId } = req.params;
    if (!res.decodedToken.UserId) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        let Note = await Notes.loadDataFromDB(JegyzetId);
        const deletingUser = await User.loadDataFromDB(res.decodedToken.UserId);
        if (!Note) {
            res.status(404).send({ error: "A jegyzet nem található" });
            return;
        }
        
        if(Note.Feltolto != res.decodedToken.UserId && deletingUser.JogosultsagId < 3) {
            res.status(401).send({ error: "Nincs jogosultsága törölni ezt a jegyzetet." });
            return;
        }

        const [result] = await conn.execute('DELETE FROM Jegyzetek WHERE JegyzetId = ?', [JegyzetId]);
        if (result.affectedRows === 0) {
            res.status(404).send({ error: "Jegyzet nem található" });
            return;
        }
        console.log(process.cwd() + process.env.UPLOAD_DIR_NAME + Note.JegyzetNeve);
        fs.unlink(process.cwd() + process.env.UPLOAD_DIR_NAME + Note.JegyzetNeve, (err) => {
            if (err) {
              console.error(`Error removing file: ${err}`);
              return;
            }
        })
        res.status(200).send({ success: "Jegyzet törölve" });
    } catch (err) {
        switch (err.errno) {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba a jegyzet törlésekor: " + err });
                break;
        }
    } finally {
        conn.end();
    }
}

export async function getPublicNotesByName(req, res) {
    if (!req.params.Name) {
        res.status(401).send({ error: "Hiányzó jegyzet név" })
        return
    }
    if (!res.decodedToken.UserId) {
        res.status(401).send({ error: "Hiányzó paraméter" })
        return
    }
    const conn = await mysqlP.createConnection(dbConfig)
    try {

        let requestingUser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (requestingUser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        let jegyzetNev = '%' + req.params.Name + '%'
        const [rows] = await conn.execute("SELECT `JegyzetId`, `JegyzetNeve`, Feltolto from `Jegyzetek` WHERE `JegyzetNeve` LIKE ? AND `Lathatosag` = 1 AND `Feltolto` != ?", [jegyzetNev, res.decodedToken.UserId]);

        let notes = rows
        if (!notes) {
            res.status(500).send({ error: 'Sikertelen lekérdezés' })
            return
        }
        res.status(200).send({ success: "Sikeres lekérdezés", data: notes })
    }
    catch (err) {
        switch (err.errno) {
            case 1045: 
                res.status(500).send({ error: "Nem megfelelő az adatbázis jelszó." });
                break;
            default: 
                res.status(500).send({ error: "Hiba az adatok lekérdezésekor: " + err }); 
                break;
        }
        return
    }
    finally {
        conn.end()
    }
}