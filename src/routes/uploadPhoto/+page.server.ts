import type { PageServerLoad, Action, Actions } from './$types';
import { mssqlConnection } from '../../db/mssqldb';
import pkg from 'mssql';
const { Request } = pkg;
import { v4 as uuidv4 } from 'uuid';
import { fail, redirect } from '@sveltejs/kit';
let username: string;

export const load: PageServerLoad = async ({ locals }) => {

	if (!locals.user) {
		throw redirect(302, 'login');
	} else {

		username = locals.user.username;


		// const dataFor3dMap="NGC 6823:295.7940 +23.3210;";
		// const res = await fetch(`http://localhost:5173/atlas/api/findStars?dataMap=${dataFor3dMap}`,{method:'POST'});
		// console.log(res.url);
		// throw redirect(303,res.url)
	}
};


async function fetchData(starNames: object) {

	let formData = "";

	let validStarNames = starNames.filter((starName: string) => {
		return starName.match(/^\w+\s+\d+.*$/g) || starName.startsWith("The star");
	});
	for (let starName in validStarNames) {

		formData += await setStarNameAndCoordinates(validStarNames[starName], formData)
	}
	return formData;
}

async function setStarNameAndCoordinates(starName: string, formData: string) {
	if (starName.startsWith("The star")) {
		starName = starName.slice("The star".length).trim();
	}
	let index = starName.indexOf("(")
	if (index !== -1) {
		starName = starName.slice(0, index)
	}
	starName = starName.replace(/ /g, "+");
	const res = await fetch("https://cds.unistra.fr/cgi-bin/nph-sesame?" + starName);
	starName = starName.replace("+", " ");
	const text = await res.text();
	const row = getDataRow(text)


	return `${starName}:${row};`
}


function getDataRow(text: string): string {
	const lines = text.split("\n");
	for (let line of lines) {
		if (line.startsWith("%J")) {
			let index = line.indexOf("=");


			return line.slice(3, index).trim();
		}
	}
	return "";
}

async function getStardataFromLink(link: string) {
	if (process.env.NOVA_KEY) {
		//get session
		const sessionKey = await fetchAstrometrySessionKey(process.env.NOVA_KEY);
		const data = await postPhotoToAstrometry(sessionKey, link);
		const jobResult = await getJobResults(data)

		if (jobResult.status === "success") {
			console.log("jobres.tags: ");
			console.log(jobResult.tags)

			if (jobResult.tags.length) {
				//post to 3d map
				console.log("found stars");


				const dataFor3dMap = await fetchData(jobResult.tags);
				console.log(dataFor3dMap);
				const res = await fetch(`http://localhost:5173/atlas/api/findStars?dataMap=${dataFor3dMap}`, { method: 'POST' });
				console.log(res.url);
				
				return res.url;

			} else {
				//no stars found
				return fail(500, { error: false, noStars: true })
			}
		} else {
			//display error 
			//ask the user to send the image again
			return fail(500, { error: true, noStars: true })
		}
	}
}

const upload: Action = async ({ request }) => {

		if (request.method === 'POST') {
			const form = await request.formData();
			const image = form.get('img') as File;
			if (image) {
				console.log(`Received file with name: ${image.name}`);
				const link = (await uploadToUmgur(image));
				console.log(link);
				if (await saveURL(link)) {
					//should go to the 3d map	
					//post query to +server.ts				
					const res = await getStardataFromLink(link);
					
					console.log();
					
					throw redirect(303,`${res}`);
				} else {
					fail(500, { error: true, noStars: false });
				}
			}
		}

};

export const actions: Actions = { upload };

async function getJobResults(jobid: string) {
	const response = await fetch(`https://nova.astrometry.net/api/jobs/${jobid}/info/`);
	return await response.json();
}

async function postPhotoToAstrometry(sessionId: string, url: string) {
	const options = {
		method: 'POST',
		body: new URLSearchParams({
			"request-json": JSON.stringify({
				session: sessionId,
				url: url,
				scale_units: 'degwidth',
				scale_lower: 0.5,
				scale_upper: 1.0,
				center_ra: 290,
				center_dec: 11,
				radius: 2.0
			})


		})
	};

	const response = await fetch('http://nova.astrometry.net/api/url_upload', options);
	const result = await response.json();

	if (result.status === 'success') {
		console.log(`Successful submission: ${result.subid} with hash ${result.hash}`);
		return result.subid;
	} else {
		console.error(result);
		return null;
	}
}


async function uploadToUmgur(file: File) {
	const buffer = Buffer.from(await file.arrayBuffer());
	const base64 = buffer.toString('base64');
	let apiUrl = 'https://api.imgur.com/3/image';
	const formData = new FormData();
	formData.append("image", base64);
	let link = "";
	await fetch(apiUrl, {
		method: "post",
		headers: {
			Authorization: "Client-ID " + process.env.CLIENT_ID
		},
		body: formData
	}).then(data => data.json()).then(data => {
		link = data.data.link;
	})
	return link;
}

async function saveURL(url: string) {

	const connection = await mssqlConnection();
	const selectRequest = new Request(connection);
	const selectResult = await selectRequest
		.input('Username', username)
		.query('SELECT Id FROM Users WHERE Username = @Username');
	const id = selectResult.recordset[0].Id;
	console.log(id);
	const insertRequest = new Request(connection);
	const insertResult = await insertRequest
		.input('Id', uuidv4())
		.input('UserId', id)
		.input('ImageURL', url)
		.query('INSERT INTO UsersImages(Id, UserId, ImageURL) VALUES(@Id, @UserId, @ImageURL)');
	return insertResult.recordset === undefined;
}


async function fetchAstrometrySessionKey(apikey: string) {
	const response = await fetch('http://nova.astrometry.net/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `request-json=${encodeURIComponent(JSON.stringify({ apikey }))}`
	});
	const data = await response.json();
	if (data.status !== 'success') {
		console.log('Could not obtain session key: ' + data.message);
	}
	return data.session;
}