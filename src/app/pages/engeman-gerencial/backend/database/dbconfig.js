const config = {
   user: 'sa',
   password: 'sa',
   server: '10.30.0.251',
   database: 'ENGEMAN',
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