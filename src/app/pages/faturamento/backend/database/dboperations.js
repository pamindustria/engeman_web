const config = require('./dbconfig');
const sql = require('mssql');

// para engeman web
async function getOrdXFunc() {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT D2_FILIAL AS FILIAL, F2_DOC AS NF, F2_CLIENTE AS CODIGO, A1_NREDUZ AS CLIENTE, D2_COD AS PRODUTO, B1_DESC AS DESCRICAO,
         F2_XPLACA AS PLACA, F2_XLACRE AS LACRE, D2_QUANT AS QTDE, D2_TES AS TES, F4_DUPLIC AS FINANCEIRO FROM SF2050 AS SF2
         INNER JOIN SD2050 ON (SD2050.D_E_L_E_T_='' AND F2_FILIAL=D2_FILIAL AND F2_DOC=D2_DOC AND F2_CLIENTE=D2_CLIENTE AND F2_LOJA=D2_LOJA)
         INNER JOIN SA1050 ON (SA1050.D_E_L_E_T_='' AND A1_COD=F2_CLIENTE AND A1_LOJA=F2_LOJA)
         INNER JOIN SB1050 ON (SB1050.D_E_L_E_T_='' AND B1_COD=D2_COD)
         INNER JOIN SF4050 ON (SF4050.D_E_L_E_T_='' AND F4_CODIGO=D2_TES AND F4_DUPLIC='S') AND D2_FILIAL=F4_FILIAL
         AND F2_EMISSAO='20220504'
         ORDER BY F2_DOC`
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