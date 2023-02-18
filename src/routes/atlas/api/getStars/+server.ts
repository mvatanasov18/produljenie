import { json, type RequestHandler } from "@sveltejs/kit";
import { StellarGenerator } from "../../../../stellarGenerator";
import * as dotenv from "dotenv";
import {getStarCustomInfo} from "./../../../../dbResolve";
dotenv.config();

export const GET = ( async({ url }) => {
    const isInitial = url.searchParams.get('isInitial') as string;

    if(isInitial==='true')
    {
      const stars = await StellarGenerator.getStarData('SELECT+TOP+2000+source_id,ra,dec,parallax,COALESCE(nu_eff_used_in_astrometry,pseudocolour)+AS+tmp,phot_g_mean_mag,designation+FROM+gaiadr3.gaia_source+WHERE+parallax>0.1+ORDER+BY+parallax+DESC');
      return json(stars);
    }
    const rightAscencion = Number(url.searchParams.get('ra') as string);
    const declination = Number(url.searchParams.get('dec') as string);
    const parallax = Number(url.searchParams.get('p') as string);
    const query = StellarGenerator.determineStarRenderDistanceQuery(rightAscencion,declination,parallax);

    const stars = await StellarGenerator.getStarData(query);
    const targetStar = stars.filter(s=>s.rightAscencion==rightAscencion&&s.declination==declination)[0];
    const targetStarIndex = stars.indexOf(targetStar);
    const customInfo =  await getStarCustomInfo(stars[targetStarIndex].id);
    if(customInfo) {
      stars[targetStarIndex].discoverer=customInfo.Username;
      stars[targetStarIndex].givenName=customInfo.GivenName;
    }
    return json(stars);

}) satisfies RequestHandler;