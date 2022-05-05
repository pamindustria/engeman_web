const config = {
   user: 'bi_plan',
   password: 'B1P@m2021!',
   server: '10.30.0.190',
   database: 'DADOSADV',
   options: {
      encrypt: true,
      trustedconnection:  true,
      trustServerCertificate: true,
      enableArithAbort:  true,
      instancename:  'SQLEXPRESS'  // SQL Server instance name
   },
   port:  1433
}

module.exports = config;