import mysqlP from 'mysql2/promise'
import dbConfig from '../app/config.js'

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
            console.log(err)
            return undefined
        }
        finally {
            conn.end()
    }
    }
}