import mysqlP from 'mysql2/promise';
import { User } from '../user/user.js';
import dbConfig from '../app/config.js';
import { Notes } from './Notes.js';
import { Shared } from '../Shares/Share.js';
import dotenv from 'dotenv';
import * as fs from "fs"
import { uploadFile } from './upload.js';
import { GroupMembers } from '../GroupMembers/GroupMember.js';
import { Group } from '../groups/Group.js';
import { Functions } from '../app/functions.js';
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

export async function saveNoteWithToken(req, res) {
    await uploadFile(req, res);
    const { Lathatosag } = req.body;
    const JegyzetNeve = req.file.filename;

    if (!JegyzetNeve || !Lathatosag || !res.decodedToken.UserId || !req.file) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }

    const conn = await mysqlP.createConnection(dbConfig);

    try 
    {
        let rows = undefined;
        let JegyzetId = req.params.JegyzetId;
        if (JegyzetId === 'undefined') {
            JegyzetId = undefined;
        }

        if (JegyzetId !== undefined) 
        {
            let NewNoteName = req.file.filename;
            let OldNote = await Notes.loadDataFromDB(JegyzetId);
            if (!OldNote) {
                res.status(404).send({ error: "A jegyzet nem található" });
                Functions.cleanUpFile(NewNoteName);
                return;
            }

            let ShareWithRequestingUser = await Shared.CheckIfNoteIsSharedWithUser(JegyzetId, res.decodedToken.UserId);
            if (ShareWithRequestingUser !== undefined && OldNote.Feltolto != res.decodedToken.UserId) {
                if (!ShareWithRequestingUser.Jogosultsag.includes('W')) {
                    res.status(401).send({ error: 'Nincs joga frissíteni ezt a jegyzetet.' })
                    Functions.cleanUpFile(NewNoteName);
                    return;
                }
            }

            Functions.cleanUpFile(OldNote.JegyzetNeve);
            let NewNote = OldNote;
            Object.assign(NewNote, req.body);
            [rows] = await conn.execute(
                'UPDATE Jegyzetek SET JegyzetNeve = ?, Lathatosag = ?, UtolsoFrissites = CURRENT_TIMESTAMP, UtolsoFrissito = ? WHERE JegyzetId = ?',
                [JegyzetNeve, NewNote.Lathatosag, res.decodedToken.UserId, JegyzetId]
            );
        }
        else 
        {
            [rows] = await conn.execute(
                'INSERT INTO Jegyzetek (Feltolto, Lathatosag, JegyzetNeve, UtolsoFrissito) VALUES (?, ?, ?, ?)',
                [res.decodedToken.UserId, Lathatosag, JegyzetNeve, res.decodedToken.UserId]
            );
        }

        if (rows.affectedRows === 0) 
        {
            res.status(500).send({ error: "Hiba a jegyzet mentésekor" });
            return;
        }
        res.status(201).send({ success: "Jegyzet sikeresn mentve", id: JegyzetId ?? rows.insertId });
    } 
    catch (err) 
    {
        if (req.file) 
        {
            Functions.cleanUpFile(req.file.filename);
        }
        switch (err.errno) 
        {
            case 1045:
                res.status(500).send({ error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó" });
                break;
            default:
                res.status(500).send({ error: "Hiba a jegyzet mentésekor: " + err });
                break;
        }
    } 
    finally 
    {
        conn.end();
    }
}

export async function getNoteById(req, res) {
    const { JegyzetId } = req.params;
    if (!res.decodedToken.UserId || !JegyzetId) {
        res.status(400).send({ error: "Hiányzó paraméterek" });
        return;
    }
    const conn = await mysqlP.createConnection(dbConfig);
    try {
        let Note = await Notes.loadDataFromDB(JegyzetId);
        if (!Note) {
            res.status(404).send({ error: "Jegyzet nem található." });
            return;
        }

        let requestingUser = await User.loadDataFromDB(res.decodedToken.UserId)
        if (requestingUser.statusz == 0) {
            res.status(401).send({ error: "Fiókja blokkolva van" })
            return
        }
        let DoesUserHaveAccess = await Shared.CheckIfNoteIsSharedWithUser(JegyzetId, res.decodedToken.UserId);

        let UserGroups = await GroupMembers.GetGroupsByMemberId(res.decodedToken.UserId);
        if (UserGroups !== undefined) {
            for (const Group of UserGroups) {
                let Access = await Shared.CheckIfNoteIsSharedWithGroup(JegyzetId, Group.CsoportId);
                if (Access !== undefined) {
                    DoesUserHaveAccess = true;
                }
            }
        }

        if (res.decodedToken.UserId != Note.Feltolto && Note.Lathatosag != 1 && requestingUser.JogosultsagId < 3 && !DoesUserHaveAccess) {
            res.status(401).send({ error: "Nincs jogosultága megnézni ezt a jegyzetet." })
            return
        }

        if (!Note) {
            res.status(404).send({ error: "Jegyzet nem található." });
            return;
        }
        const uploadDir = process.env.UPLOAD_DIR_NAME || 'Notes/uploads/';
        const filePath = process.cwd() + uploadDir + Note.JegyzetNeve;
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(500).send({ error: "Hiba a fájl lekérdezésekor: " + err });
            }
        })
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

        if (Note.Feltolto != res.decodedToken.UserId && deletingUser.JogosultsagId < 3) {
            res.status(401).send({ error: "Nincs jogosultsága törölni ezt a jegyzetet." });
            return;
        }

        const [result] = await conn.execute('DELETE FROM Jegyzetek WHERE JegyzetId = ?', [JegyzetId]);
        if (result.affectedRows === 0) {
            res.status(404).send({ error: "Jegyzet nem található" });
            return;
        }
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
        if (notes.length === 0) {
            res.status(404).send({ error: "Nincs ilyen nevű jegyzet" })
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