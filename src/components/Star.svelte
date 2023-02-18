<script lang="ts">
	import { Instance, type ThreltePointerEvent, T } from '@threlte/core';
	import type { ConstellationData, StarData, Connection } from 'src/types';
	import { MeshStandardMaterial, SphereGeometry } from 'three';
    import { currentConstellation, cursorPosition, isCursorVisible, isMakingConstellation, targetStar,isLoadingRender } from '../stores'
    export let starData: StarData;

    let isLoadingRenderStatus = false;
    let isInConstellationCreationMode = false;
    let constellation:ConstellationData = {name:'',discoverer:'',connections:[], viewedFromStarId: '0'};

    isLoadingRender.subscribe((val:boolean)=>{
        isLoadingRenderStatus=val;
    });

    currentConstellation.subscribe((val:ConstellationData)=>{
        constellation=val;
    });

    isMakingConstellation.subscribe((val:boolean)=>{
        isInConstellationCreationMode=val;
    })    

    const onPointerEnter = (e: CustomEvent<ThreltePointerEvent>) => {
        cursorPosition.set(starData.coordinates);
        isCursorVisible.set(true);
        document.body.style.cursor = 'pointer';
    }

    const onPointerLeave = (e: CustomEvent<ThreltePointerEvent>) => {
        isCursorVisible.set(false);
        document.body.style.cursor = 'auto';
    }

    const onClick = (e: CustomEvent<ThreltePointerEvent>) => {
        console.log(isLoadingRenderStatus);
        if(isLoadingRenderStatus) return;

        if(isInConstellationCreationMode) {
            if(constellation.connections.length==0) {
                constellation.connections.push({startingStar:undefined,endingStar:undefined});
            }
            let connection: Connection = constellation.connections[constellation.connections.length-1];
            if(!connection.startingStar) {
                connection.startingStar=starData;
            }
            else if(!connection.endingStar) {
                connection.endingStar=starData;
                currentConstellation.set(constellation);
            } else {
                constellation.connections.push({startingStar:starData,endingStar:undefined});
            }
            return;
        }
        isLoadingRender.set(true)
        console.log("Pointer click: "+starData.id);
        targetStar.set(starData);
    }
</script>

<Instance on:pointerleave={onPointerLeave} on:pointerenter={onPointerEnter} on:click={onClick} color={starData.pseudocolor} position={starData.coordinates} />
<T.Mesh 
    position={[Number(starData.coordinates.x),Number(starData.coordinates.y),Number(starData.coordinates.z)]} 
    material={new MeshStandardMaterial({color:starData.pseudocolor, emissive:starData.pseudocolor})} 
    geometry={new SphereGeometry((1e-3)*starData.mag)} 
/>