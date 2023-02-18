<script lang='ts'>
	import { useThrelte } from "@threlte/core";
	import { targetStar } from "../stores";
	import { Sprite, SpriteMaterial, TextureLoader } from "three";
	import type { StarData } from "src/types";
    const { scene } = useThrelte();

    let targetCursor: THREE.Object3D;

    if(!scene.getObjectByName("targetCursor"))
    {
        targetCursor = new Sprite( new SpriteMaterial( { 
            map: new TextureLoader().load( 'targetCursor.png' ), 
            color: 0xffffff } 
        ) ); 
    
        targetCursor.name="targetCursor";
        targetCursor.scale.set(0.1,0.1,1);
        targetCursor.visible=false;
        scene.add(targetCursor);
    }

    targetStar.subscribe((val:StarData)=>{
        if(!(val.coordinates.x==0&&val.coordinates.y==0&&val.coordinates.z==0))
            targetCursor.visible=true;
        targetCursor.position.set(val.coordinates.x as number,val.coordinates.y as number,val.coordinates.z as number);
    });
</script>