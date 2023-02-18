import type { Handle } from "@sveltejs/kit";
import { mssqlConnection } from './db/mssqldb';
import { Request } from 'mssql';

export const handle:Handle = async ({event, resolve})=>{

    
    const session =event.cookies.get('session');
    if(!session){
        return await resolve(event);
    }
    const connection = await mssqlConnection();

	const requestDB = new Request(connection);
    const result = await requestDB
    .input('UserAuthToken',session)
    .query("SELECT Username FROM Users WHERE UserAuthToken=@UserAuthToken");
    
    const username=result.recordset[0].Username;
    
    if(typeof username=='string' ){
        
    if(username){
        event.locals.user={
            username:username
        }
    }

    }
    
    return await resolve(event);
}
