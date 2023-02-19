
import { StellarGenerator } from "../../../../stellarGenerator";
import * as dotenv from "dotenv";
import { json, redirect, type RequestHandler } from "@sveltejs/kit";
dotenv.config();

export const POST = ( async({ url,locals }) => {
    console.log("AAAAAAAAAAAAAA");
    const data = url.searchParams.get('dataMap') as string;
    const starData:string[] = data.split(';');
    starData.pop();
    const recognisedGAIAStarIds:string[] = []
    for(const star of starData) {
        const coordinates = star.split(":")[1];
        const ra=Number(coordinates.split(' ')[0]);
        let dec=Number(coordinates.split(' ')[1]);
        if(dec==0)
            dec = dec=Number(coordinates.split('  ')[1]);
        const query = `SELECT+TOP+1+source_id,ra,dec,parallax,COALESCE(nu_eff_used_in_astrometry,pseudocolour)+AS+tmp,phot_g_mean_mag,designation+FROM+gaiadr3.gaia_source+WHERE+CONTAINS(POINT(ra,dec),CIRCLE(${ra},${dec},0.001388888888888889))=1`;
        const GAIAstar = (await StellarGenerator.getStarData(query))[0];
        if(GAIAstar)
            recognisedGAIAStarIds.push(GAIAstar.id);
    }
    console.log(recognisedGAIAStarIds);
    console.log("MAIKITE SA MOI: "+locals.user);
    console.log(`http://localhost:5173/atlas?ids=${JSON.stringify(recognisedGAIAStarIds)}`);
    throw redirect(302,`http://localhost:5173/atlas?ids=${JSON.stringify(recognisedGAIAStarIds)}`)
    // return new Response();
}) satisfies RequestHandler;