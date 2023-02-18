import { json, type RequestHandler } from "@sveltejs/kit";
import {getConstellations} from "./../../../../dbResolve";
import type { ConstellationData } from "src/types";

export const GET = ( async({ url }) => {
    const starId = url.searchParams.get('id') as string;
    const constellations: ConstellationData[] = await getConstellations(starId);
    return json(constellations);

}) satisfies RequestHandler;