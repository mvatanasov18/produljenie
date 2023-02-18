import type { ConstellationData, StarData } from 'src/types';
import type { PageLoad } from './$types';

export const load =  ( async () => {
  const res = await fetch(`http://localhost:5173/atlas/api/getStars?isInitial=true`,{method:'GET'});
  const constellationRes = await fetch(`http://localhost:5173/atlas/api/getConstellations?id=0`,{method:'GET'});
  const stars: StarData[] = await res.json();
  const constellations:ConstellationData[] = await constellationRes.json();
  console.log(constellations[0].connections[0].startingStar?.coordinates);
  return {stars,constellations};
  
}) satisfies PageLoad;