import express from 'express';
import { GroupMembers } from './GroupMember.js';
import { Group } from '../groups/Group.js';
import dbConfig from '../app/config.js';
import mysql from "mysql2/promise";
import dotenv from 'dotenv';
import e from 'express';
dotenv.config();

export async function getGroupsByMemberFromToken(req, res) {
    if(res.decodedToken === undefined){
        return res.status(403).json({ error: "Hiányzó token" });
    }
    const conn = await mysql.createConnection(dbConfig);
    try 
    {
        const [rows] = await conn.execute('SELECT * FROM Csoportok WHERE CsoportId IN (SELECT CsoportId FROM `CsoportTagok` WHERE TagId = ?)', [res.decodedToken.UserId]);
        if (rows.length > 0) {
            res.status(200).send({success: "Sikeres lekérdezés", data: rows});
            return;
        } 
        res.status(404).json({ error: 'Nincsnek olyan csoportok melyekben tag vagy.' });
    } 
    catch(err)
    {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó"});    
                break;
            default:
                res.status(500).send({error: "Hiba az adatok lekérdezésekor: " + err});
                break;
        }
    }
    finally 
    {
        conn.end();
    }
}

export async function addMemberToGroup(req, res) {
    if(res.decodedToken === undefined){
        return res.status(403).json({ error: "Hiányzó token" });
    }
    const { CsoportId, TagId, JogosultsagId } = req.body;
    if (!CsoportId || !TagId || !JogosultsagId) {
        return res.status(400).json({ success: "Hiányzó paraméterek" });
    }
    const conn = await mysql.createConnection(dbConfig);
    try {
        const Moderator = await GroupMembers.loadDataFromDB(CsoportId, res.decodedToken.UserId);
        if (!Moderator) {
            return res.status(404).json({ success: "Nem tagja a megadott csoportnak." });
        }
        else if (Moderator.JogosultsagId < 2) {
            return res.status(404).json({ error: "Nincs jogosultsága csoporttagokat felvenni." });
        }
        else if (2 < JogosultsagId) {
            return res.status(404).json({ error: "Nem adhat moderátorinál nagyobb jogosultságot egy tagnak." });
        }
        const [rows] = await conn.execute('INSERT INTO CsoportTagok (CsoportId, TagId, JogosultsagId) VALUES (?, ?, ?)', [CsoportId, TagId, JogosultsagId]);
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Hiba a tag felvételekor" });
        }
        res.status(201).json({ success: "Sikeres hozzáadás", data: rows });
    } 
    catch (err) {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó"});    
                break;
            case 1062:  
                res.status(500).send({error: "A felhasználó már tagja a csoportnak."});
                break;
            case 1452:
                res.status(500).send({error: "A felhasználó/jogosultság nem létezik."});
                break;
            default:
                res.status(500).send({error: "Hiba a csoport tag hozzáadásakor: " + err});
                break;
        }
    } 
    finally {
        conn.end();
    }
}

export async function updateGroupMember(req, res) {
    if(res.decodedToken === undefined) {
        return res.status(403).json({ error: "Hiányzó token" });
    }
    const { CsoportId, TagId, JogosultsagId } = req.body;
    if (!CsoportId || !TagId || !JogosultsagId) {
        return res.status(400).json({ error: "Hiányzó paraméterek" });
    }
    const conn = await mysql.createConnection(dbConfig);
    try {
        const Moderator = await GroupMembers.loadDataFromDB(CsoportId, res.decodedToken.UserId);
        const UserToUpdate = await GroupMembers.loadDataFromDB(CsoportId, TagId);
        if (!Moderator) {
            return res.status(404).json({ error: "Nem tagja a megadott csoportnak." });
        }
        else if(!UserToUpdate){
            return res.status(404).json({ error: "A frissítendő felhasználó nem tagja a megadott csoportnak." });
        }
        else if(UserToUpdate.TagId === Moderator.TagId){
            return res.status(404).json({ error: "Nem változtathatja meg a saját jogosultságait." });
        }
        else if (Moderator.JogosultsagId < 2) {
            return res.status(404).json({ error: "Nincs jogosultsága a csoporttagok adatait szerkezteni." });
        }
        else if (Moderator.JogosultsagId < UserToUpdate.JogosultsagId ){
            return res.status(404).json({ error: "Nem frissítheti a csoport tulajdonosának jogosultságait." });
        }
        const [rows] = await conn.execute('UPDATE CsoportTagok SET JogosultsagId = ? Where CsoportId = ? AND TagId = ?', [JogosultsagId, CsoportId, TagId]);
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Nincs ilyen csoporttag" });
        }
        res.status(201).json({ success: "Sikeres frissítés", data: rows });
    } 
    catch (err) {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó"});    
                break;
            default:
                res.status(500).send({error: "Hiba a csoport tag jogosultságainak módosításakor: " + err});
                break;
        }
    } 
    finally {
        conn.end();
    }
}

export async function RemoveMember(req, res) {
    if(res.decodedToken === undefined) {
        return res.status(403).json({ error: "Hiányzó token" });
    }
    const { CsoportId, TagId } = req.body;
    if (!CsoportId || !TagId) {
        return res.status(400).json({ error: "Hiányzó paraméterek" });
    }
    const conn = await mysql.createConnection(dbConfig);
    try {
        const Moderator = await GroupMembers.loadDataFromDB(CsoportId, res.decodedToken.UserId);
        const UserToUpdate = await GroupMembers.loadDataFromDB(CsoportId, TagId);
        if (!Moderator) {
            return res.status(404).json({ error: "Nem tagja a megadott csoportnak." });
        }
        else if(!UserToUpdate){
            return res.status(404).json({ error: "A törlendő felhasználó nem tagja a megadott csoportnak." });
        }
        else if (Moderator.JogosultsagId < 2) {
            return res.status(404).json({ error: "Nincs jogosultsága a csoporttagot eltávolítani a csoportból." });
        }
        else if (Moderator.JogosultsagId < UserToUpdate.JogosultsagId ){
            return res.status(404).json({ error: "Nem távoltíthatja el a csoport tulajdonosát." });
        }
        const [rows] = await conn.execute('DELETE FROM CsoportTagok Where CsoportId = ? AND TagId = ?', [CsoportId, TagId]);
        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: "Nincs ilyen csoporttag" });
        }
        res.status(201).json({ success: "Sikeres eltávolítás", data: rows });
    } 
    catch (err) {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó"});    
                break;
            default:
                res.status(500).send({error: "Hiba a csoport tag eltávolításakor: " + err});
                break;
        }
    } 
    finally {
        conn.end();
    }
}