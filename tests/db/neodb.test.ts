import { neo4jSession } from '../../src/db/neodb';
import { Driver, Session } from 'neo4j-driver';
import type { ConstellationData, StarData } from 'src/types';
describe('neo4jSession', () => {
	let driver: Driver;

	let person1Name: string;
	let person2Name: string;

	let personName: string;

	beforeAll(async () => {
		person1Name = 'Alice';
		person2Name = 'David';
		personName = 'Alice';
		driver = await neo4jSession();
	});

	afterAll(async () => {
		driver.close();
	});

	it('should return a valid session', async () => {
		const session = await driver.session();
		expect(session).toBeInstanceOf(Session);
		session.close();
	});

	it('should create Ursa Major constellation', async () => {
		async function deleteStar(starName: string) {
			const session = driver.session({ database: 'neo4j' });
			try {
				const deleteQuery = `MATCH (s1:Star { givenName: "$starName" })
                                DETACH DELETE s1`;

				const deleteResult = await session.executeWrite((tx) => tx.run(deleteQuery, { starName }));

                console.log(deleteResult);
                
				// Check if the node is deleted
				const checkQuery = `MATCH (s1:Star { givenName: "$starName" })
                                RETURN s1`;

				const checkResult = await session.executeRead((tx) => tx.run(checkQuery, { starName }));

				expect(checkResult.records.length).toEqual(0);
			} catch (error) {
				console.error(`Something went wrong: ${error}`);
			} finally {
				await session.close();
			}
		}

		const ursaMajor: StarData[] = [
			{
				id: 1234,
				rightAscencion: 165.4606,
				declination: 56.3825,
				parallax: 0.0275,
				pseudocolor: 'blue',
				mag: 1.8,
				coordinates: { x: 10, y: 10, z: 10 },
				discoverer: undefined,
				scientificName: 'Dubhe',
				givenName: undefined
			},
			{
				id: 5678,
				rightAscencion: 166.7161,
				declination: 63.0993,
				parallax: 0.0122,
				pseudocolor: 'blue',
				mag: 2.2,
				coordinates: { x: 20, y: 20, z: 20 },
				discoverer: undefined,
				scientificName: 'Merak',
				givenName: undefined
			},
			{
				id: 9012,
				rightAscencion: 161.5722,
				declination: 58.7544,
				parallax: 0.0385,
				pseudocolor: 'blue',
				mag: 3.3,
				coordinates: { x: 30, y: 30, z: 30 },
				discoverer: undefined,
				scientificName: 'Phecda',
				givenName: undefined
			},
			{
				id: 3456,
				rightAscencion: 165.4606,
				declination: 56.3825,
				parallax: 0.0275,
				pseudocolor: 'blue',
				mag: 1.8,
				coordinates: { x: 40, y: 40, z: 40 },
				discoverer: undefined,
				scientificName: 'Megrez',
				givenName: undefined
			},
			{
				id: 7890,
				rightAscencion: 200.9819,
				declination: 54.9254,
				parallax: 0.0023,
				pseudocolor: 'blue',
				mag: 2.2,
				coordinates: { x: 50, y: 50, z: 50 },
				discoverer: undefined,
				scientificName: 'Mizar',
				givenName: undefined
			},
			{
				id: 2345,
				rightAscencion: 166.0221,
				declination: 55.9598,
				parallax: 0.0056,
				pseudocolor: 'blue',
				mag: 1.8,
				coordinates: { x: 60, y: 60, z: 60 },
				discoverer: undefined,
				scientificName: 'Alioth',
				givenName: undefined
			}
		];
		const ursaMajorData: ConstellationData = {
			name: 'Ursa Major',
			discoverer: 'Isaac Newton',
			connections: [
				{ startingStar: ursaMajor[0], endingStar: ursaMajor[3] }, // Dubhe to Megrez
				{ startingStar: ursaMajor[3], endingStar: ursaMajor[2] }, // Megrez to Phecda
				{ startingStar: ursaMajor[2], endingStar: ursaMajor[1] }, // Phecda to Merak
				{ startingStar: ursaMajor[1], endingStar: ursaMajor[0] }, // Merak to Dubhe
				{ startingStar: ursaMajor[0], endingStar: ursaMajor[4] }, // Dubhe to Mizar
				{ startingStar: ursaMajor[4], endingStar: ursaMajor[5] } // Mizar to Alioth
			],
			viewedFromStarId: 999
		};

		// for (const star of ursaMajor) {
		// 	const session = driver.session({ database: 'neo4j' });
		// 	const createStarQuery = `CREATE (:Star { 
        //               id: ${star.id},
        //               rightAscencion: ${star.rightAscencion},
        //               declination: ${star.declination},
        //               parallax: ${star.parallax},
        //               pseudocolor: "${star.pseudocolor}",
        //               mag: ${star.mag},
        //               coordinates:[${star.coordinates.x},${star.coordinates.y},${
		// 		star.coordinates.z
		// 	}],
        //               discoverer: ${star.discoverer ? `"${star.discoverer}"` : 'null'},
        //               scientificName: ${star.scientificName ? `"${star.scientificName}"` : 'null'},
        //               givenName: ${star.givenName ? `"${star.givenName}"` : 'null'}
        //             })`;
		// 	console.log(createStarQuery);

		// 	const res = await session.executeWrite((tx) => tx.run(createStarQuery));

		// 	session.close();
		// }

		//delete the constellation
		for (const star of ursaMajor) {
            console.log(star.scientificName);
            if(typeof star.scientificName==="string"){
                await deleteStar(star.scientificName);
            }
			
		}
	});

	it('should be able to create simple graph', async () => {
		const session = driver.session({ database: 'neo4j' });

		try {
			const writeQuery = `MERGE (p1:Person { name: $person1Name })
                                MERGE (p2:Person { name: $person2Name })
                                MERGE (p1)-[:KNOWS]->(p2)
                                RETURN p1, p2`;

			// Write transactions allow the driver to handle retries and transient errors.
			const writeResult = await session.executeWrite((tx) =>
				tx.run(writeQuery, { person1Name, person2Name })
			);

			// Check the write results.
			writeResult.records.forEach((record) => {
				const person1Node = record.get('p1');
				const person2Node = record.get('p2');
				console.info(
					`Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`
				);
				expect(person1Node.properties.name).toEqual(person1Name);
				expect(person2Node.properties.name).toEqual(person2Name);
			});
		} catch (error) {
			console.error(`Something went wrong: ${error}`);
		} finally {
			// Close down the session if you're not using it anymore.
			await session.close();
		}
	});

	it('should be able to search data in graph', async () => {
		const session = driver.session({ database: 'neo4j' });

		try {
			const readQuery = `MATCH (p:Person)
                            WHERE p.name = $personName
                            RETURN p.name AS name`;

			const readResult = await session.executeRead((tx) => tx.run(readQuery, { personName }));

			readResult.records.forEach((record) => {
				console.log(`Found person: ${record.get('name')}`);
				expect(record.get('name')).toEqual(personName);
			});
		} catch (error) {
			console.error(`Something went wrong: ${error}`);
		} finally {
			await session.close();
		}
	});

	it('should be able to delete the created graph', async () => {
		async function deleteNode(personName: string) {
			const session = driver.session({ database: 'neo4j' });
			try {
				const deleteQuery = `MATCH (p1:Person { name: $personName })
                                DETACH DELETE p1`;

				const deleteResult = await session.executeWrite((tx) =>
					tx.run(deleteQuery, { personName })
				);

				// Check if the node is deleted
				const checkQuery = `MATCH (p1:Person { name: $personName })
                                RETURN p1`;

				const checkResult = await session.executeRead((tx) => tx.run(checkQuery, { personName }));

				expect(checkResult.records.length).toEqual(0);
			} catch (error) {
				console.error(`Something went wrong: ${error}`);
			} finally {
				await session.close();
			}
		}

		await deleteNode(person1Name);
		await deleteNode(person2Name);
	});
});
