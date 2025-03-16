import { Group } from "./Group.js";
import { User } from "../user/user.js";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import dbConfig from "../app/config.js";
dotenv.config(); 

export async function getGroupById(req,res) {
    if(res.decodedToken.UserId === undefined || req.params.GroupId === undefined){
        res.status(401).send({error: "Hiányzó paraméter"});
        return;
    }
    try
    {
        let group = await Group.LoadDataFromDB(req.params.GroupId);
        if(group === undefined){
            res.status(400).send({error: "Nincs ilyen csoport"});
            return;
        }
        let user = await User.loadDataFromDB(res.decodedToken.UserId);
        if((group.Tulajdonos != res.decodedToken.UserId && user.JogosultsagId < 2) || user.Statusz === 0){
            res.status(400).send({error: "Nincs engedélye ehhez a művelethez."});
            return;
        }
        res.status(200).send({success: "Sikeres lekérdezés", data: group});
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
}
export async function getOwnedGroupsFromToken(req,res) {
    if(res.decodedToken.UserId === undefined){
        res.status(401).send({error: "Hiányzó paraméter"});
        return;
    }
    const conn = await mysql.createConnection(dbConfig);
    try
    {
        let [Groups] = await conn.execute('Select * from Csoportok where Tulajdonos = ?', [res.decodedToken.UserId]);
        if(Groups.length === 0){
            res.status(404).send({error: "Nincsenek Csoportjaid."});
            return;
        }
        res.status(200).send({success: "Sikeres lekérdezés", data: Groups});
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
    finally{
        conn.end();
    }
}

export async function getGroups(req,res) {
    if(res.decodedToken.UserId === undefined){
        res.status(401).send({error: "Hiányzó paraméter"});
        return;
    }
    const conn = await mysql.createConnection(dbConfig);
    try
    {
        let user = await User.loadDataFromDB(res.decodedToken.UserId);
        if(user.JogosultsagId < 2){
            res.status(400).send({error: "Nincs engedélye ehhez a művelethez."});
            return;
        }
        let [Groups] = await conn.execute('Select * from Csoportok');
        if(Groups.length === 0){
            res.status(400).send({error: "Nincsenek csoportok"});
            return;
        }
        res.status(200).send({success: "Sikeres lekérdezés", data: Groups});
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
}

export async function createGroup(req,res) {
    if(res.decodedToken.UserId === undefined || req.body.Name === undefined){
        res.status(401).send({error: "Hiányzó paraméter"});
        return;
    }
    const conn = await mysql.createConnection(dbConfig);
    try
    {
        let [rows] = await conn.execute('insert into Csoportok (CsoportNev, Tulajdonos) values (?,?)', [req.body.Name, res.decodedToken.UserId]);
        if([rows].affectedRows === 0){
            res.status(400).send({error: "Hiba a csoport létrehozásakor"});
            return;
        }
        res.status(200).send({success: "Csoport sikeresen létrehozva", data: rows[0]});
    }
    catch(err)
    {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó"});    
                break;
            case 1062:
                res.status(500).send({error: "Már van ilyen nevű csoportod."});
                break;
            default:
                res.status(500).send({error: "Hiba a csoport létrehozásakor: " + err});
                break;
        }
    }
    finally{
        conn.end();
    }
}

export async function UpdateGroup(req,res) {
    if(res.decodedToken.UserId === undefined || req.body.Name === undefined || req.params.GroupId === undefined){
        res.status(401).send({error: "Hiányzó paraméter"});
        return;
    }
    const conn = await mysql.createConnection(dbConfig);
    try
    {
        let group = await Group.LoadDataFromDB(req.params.GroupId);
        if(group === undefined){
            res.status(400).send({error: "Nincs ilyen csoport"});
            return;
        }
        let user = await User.loadDataFromDB(res.decodedToken.UserId);
        if((group.Tulajdonos != res.decodedToken.UserId && user.JogosultsagId < 2) || user.Statusz === 0){
            res.status(400).send({error: "Nincs engedélye ehhez a művelethez."});
            return;
        }
        let [rows] = await conn.execute('Update Csoportok SET CsoportNev = ? Where CsoportId = ?', [req.body.Name, req.params.GroupId]);
        if([rows].affectedRows === 0){
            res.status(400).send({error: "Hiba a csoport frissítésekor."});
            return;
        }
        res.status(200).send({success: "Csoport sikeresen frissítve.", data: rows[0]});
    }
    catch(err)
    {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó."});    
                break;
            case 1062:
                res.status(500).send({error: "Már van ilyen nevű csoportod."});
                break;
            default:
                res.status(500).send({error: "Hiba az adatok frissítésekor: " + err});
                break;
        }
    }
    finally{
        conn.end();
    }
}

export async function DeleteGroup(req,res) {
    if(res.decodedToken.UserId === undefined || req.params.GroupId === undefined){
        res.status(401).send({error: "Hiányzó paraméter"});
        return;
    }
    const conn = await mysql.createConnection(dbConfig);
    try
    {
        let group = await Group.LoadDataFromDB(req.params.GroupId);
        if(group === undefined){
            res.status(400).send({error: "Nincs ilyen csoport"});
            return;
        }
        let user = await User.loadDataFromDB(res.decodedToken.UserId);
        if((group.Tulajdonos != res.decodedToken.UserId && user.JogosultsagId < 3) || user.Statusz === 0){
            res.status(400).send({error: "Nincs engedélye ehhez a művelethez."});
            return;
        }
        let [rows] = await conn.execute('DELETE FROM Csoportok Where CsoportId = ?', [req.params.GroupId]);
        if([rows].affectedRows === 0){
            res.status(400).send({error: "Hiba a csoport törlésekor."});
            return;
        }
        res.status(200).send({success: "Csoport sikeresen törölve.", data: rows[0]});
    }
    catch(err)
    {
        switch(err.errno){
            case 1045:
                res.status(500).send({error: "Hiba a csatlakozáskor nem megfelelő adatbázis jelszó."});    
                break;
            default:
                res.status(500).send({error: "Hiba az adatok törlésekor: " + err});
                break;
        }
    }
    finally{
        conn.end();
    }
}