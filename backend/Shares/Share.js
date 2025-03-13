export class Shared{
    JegyzetId
    MegosztottFelhId
    MegosztottCsopId
    Jogosultsag

    static async GetShareDataFromDB(JegyzetId,MegosztottFelhId){
        const conn = await mysqlP.createConnection(dbConfig)
        try {
            const [rows] = await conn.execute('Select * from Megosztas where JegyzetId = ? and MegosztottFelhId = ?', [JegyzetId,MegosztottFelhId])
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