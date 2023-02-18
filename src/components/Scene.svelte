<script lang='ts'>
    import * as THREE from 'three';
    import { OrbitControls, PerspectiveCamera, T, InstancedMesh, type Position, Pass, Group } from '@threlte/core';
    import { Environment } from '@threlte/extras';
    import Star from '../components/Star.svelte';
    import type { ConstellationData, StarData } from 'src/types';
	import { currentConstellation, isBackgroundRotating, isConstellationsVisible, isLoadingRender, targetStar} from '../stores';
    import { tweened } from 'svelte/motion';
	import HoverCursor from './HoverCursor.svelte';
	import TargetCursor from './TargetCursor.svelte';
	import Constellation from './Constellation.svelte';
    import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
	import type { PageData } from '../routes/atlas/$types';

    export let data: PageData;
    let stars: StarData[];
    let displayConstellations = false;
    let constellations: ConstellationData[];
    
    let creatableConstellation: ConstellationData = {
        id: '0',
        name:'',
        discoverer:'',
        connections:[],
        viewedFromStarId: '0'
    }

    let targetedStar: StarData = {id:'0', rightAscencion:0, declination:0, parallax:0,pseudocolor:'',mag:0, coordinates:{x:0,y:0,z:0},discoverer:undefined,scientificName:undefined,givenName:undefined};

    stars = data.stars;
    constellations = data.constellations;
    
    let tweenedOrbitControlTargetCoordinates = tweened<Position>({x:0,y:0,z:0}, {
        duration:500
    });

    let orbitControls = {
        enableDamping:true,
        enablePan:false,
        dampingFactor: 0.09,
        target: {x:0,y:0,z:0},
        autoRotate:true,
        autoRotateSpeed:0.3,
        minDistance: 0.05,
        maxDistance: 18
    }

    let camera = {
        near:1e-4,
        position: {x:1,y:1,z:1},
        lookAt: targetedStar.coordinates,
    }

    isBackgroundRotating.subscribe((val:boolean)=>{
        orbitControls.autoRotate=val;
    })

    targetStar.subscribe(async (val:StarData)=>{
        const constellationRes = await fetch(`http://localhost:5173/atlas/api/getConstellations?id=${val.id}`,{method:'GET'});
        constellations = await constellationRes.json();
        if(targetedStar.id===val.id) {
            isLoadingRender.set(false); 
            return;
        }
        if(val.coordinates.x==0&&val.coordinates.y==0&&val.coordinates.z==0) {
            const constellationRes = await fetch(`http://localhost:5173/atlas/api/getConstellations?id=0`,{method:'GET'});
            constellations = await constellationRes.json();
            targetedStar={id:'0', rightAscencion:0, declination:0, parallax:0,pseudocolor:'',mag:0, coordinates:{x:0,y:0,z:0},discoverer:undefined,scientificName:undefined,givenName:undefined};
            tweenedOrbitControlTargetCoordinates.set({x:0,y:0,z:0});
            const res = await fetch(`http://localhost:5173/atlas/api/getStars?isInitial=true`,{method:'GET'});
            stars = await res.json();
            isLoadingRender.set(false);
            return;
        }
        isBackgroundRotating.set(false);
        targetedStar=val;
        tweenedOrbitControlTargetCoordinates.set(targetedStar.coordinates);
        
        const res = await fetch(`http://localhost:5173/atlas/api/getStars?isInitial=false&ra=${targetedStar.rightAscencion}&dec=${targetedStar.declination}&p=${targetedStar.parallax}`,{method:'GET'});
        stars = await res.json();
        console.log(stars.length);
        isLoadingRender.set(false);
    });

    tweenedOrbitControlTargetCoordinates.subscribe((val:any)=>{
        orbitControls.target=val
    });

    isConstellationsVisible.subscribe((val:boolean)=>{
        displayConstellations=val;
    });

    currentConstellation.subscribe((val:ConstellationData)=>{
        console.log('val');
        console.log(val);
        creatableConstellation=val;
    })
</script>

<Pass pass={new UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight ), 1, 0.5, 0)} />

<HoverCursor />
<TargetCursor />

<Environment path ='./' files={'black_background.png'} isBackground={true} />

<PerspectiveCamera {...camera} >
    <OrbitControls {...orbitControls} />
</PerspectiveCamera>

<!-- SUN -->
<T.Mesh material={new THREE.MeshStandardMaterial({color: 0xffffff,emissive:0xffffff})} geometry={new THREE.SphereGeometry(0.001)} position={[0,0,0]} />

<InstancedMesh interactive material={new THREE.MeshStandardMaterial({transparent:true,opacity:0, depthWrite: false})} geometry={new THREE.SphereGeometry(1e-1)}>
    {#each stars as star }
        <Star starData={star} />
    {/each}
</InstancedMesh>

<Group visible={displayConstellations}>
    {#each constellations as constellation }
        <Constellation constellation={constellation} />
    {/each}

    <Constellation constellation={creatableConstellation} />
</Group>