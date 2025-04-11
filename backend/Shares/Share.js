import mysqlP from 'mysql2/promise';
import dbConfig from '../app/config.js';

export class Shared{
    MegosztasId
    JegyzetId
    MegosztottFelhId
    MegosztottCsopId
    Jogosultsag

    static async GetShareDataFromDB(ShareId){
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('Select * from Megosztas where MegosztasId = ?', [ShareId])
            return rows[0]
        }
        catch (err){
            console.error(err)
            return undefined
        }
        finally {
            conn.end()
        }
    }
    static async CheckIfNoteIsSharedWithUser(NoteId,FelhasznaloId){
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('Select * from Megosztas where JegyzetId = ? AND MegosztottFelhId = ?', [NoteId, FelhasznaloId])
            return rows[0];
        }
        catch (err){
            console.error(err)
            return undefined
        }
        finally {
            conn.end()
        }
    }
    static async CheckIfNoteIsSharedWithGroup(NoteId,CsoportId){
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('Select * from Megosztas where JegyzetId = ? AND MegosztottCsopId = ?', [NoteId, CsoportId])
            return rows[0]
        }
        catch (err){
            console.error(err)
            return undefined
        }
        finally {
            conn.end()
        }
    }
}