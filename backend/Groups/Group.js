import dbConfig from '../app/config.js'
import mysqlP from 'mysql2/promise'

export class Group{
    Tulajdonos;
    CsoportNev;

    static async LoadDataFromDB(CsoportId){
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            if(CsoportId !== undefined ){
                const [rows] = await conn.execute('Select * from Csoportok where CsoportId = ?', [CsoportId])
                return rows[0]
            }
            return undefined
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