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
         `SELECT [CODEMP], [CODORD], [TAG] FROM [ENGEMAN].[ORDSERV] WHERE TAG = '${codigo}'`
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
      console.log('Erro ao fazer select no getFunc');
      console.log(error);
   }
}

async function insertOrdFunc(codOs, codFunc, dataInicio) {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `INSERT INTO [ENGEMAN].[ORDXFUN]
            ([CODEMP]
            ,[CODORD]
            ,[CODFUN]
            ,[DATHORINI]
            ,[DATHORFIM]
            ,[HEXTRA]
            ,[VENDA_HORA]
            ,[CODMOE]
            ,[PREVISTO]
            ,[DATALT]
            ,[LATITUDE]
            ,[LONGITUDE]
            ,[CODMOEXMOE]
            ,[CODMOEO]
            ,[CODMOED]
            ,[FATORX]
            ,[DATACOT]
            ,[HASH_MOBILE]
            ,[LATITUDEF]
            ,[LONGITUDEF]
            ,[ORIGEM])
         VALUES
            (${1}
            ,${codOs}
            ,${codFunc}
            ,GETDATE()
            ,null
            ,null
            ,${0}
            ,${1}
            ,'R'
            ,null
            ,null
            ,null
            ,null
            ,null
            ,null
            ,${1}
            ,null
            ,null
            ,null
            ,null
            ,null)`
      )

      return 200;
   } catch (error) {
      console.log('Erro ao inserir em ORDXFUNC');
      console.log(error);
      return 408;
   }
}

async function updateOrdFunc(codOs, tag) {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `UPDATE [ENGEMAN].[ORDXFUN]
            SET [DATHORFIM] = GETDATE()
         WHERE CODORD Like ${codOs} AND CODFUN Like ${tag}`
      )

      return 200;
   } catch (error) {
      console.log('Erro ao atualizar OS');
      console.log(error);
      return 408;
   }
}

async function getOSFunc(codOS, tag) {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT upper(func.NOME) NomeFunc, func.TURNO turno, ORDSERV.TAG OS, ordfun.CODFUN codFun, ORDSERV.CODORD codord
         FROM engeman.ORDXFUN ordfun
         inner join engeman.FUNC func on(ordfun.codfun = func.codfun)
         INNER JOIN engeman.ORDSERV ORDSERV on(ordfun.CODORD = ORDSERV.CODORD)
		   WHERE ORDSERV.TAG Like '${codOS}' AND func.TAG Like '${tag}' AND ordfun.DATHORFIM IS NULL
         ORDER BY func.NOME DESC`
      )

      return func;
   } catch (error) {
      console.log('Erro ao fazer select dos funcionarios na OS');
      console.log(error);
      return error;
   }
}

async function countFuncNaOS(codOs) {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT COUNT(*) as Count FROM [ENGEMAN].[ORDXFUN] WHERE CODORD Like ${codOs} AND DATHORFIM IS NULL`
      )

      return func;
   } catch (error) {
      console.log('Erro ao contar Funcionarios na OS');
      console.log(error);
      return 408;
   }
}

module.exports = {
   getOrdXFunc: getOrdXFunc, 
   getOrdServ: getOrdServ,
   getFunc: getFunc,
   insertOrdFunc: insertOrdFunc,
   updateOrdFunc: updateOrdFunc,
   getOSFunc: getOSFunc,
   countFuncNaOS: countFuncNaOS,
};