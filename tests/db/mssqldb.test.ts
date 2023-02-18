import { mssqlConnection } from '../../src/db/mssqldb';
import { ConnectionPool } from 'mssql';
import pkg from 'mssql';
const { Request } = pkg;
import { v4 as uuidv4 } from 'uuid';
describe('mssqlConnection', () => {
	it('should return a valid connection', async () => {
		const connection = await mssqlConnection();
		expect(connection).toBeInstanceOf(ConnectionPool);
	});
});
describe('InsertUser procedure', () => {
	let connection: ConnectionPool;
	let id: string;

	beforeAll(async () => {
		connection = await mssqlConnection();
	});

	afterAll(async () => {
		connection.close();
	});

	it('should insert a user in the database', async () => {
		const request = new Request(connection);
		const username = 'test-user';
		const email = 'test@example.com';
		const password = 'test-password';
		const firstName = 'Test';
		const lastName = 'User';
		const uuid = uuidv4();
		const result = await request
			.input('Id', uuid)
			.input('Username', username)
			.input('Email', email)
			.input('Password', password)
			.input('FirstName', firstName)
			.input('LastName', lastName)
			.input('UserAuthToken', uuid)
			.execute('InsertUser');

		expect(result.returnValue).toEqual(0);

		const selectRequest = new Request(connection);
		const selectResult = await selectRequest
			.input('Username', username)
			.query(
				'SELECT Username, Email, FirstName, LastName, UserAuthToken FROM Users WHERE Username = @Username'
			);

		expect(selectResult.recordset[0].Username).toEqual(username);
		expect(selectResult.recordset[0].Email).toEqual(email);
		expect(selectResult.recordset[0].FirstName).toEqual(firstName);
		expect(selectResult.recordset[0].LastName).toEqual(lastName);
		expect(selectResult.recordset[0].UserAuthToken).toEqual(uuid);
	});

	it('should get the id of the user', async () => {
		const username = 'test-user';
		const selectRequest = new Request(connection);
		const selectResult = await selectRequest
			.input('Username', username)
			.query('SELECT Id FROM Users WHERE Username = @Username');
		console.log(selectResult.recordset[0].Id);
		id = selectResult.recordset[0].Id;
	});
	it('should insert record to UsersImages', async () => {
		const insertRequest = new Request(connection);
		const uuid = uuidv4();
		const url = 'https://i.imgur.com/Q5i9bmX.jpg';
		const insertResult = await insertRequest
			.input('Id', uuid)
			.input('UserId', id)
			.input('ImageURL', url)
			.query('INSERT INTO UsersImages(Id, UserId, ImageURL) VALUES(@Id, @UserId, @ImageURL)');

      console.log(insertResult)
    expect(insertResult.recordset).toEqual(undefined)
		const selectRequest = new Request(connection);
		const selectResult = await selectRequest
			.input('Id', uuid)
			.query('SELECT Id, UserId, ImageURL FROM UsersImages WHERE Id = @Id');
		expect(selectResult.recordset[0].Id).toEqual(uuid);
		expect(selectResult.recordset[0].UserId).toEqual(id);
		expect(selectResult.recordset[0].ImageURL).toEqual(url);
	});

	it('should delete the created record', async () => {
		const deleteRequest = new Request(connection);
		const deleteResult = await deleteRequest
			.input('UserId', id)
			.query('DELETE FROM UsersImages WHERE UserId = @UserId');
	});

	it('should delete the inserted user', async () => {
		const username = 'test-user';
		const deleteRequest = new Request(connection);
		const deleteResult = await deleteRequest
			.input('Username', username)
			.query('DELETE FROM Users WHERE Username = @Username');
	});
});
