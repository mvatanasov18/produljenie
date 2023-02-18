<script lang='ts'>
	import { enhance } from "$app/forms";
	import type { StarData } from "src/types";
	import { Button, Card, Input } from "sveltestrap";
    export let starData: StarData
    export let username: string;
</script>
    
<style>
    .infotext {
        color:black
    }
</style>

<Card>
    {#if !starData.discoverer}
        <form use:enhance={({data})=>{
            const givenName = data.get('givenName');
            let name = String(givenName);
            starData.givenName = name;
            starData.discoverer=username;
        }} method="POST" action='/atlas?/discoverStar'>
            <Input required value={starData.givenName} name='givenName' id='givenName' />
            <Input hidden value={starData.id} name='starId' id='starId' />
            <Input hidden value={starData.scientificName} name='designatedName' id='designatedName' />
            <Button type='submit' color='primary'>Discover Star!</Button>
         </form>
    {:else}
        <p class='infotext' >Given Name: {starData.givenName}</p>
        <p class='infotext' >Discovered By: {starData.discoverer}</p>
    {/if}
    <p class='infotext' >Designation: {starData.scientificName}</p>
    <p class='infotext' >Right Ascension: {starData.rightAscencion} degrees</p>
    <p class='infotext' >Declination: {starData.declination} degrees</p>
    <p class='infotext'>Parallax: {starData.parallax} mas</p>
    <p class='infotext'>Apparent magnitude: {starData.mag}</p>
</Card>