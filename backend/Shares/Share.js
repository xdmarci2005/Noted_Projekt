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
            console.log(err)
            return undefined
        }
        finally {
            conn.end()
        }
    }
}