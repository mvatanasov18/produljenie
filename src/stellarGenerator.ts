import type { Position } from "@threlte/core";
import type { StarData } from "./types";

class StellarGenerator {
    static get3DCoordinates = function(rightAscension: number,declination: number,parallax: number): Position {
        const theta = (90 - declination) * Math.PI / 180;
        const phi = rightAscension * Math.PI / 180;
        const d = (1 / (parallax/1000));
        const r = d;
      
        const x = r * Math.sin(theta) * Math.cos(phi);
        const z = r * Math.sin(theta) * Math.sin(phi);
        const y = r * Math.cos(theta);
      
        return {x,y,z};
    }
      
    static clamp = function(min:number,max:number,number:number):number{
          if(number>max)
            return max;
          if(number<min)
            return min;
          return number;
    }
      
    static getStarData = async function (query:string): Promise<StarData[]> {
        const urlReq = await fetch(`https://gea.esac.esa.int/tap-server/tap/async?USERNAME=${process.env.GAIA_ARCHIVE_USERNAME}&PASSWORD=${process.env.GAIA_ARCHIVE_PASSWORD}&PHASE=run&REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${query}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          }
        });
        console.log(urlReq.url);
        let res = new Response(), isRequestComplete;
        while(!isRequestComplete) {
          res = await fetch(urlReq.url+"/phase", {
            method: 'GET'
          });
          if((await res.text())==="COMPLETED")
            isRequestComplete=true;
        }
        res = await fetch(urlReq.url+"/results/result", {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        });
        
        const json = await res.json();
        const stars: StarData[] = [];
        
        for(const info of json.data) {
          const star:StarData = {id:'',rightAscencion:0,declination:0,parallax:0,pseudocolor:'',mag:0,coordinates:{x:0,y:0,z:0},discoverer:undefined,scientificName:undefined,givenName:''};
      
          star.id=info[0].toString();
          star.rightAscencion=info[1];
          star.declination=info[2];
          star.parallax=info[3];
          star.pseudocolor= '#ffff70';
          star.mag=info[5];
          star.scientificName=info[6].toString();          
          star.coordinates=StellarGenerator.get3DCoordinates(star.rightAscencion,star.declination,star.parallax);
          star.discoverer=undefined;
          star.givenName=undefined;
      
          stars.push(star);
        }
      
        return stars;
      }
      
    static determineStarRenderDistanceQuery = function(rightAscencion:number, declination:number, parallax:number) {
        let query; 
        const sizeCoefficient=1.5;
        let parallaxLowerArc = parallax/(1-(sizeCoefficient/100)*parallax);
        const parallaxHigherArc = parallax/(1+(sizeCoefficient/100)*parallax);
        const factor = parallaxHigherArc/parallaxLowerArc;
        let figureDegrees = sizeCoefficient*parallax*factor;      
              
        if(figureDegrees>90) figureDegrees=90;
      
        else if(parallax>20)
        {
          figureDegrees=30;
          parallaxLowerArc=767;
        }
        else if(parallaxLowerArc<0)
        {
          parallaxLowerArc=767;
          figureDegrees=70;
        }
              
        if(parallax>110)
          query = 'SELECT+TOP+2000+source_id,ra,dec,parallax,teff_gspphot_upper,phot_g_mean_mag,designation+FROM+gaiadr3.gaia_source+WHERE+parallax>0.1+ORDER+BY+parallax+DESC';
        else
          query = `SELECT+source_id,ra,dec,parallax,teff_gspphot_upper,phot_g_mean_mag,designation+FROM+gaiadr3.gaia_source+WHERE+1=CONTAINS(POINT(ra,dec),CIRCLE(${rightAscencion},${declination},${figureDegrees}))+AND+parallax+BETWEEN+${parallaxHigherArc}+AND+${parallaxLowerArc}`;
        return query;
    }
}

export {StellarGenerator};