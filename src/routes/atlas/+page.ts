import type { ConstellationData, StarData } from 'src/types';
import type { PageLoad } from './$types';

export const load =  ( async ({url,data}) => {
  const ids = url.searchParams.get("ids") as string;
  // const idArr:string[] = JSON.parse(ids);
  const idArr = ['2270245431206496300'];
  if(idArr) {
    console.log("OH THE MISRY");
    const ra = Number(url.searchParams.get("ra"));
    const dec = Number(url.searchParams.get("dec"));
    const p = Number(url.searchParams.get("p"));
    const res = await fetch(`http://localhost:5173/atlas/api/getStars?isInitial=false&ra=${ra}&dec=${dec}&p=${p}`,{method:'GET'});
    const constellationRes = await fetch(`http://localhost:5173/atlas/api/getConstellations?id=${idArr[0]}`,{method:'GET'});
    const stars: StarData[] = await res.json();
    const constellations:ConstellationData[] = await constellationRes.json();
    console.log(stars[0].id);
    console.log(idArr[0]);
    const mainStar = stars.find(s=>s.id==idArr[0]);
    stars.map(s=>{
      if(idArr.includes(s.id))
        s.pseudocolor="#ff0000";
    });

    return {stars,constellations,user:data.user,isFromImage:true,mainStar,ids:idArr};
  } else {
    const res = await fetch(`http://localhost:5173/atlas/api/getStars?isInitial=true`,{method:'GET'});
    const constellationRes = await fetch(`http://localhost:5173/atlas/api/getConstellations?id=0`,{method:'GET'});
    const stars: StarData[] = await res.json();
    const constellations:ConstellationData[] = await constellationRes.json();
    console.log(constellations[0].connections[0].startingStar?.coordinates);
    return {stars,constellations,user:data.user};
  }

  
  
}) satisfies PageLoad;