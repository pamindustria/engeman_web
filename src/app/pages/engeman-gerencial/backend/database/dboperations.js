const config = require('./dbconfig');
const sql = require('mssql');

// para engeman web

async function getOrdXFunc() {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT upper(func.NOME) NomeFunc, func.TAG codfun, ordfun.DATHORINI DataIni, ordfun.DATHORFIM DataFim, ORDSERV.TAG OS,
         upper(cast(ORDSERV.Obs as varchar(500))) Obs, Case when ordfun.DATHORFIM is null then 1 else 2 end XX,
         Upper(APLIC.DESCRICAO) APLICDescr
         FROM engeman.ORDXFUN ordfun
         inner join engeman.FUNC func on(ordfun.codfun = func.codfun)
         INNER JOIN engeman.ORDSERV ORDSERV on(ordfun.CODORD = ORDSERV.CODORD)
         INNER JOIN engeman.APLIC APLIC ON(ORDSERV.CODAPL = APLIC.CODAPL)
         ORDER BY XX, ordfun.DATHORINI DESC`
      )

      return func;
   } catch (error) {
      console.log('Erro ao fazer select no OrdXFunc');
      console.log(error);
   }
}

// para engeman app
async function getOrdServ(codigo) {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT [CODEMP], [CODORD] FROM [ENGEMAN].[ORDSERV] WHERE CODORD = '${codigo}'`
      )

      return func;
   } catch (error) {
      console.log('Erro ao fazer select no OrdServ');
      console.log(error);
   }
}

async function getFunc(tag) {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT [CODFUN], [TAG], [NOME] FROM [ENGEMAN].[FUNC] WHERE TAG = '${tag}'`
      )

      return func;
   } catch (error) {
      console.log('Erro ao fazer select no Func');
      console.log(error);
   }
}

module.exports = {
   getOrdXFunc: getOrdXFunc, 
   getOrdServ: getOrdServ,
   getFunc: getFunc,
};