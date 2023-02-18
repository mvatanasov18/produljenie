
import { StellarGenerator } from "../../../../stellarGenerator";
import * as dotenv from "dotenv";
import type { RequestHandler } from "@sveltejs/kit";
dotenv.config();

export const POST = ( async({ url }) => {
    const jsonString = url.searchParams.get('dataMap');
    const mapData = JSON.parse(jsonString as string);
    // mapData.forEach(star => {
        
    // });
    // const stars = await StellarGenerator.getStarData('SELECT+TOP+2000+source_id,ra,dec,parallax,COALESCE(nu_eff_used_in_astrometry,pseudocolour)+AS+tmp,phot_g_mean_mag+FROM+gaiadr3.gaia_source+WHERE+parallax>0.1+ORDER+BY+parallax+DESC');
    // const rightAscencion = Number(url.searchParams.get('ra') as string);
    // const declination = Number(url.searchParams.get('dec') as string);
    // const parallax = Number(url.searchParams.get('p') as string);
    // const query = StellarGenerator.determineStarRenderDistanceQuery(rightAscencion,declination,parallax);
    // return json(stars);
    return new Response();
}) satisfies RequestHandler;