import mysqlP from 'mysql2/promise'
import dbConfig from '../app/config.js'

export class GroupMembers{
    CsoportId;
    TagId;
    JogosultsagId;

    static async loadDataFromDB(CsoportId, TagId) {
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('SELECT * FROM CsoportTagok WHERE CsoportId = ? AND TagId = ?', [CsoportId, TagId])
            return rows[0]
        } catch (err) {
            console.log(err)
            return undefined
        } finally {
            conn.end()
        }
    }
}