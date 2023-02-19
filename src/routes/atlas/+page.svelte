<script lang='ts'>
	import { Canvas } from '@threlte/core';
	import Scene from '../../components/Scene.svelte';
  import AtlasUI from '../../components/AtlasUI.svelte';
	import type { ActionData, PageData } from './$types';
  export let data: PageData;
  export let form:ActionData;
	import { page } from '$app/stores';

</script>

<style>
    .canvas-container {
      position: fixed;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
      z-index:-2;
    }

    .controlls-container {
      padding: auto;
    }

    #loading-info{
      margin-top:15%;
      font-size:xx-large;
    }
</style>

<div class="controlls-container">
  <AtlasUI username={$page.data.user.username} form={form}/>
</div>

<div class="canvas-container">
  <Canvas>
    <Scene data={data} />
  </Canvas>
  <div id="loading-info" class="center-items">
    <p>Loading Atlas data...</p>
    <p>Please wait.</p>
  </div>
  
</div>


