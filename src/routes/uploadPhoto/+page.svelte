<script lang="ts">
	import { Button } from 'sveltestrap/src';
	import type { ActionData } from "./$types"
	export let form: ActionData;
	import { goto } from '$app/navigation';

	const dropHandler = (ev: DragEvent) => {
		console.log('File(s) dropped');

		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();
		if (ev.dataTransfer) {
			if (ev.dataTransfer.items) {
				// Use DataTransferItemList interface to access the file(s)
				[...ev.dataTransfer.items].forEach((item, i) => {
					// If dropped items aren't files, reject them
					if (item.kind === 'file') {
						const file = item.getAsFile();
						if (file) {
							console.log(`… file[${i}].name = ${file.name}`);
							const input = document.getElementById("img") as HTMLInputElement;
							input.files = [file];
						}
					}
				});
			} else {
				// Use DataTransfer interface to access the file(s)
				[...ev.dataTransfer.files].forEach((file, i) => {
					console.log(` file[${i}].name = ${file.name}`);
					const input = document.getElementById("img") as HTMLInputElement;
					input.files = [file];
				});
			}
		}
	};

	const dragOverHandler = (ev: DragEvent) => {
		console.log('File(s) in drop zone');

		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();
	};

	const submitHandler = async (ev: Event) => {
		ev.preventDefault();
		const formData = new FormData();
		const file = (document.getElementById("img") as HTMLInputElement).files![0];

		
		formData.append("img", file);
		const response = await fetch("/uploadPhoto?/upload", {
			method: "POST",
			body: formData
		});
		const result = await response.json();
		console.log(result);
		goto(result.location)
	};
</script>
<div class="center-items" style="top:10%;position:absolute;">
	<h1>Upload Photo</h1>
	<br />
	<p>Here you can upload a picture of the night sky and identify the stars you have captured.</p>
	<p>
		After submiting a picture via the drag-and-drop or by selecting a picture, wait for the map to
		load in order to see the stars
	</p>

	<br />
	<div id="form"  style="top: 15%;width:auto;height:max-content;">
		<div id="drop_zone" on:drop={dropHandler} on:dragover={dragOverHandler}>
			<label for="img">Select image:</label>
			<input type="file" id="img" name="img" accept="image/*" />
			<div style="padding-left:80%">
				<Button color="primary" on:click={submitHandler}>Submit</Button>
			</div>

			<p>Drag one file to this <i>drop zone</i>.</p>
		</div>
	</div>
	{#if form?.error }
	<Button color="danger"><a href="/uploadPhoto">An error please refresh and upload the photo again</a></Button>
	{/if}
	{#if form?.noStars}
	<Button color="warning"><a href="/uploadPhoto">No stars found. Please refresh and submit again.</a></Button>
	{/if}
</div>

<style>
	#drop_zone {
		border: 5px solid blue;
		width: 99%;
		height: 40%;
	}

	@media screen and (max-width: 600px) {
		p {
			padding-left: 10%;
			padding-right: 10%;
			text-align: center;

			letter-spacing: 0.8px;
		}
	}
	#form {
		top: 15%;
		width: 90%;
		height: max-content;
	}
</style>
