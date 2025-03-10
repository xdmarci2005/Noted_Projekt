import mysqlP from 'mysql2/promise'
import dbConfig from '../app/config.js'

export class User {
    FelhasznaloId
    FelhasznaloNev
    Jelszo
    Email
    Statusz
    JogosultsagId
    Token

    static async loadDataFromDB(UserId) {
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('Select * from Felhasznalok where FelhasznaloId = ?', [UserId])
            return rows[0]
        }
        catch {
            return undefined
        }
        finally {
            conn.end()
        }
    }

    static async validUser(Email, Jelszo) {
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const sql = 'select Login(?,?) as FelhasznaloId'
            const [rows] = await conn.execute(sql, [Email, Jelszo])
            return rows[0]?.FelhasznaloId || 0
        }
        catch (err) {
            console.error('Error a login közbe:', err);
            return 0;
        }
        finally {
            conn.end()
        }
    }
}
