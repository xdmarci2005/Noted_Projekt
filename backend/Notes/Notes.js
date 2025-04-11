import mysqlP from 'mysql2/promise'
import dbConfig from '../app/config.js'

export class Notes {
    JegyzetId         
    Feltolto                                   
    JegyzetNeve              
    Lathatosag
    JegyzetTartalma                  
    UtolsoFrissites
    UtolsoFrissito

    static async loadDataFromDB(JegyzetId) {
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('Select * from Jegyzetek where JegyzetId = ?', [JegyzetId])
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