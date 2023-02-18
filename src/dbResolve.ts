import * as mssql from "mssql";
import { mssqlConnection } from "./db/mssqldb";
import { neo4jSession } from "./db/neodb";
import type { ConstellationData, StarData, Connection } from "./types";
async function getStarCustomInfo(starId: string): Promise<{GivenName:string|undefined,Username:string|undefined}> {
    const connection = await mssqlConnection();
    const request = await new mssql.Request(connection)
        .input("StarId", mssql.VarChar(50), starId)
        .query(
        "SELECT ds.GivenName,u.Username FROM DiscoveredStars ds INNER JOIN Users u ON ds.UserId = u.Id WHERE @StarId=ds.Id"
    );
    console.log("custom info:"+request.recordset);
    console.log(request.recordset);
    if(request)
        return request.recordset[0];
    return {GivenName:undefined,Username:undefined};
}

async function addStarToDiscoveries(username:string,designatedName:string,givenName:string,starId:string) {
    console.log("dobavamq zvezda");
    const connection = await mssqlConnection();
    console.log(starId);
    const sqlReq = new mssql.Request(connection)
      .input('Username',username)
      .input('StarName',designatedName)
      .input('GivenName',givenName)
      .input('Id',starId)
      .execute("InsertStar");
}

function getStarUploadQuery(star:StarData) {
    return `
    MERGE (:Star { 
        id: ${star.id},
        rightAscencion: ${star.rightAscencion},
        declination: ${star.declination},
        parallax: ${star.parallax},
        pseudocolor: "${star.pseudocolor}",
        mag: ${star.mag},
        coordinates:[${star.coordinates.x},${star.coordinates.y},${star.coordinates.z}],
        discoverer: ${star.discoverer ? `"${star.discoverer}"` : '"None"'},
        scientificName: ${star.scientificName ? `"${star.scientificName}"` : 'null'},
        givenName: ${star.givenName ? `"${star.givenName}"` : '"None"'}
    })`;
}

async function uploadConstellation(constellation:ConstellationData) {
    const driver = neo4jSession();
    const session = driver.session({ database: 'neo4j' });
    let query: string;
    for(const connection of constellation.connections) {
        query = getStarUploadQuery(connection.startingStar as StarData);
        await session.executeWrite((tx) => tx.run(query));
        query = getStarUploadQuery(connection.endingStar as StarData);
        await session.executeWrite((tx) => tx.run(query));
        query = `MATCH
                    (a:Star),
                    (b:Star)
                WHERE a.id = ${connection.startingStar?.id} AND b.id = ${connection.endingStar?.id}
                CREATE (a)-[r:CONNECTION {constellationId: '${constellation.id}'}]->(b)`;
        await session.executeWrite((tx) => tx.run(query));
    }
    query = `
        CREATE (:Constellation {
        id: '${constellation.id}',
        name: '${constellation.name}',
        discoverer: '${constellation.discoverer}',
        viewedFromStarId: '${constellation.viewedFromStarId}'
    })`;
    await session.executeWrite((tx) => tx.run(query));
    query = `
        MATCH
            (a:Constellation {id: '${constellation.id}'}),
            (b:Star {id: ${constellation.connections[0].startingStar?.id}})
        MERGE (a)-[r:CONSTELLATION {constellationId: '${constellation.id}'}]->(b)
    `;
    await session.executeWrite((tx) => tx.run(query));
	session.close();
}

async function getConstellations(viewedFromStarId:string):Promise<ConstellationData[]> {
    const constellations:ConstellationData[] = [];
    const driver = neo4jSession();
    const session = driver.session({ database: 'neo4j' });
    let query = `
        WITH '${viewedFromStarId}' AS vfid
        MATCH (s1:Constellation)-[r: CONSTELLATION]->(s2:Star)
        WHERE s1.viewedFromStarId = vfid
        RETURN s1,r`;
    const idQueryResult = await session.executeWrite((tx) => tx.run(query));
    for(const rec of idQueryResult.records) {
        const constellationId = rec.get("s1").properties.id;
        query = `
            MATCH (s1:Constellation)-[r: CONSTELLATION]->(s2:Star)
            WHERE r.constellationId = "${constellationId}"
            RETURN s1`;
        const initialInformationResponse = await session.executeWrite((tx) => tx.run(query));
        const queryResult = initialInformationResponse.records[0].get("s1").properties;
        const constellation: ConstellationData = {
            viewedFromStarId:queryResult.viewedFromStarId,
            name:queryResult.name,
            id:queryResult.id,
            discoverer:queryResult.discoverer,
            connections:[]
        };
        query = `
            MATCH (s1:Star)-[r: CONNECTION]->(s2:Star)
            WHERE r.constellationId = "${constellationId}"
            RETURN r,s1,s2`;
        const starInformationResponse = await session.executeWrite((tx) => tx.run(query));
        for(const starRecord of starInformationResponse.records) {
            const startStar = starRecord.get("s1").properties;
            const endStar = starRecord.get("s2").properties;
            const connection:Connection = {
                startingStar: {
                    id:startStar.id,
                    rightAscencion:startStar.rightAscencion,
                    declination:startStar.declination,
                    parallax:startStar.parallax,
                    pseudocolor:startStar.pseudocolor,
                    mag:startStar.mag,
                    discoverer:startStar.discoverer,
                    scientificName:startStar.scientificName,
                    givenName:startStar.givenName,
                    coordinates: {
                        x:startStar.coordinates[0],
                        y:startStar.coordinates[1],
                        z:startStar.coordinates[2],
                    }
                },
                endingStar: {
                    id:endStar.id,
                    rightAscencion:endStar.rightAscencion,
                    declination:endStar.declination,
                    parallax:endStar.parallax,
                    pseudocolor:endStar.pseudocolor,
                    mag:endStar.mag,
                    discoverer:endStar.discoverer,
                    scientificName:endStar.scientificName,
                    givenName:endStar.givenName,
                    coordinates: {
                        x:endStar.coordinates[0],
                        y:endStar.coordinates[1],
                        z:endStar.coordinates[2],
                    }
                },
            }
            constellation.connections.push(connection);
            console.log(constellation.connections[0].startingStar)
        }
        constellations.push(constellation);
    }
    session.close();
    return constellations;
}

export { getStarCustomInfo,addStarToDiscoveries,uploadConstellation,getConstellations };