import mysqlP from 'mysql2/promise';
import dbConfig from '../app/config.js';
import {Notes} from './Notes.js';

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
    const { JegyzetNeve, Lathatosag, JegyzetTartalma } = req.body;

    if (!JegyzetNeve || !Lathatosag|| !res.decodedToken.UserId) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }

    const conn = await mysqlP.createConnection(dbConfig);
    try {
        const [rows] = await conn.execute(
            'INSERT INTO Jegyzetek (Feltolto, JegyzetNeve, Lathatosag, JegyzetTartalma, UtolsoFrissito) VALUES (?, ?, ?, ?, ?)',
            [res.decodedToken.UserId, JegyzetNeve, Lathatosag, JegyzetTartalma, res.decodedToken.UserId]
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
        if (res.decodedToken.UserId != Note.Feltolto) {
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
            'UPDATE Jegyzetek SET JegyzetNeve = ?, Lathatosag = ?, JegyzetTartalma = ?, UtolsoFrissites = CURRENT_TIMESTAMP, UtolsoFrissito = ? WHERE JegyzetId = ?',
            [NewNote.JegyzetNeve, NewNote.Lathatosag, NewNote.JegyzetTartalma, NewNote.UtolsoFrissito, JegyzetId]
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
        if(Note.Feltolto != res.decodedToken.UserId){
            res.status(401).send({ error: "Nincs jogosultsága törölni ezt a jegyzetet." });
            return;
        }
        const [result] = await conn.execute('DELETE FROM Jegyzetek WHERE JegyzetId = ?', [JegyzetId]);
        if (result.affectedRows === 0) {
            res.status(404).send({ error: "Jegyzet nem található" });
            return;
        }
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