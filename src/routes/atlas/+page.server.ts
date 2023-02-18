import type { Actions } from "@sveltejs/kit";
import { StellarGenerator } from "../../stellarGenerator";
import type { ConstellationData } from "src/types";
import {addStarToDiscoveries, uploadConstellation} from '../../dbResolve'
import type { PageServerLoad } from "./$types";
import { generateUUID } from "three/src/math/MathUtils";

export const actions: Actions = {
  async find({ request }) {
    const req = await request.formData();
    const rightAscencion = req.get('ra');
    const declination = req.get('dec');
    const query = `SELECT+TOP+1+source_id,ra,dec,parallax,COALESCE(nu_eff_used_in_astrometry,pseudocolour)+AS+tmp,phot_g_mean_mag,designation+FROM+gaiadr3.gaia_source+WHERE+ra=${rightAscencion}+AND+dec=${declination}`;
    const star = (await StellarGenerator.getStarData(query))[0];
    if(star)
      return {success: true,star:star};
    return {success:false};
  },

  async discoverStar({request, locals}) {
    const res = await request.formData();
    const designatedName = res.get('designatedName') as string;
    const givenName = res.get('givenName') as string;
    const starId = res.get('starId') as string;
    await addStarToDiscoveries(locals.user.username,designatedName,givenName,starId);
  },

  async constellation({ request,locals }) {
    const req = await request.formData();
    const name = req.get('const-name');
    const viewedFromStarIdentifier = req.get('viewedFromStarId');
    const constellationJSON = req.get('const-connections');
    const constellation: ConstellationData = JSON.parse(constellationJSON as string);
    constellation.name = name as string;
    constellation.discoverer =  locals.user.username;
    constellation.id = generateUUID()
    constellation.viewedFromStarId = viewedFromStarIdentifier as string;
    if(constellation.viewedFromStarId=='')
      constellation.viewedFromStarId='0';
    await uploadConstellation(constellation);
    return {success:true};
  }
}

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
  }
}