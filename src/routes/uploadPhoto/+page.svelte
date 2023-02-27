<script lang="ts">
	import { Button } from 'sveltestrap/src';
	import type { ActionData } from './$types';
	export let form: ActionData;
	import { goto } from '$app/navigation';
	import { FormGroup, FormText, Input } from 'sveltestrap';

	const submitHandler = async (ev: Event) => {
		ev.preventDefault();
		const formData = new FormData();
		const file = (document.getElementById('img') as HTMLInputElement).files![0];

		formData.append('img', file);
		const response = await fetch('/uploadPhoto?/upload', {
			method: 'POST',
			body: formData
		});
		const result = await response.json();
		console.log(result);
		goto(result.location);
	};
</script>

<div class="center-items" id="body" >
	<h1>Upload Photo</h1>
	<br />

	<br />

	<div id="drop_zone">
		<div style="background-color: black;border-radius: 10px;">


		<FormGroup style="margin-left: 5px;margin-right: 5px;">
			<FormText color="muted">
				<p>
					Here you can upload a picture of the night sky and identify the stars you have captured.
				</p>
				<p>
					After submiting a picture via the drag-and-drop or by selecting a picture, wait for the
					map to load in order to see the stars
				</p>
			</FormText>
			<Input type="file" name="file" id="img" accept="image/*" multiple={false} required/>
		</FormGroup>

		<Button style="left:100%;position: sticky;margin:5px" color="primary" on:click={submitHandler}>Submit</Button>
	</div>
	</div>
	{#if form?.error}
		<Button color="danger"
			><a href="/uploadPhoto">An error please refresh and upload the photo again</a></Button
		>
	{/if}
	{#if form?.noStars}
		<Button color="warning"
			><a href="/uploadPhoto">No stars found. Please refresh and submit again.</a></Button
		>
	{/if}
</div>

<style>
	#drop_zone {
		border: 5px solid transparent;
		background: linear-gradient(to right, rgb(59, 8, 227), purple);
		background-attachment: fixed;

		width: 50%;
		border-radius: 10px;
	}
	#body{
		margin-top:5%;
	}
	p{
		padding-left: 10%;
			padding-right: 10%;
			text-align: center;
			font-size: larger;

			letter-spacing: 0.8px;
	}

	@media screen and (max-width: 600px) {
		#drop_zone {
			border: 5px solid transparent;
			background: linear-gradient(to bottom,rgb(13, 110, 253), rgb(143, 27, 179),rgba(33, 7, 42, 0.589));
			background-attachment: fixed;

			width: 100%;
			border-radius: 10px;
		}
		#body{
			margin-top: 35%;
		}
	}
</style>
