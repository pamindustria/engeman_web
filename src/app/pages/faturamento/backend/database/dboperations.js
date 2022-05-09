const config = require('./dbconfig');
const sql = require('mssql');

// para engeman web
async function getOrdXFunc() {
   try {
      let pool = await sql.connect(config);
      let func = await pool.request()
      .query(
         `SELECT D2_FILIAL AS FILIAL, F2_DOC AS NF, F2_CLIENTE AS CODIGO, A1_NREDUZ AS CLIENTE, D2_COD AS PRODUTO, B1_DESC AS DESCRICAO,
         F2_XPLACA AS PLACA, F2_XLACRE AS LACRE, D2_QUANT AS QTDE, F2_EMISSAO AS DATA, F4_DUPLIC AS FINANCEIRO FROM SF2050 AS SF2
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

module.exports = {
   getOrdXFunc: getOrdXFunc, 
};