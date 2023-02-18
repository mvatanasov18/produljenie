<script lang='ts'>

  import { enhance } from "$app/forms";
	import { currentConstellation, isConstellationsVisible, isLoadingRender, isMakingConstellation, targetStar } from "../stores";
  import { Button, Card, Col, Input, Offcanvas, Row, Spinner, Tooltip } from "sveltestrap";
	import type { ActionData } from "../routes/atlas/$types";
	import type { ConstellationData, StarData } from "src/types";
	import StarInfo from "./StarInfo.svelte";

  export let form: ActionData;
  export let username: string;

  let isLoading = true;
  isLoadingRender.subscribe((val:boolean)=>{
    isLoading=val;
  })
  
  function centerSun() {
    targetStar.set({id:'', rightAscencion:0, declination:0, parallax:0,pseudocolor:'',mag:0, coordinates:{x:0,y:0,z:0},scientificName:'Sol',givenName:'Sun',discoverer:'Humanity'});
  }

  let displayConstellations = false;
  let isInConstellationCreationMode = false;
  let constellation: ConstellationData;
  let targetedStar: StarData;

  targetStar.subscribe((val:StarData)=>{
    targetedStar=val;
  });

  currentConstellation.subscribe((val:ConstellationData)=>{
    constellation=val;
  }) 

  function toggleConstellations() {
    displayConstellations=!displayConstellations;
    isConstellationsVisible.set(displayConstellations);
  }

  function toggleConstellationMode() {
    isInConstellationCreationMode=!isInConstellationCreationMode
    isMakingConstellation.set(isInConstellationCreationMode);
  }

  function generateConstellation() {
    console.log(constellation);
    setTimeout(() => {
      resetConstellation();
    }, 5000);
  }

  function resetConstellation() {
    currentConstellation.set({id:'',name:'',discoverer:'',connections:[],viewedFromStarId:''});
  }

  let open=false;
  function toggle() {open=!open;}
</script>

<style>
  .UIcontainer {
    width: 150px;
  }

  #tutorial {
    font-size:25px;
  }

  .card {
    background: linear-gradient(176deg, rgb(18, 24, 27) 50%, rgb(32, 39, 55) 100%);
  }
</style>
  <Row>‎ </Row>
  <Row>‎ </Row>
  <Row>‎ </Row>
  <Row>
    <Col >
      <Button on:click={toggle}>Tools</Button>
    </Col>
    <Col>
      <Row >
        <div class="center-items">
        <span id='tutorial'>?</span>
        <Tooltip target={`tutorial`} >
          <p>
            <span>Use the mouse to look around.</span>
            <span>Scroll / hold scroll button and drag to zoom in or out.</span>
            <span>Click on stars to navigate towards them.</span>
            <span>Name stars which have never been clicked on before.</span>
            <span>Upload images to claim stars in order to make constellations.</span>
            <span>Claimed stars will appear in different colors.</span>
            <span>Constellations can be viewed only from the star which they were created from</span>
          </p>
        </Tooltip>
      </div>
      </Row>
    </Col>
    <Col >
      <div style='float:right'>
        {#if isLoading}
        <Spinner size='lg' color={'primary'} />
        {/if}
      </div>
    </Col>
  </Row>
  
  <Offcanvas style="background: rgba(0,0,0,0);" backdrop={false} isOpen={open} {toggle} placement="start">

  <Row><Col><Card class='card'>
    <form use:enhance method='POST' action='/atlas?/find'>
      <Input name="ra" id="ra" placeholder="Right Ascension" required />
      <Input name="dec" id="dec" placeholder="Declination" required />
      <Row><Col><Button type="submit">Find Star</Button></Col></Row>
      {#if form?.success}
        {targetStar.set(form.star)}
        <p>success</p>
      {/if}
    </form>
  </Card></Col></Row>
  <Row><Col><Button on:click={centerSun}>Center Sun</Button></Col></Row>
  <Row>
    <Col ><Button on:click={toggleConstellations}> 
      {#if displayConstellations==true}
        Hide 
      {:else}
        Show
      {/if}
      Constellations
    </Button></Col>
  </Row>
  <Row >
    {#if displayConstellations==true}
    <Button on:click={toggleConstellationMode}>
      {#if isInConstellationCreationMode==true}
        Leave creation 
      {:else}
        Enter creation
      {/if}
      Mode
    </Button>
    <Card class="card">
      <form use:enhance method="POST" action="/atlas?/constellation" >
        <Input hidden id='const-connections' name='const-connections' value={JSON.stringify(constellation)} />
        <Input hidden id='viewedFromStarId' name='viewedFromStarId' value={targetedStar.id} />
        <Input required id='const-name' name='const-name' />
        <Button type='submit' color='success'  on:click={generateConstellation} >Submit</Button>
        <Button color='danger' on:click={resetConstellation} >Reset</Button>
      </form>
    </Card>
    {/if}
    
  </Row>
  <StarInfo username={username} starData={targetedStar} />
</Offcanvas>