import type { config} from "mssql";
import pkg from 'mssql';
const { connect } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

export const mssqlConnection = () => {
  const config :config = {
    user: process.env.SQL_SERVER_USER,
    password: process.env.SQL_SERVER_PASSWORD,
    server: process.env.SQL_SERVER_HOST as string,
    database: process.env.SQL_SERVER_DATABASE_NAME,
    stream: false,
    options:{
        trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    }
  };

return connect(config);
  
};
