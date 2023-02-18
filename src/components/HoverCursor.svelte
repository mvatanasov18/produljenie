<script lang='ts'>
	import { useThrelte } from "@threlte/core";
	import { cursorPosition, isCursorVisible } from "../stores";
	import { Sprite, SpriteMaterial, TextureLoader } from "three";
    const { scene } = useThrelte();

    let hoverCursor: THREE.Object3D;

    if(!scene.getObjectByName("hoverCursor"))
    {
        hoverCursor = new Sprite( new SpriteMaterial( { 
            map: new TextureLoader().load( 'cursor.png' ), 
            color: 0xffffff } 
        ) ); 
    
        hoverCursor.name="hoverCursor";
        hoverCursor.scale.set(0.1,0.1,1);
        hoverCursor.position.set(0,0,0);
            
        scene.add(hoverCursor);
    }

    cursorPosition.subscribe((val:any)=>{
        hoverCursor.position.set(val.x,val.y,val.z);
    });

    isCursorVisible.subscribe((val:any)=>{
        hoverCursor.visible=val;
    });
</script>