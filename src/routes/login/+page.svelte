<script lang="ts">
	import type { ActionData } from './$types';
	import Login from '../../components/Login.svelte';
	export let form: ActionData;
</script>

<div class="center-items">
	<h1>Login</h1>

	{#if form?.user}
		<p class="error">Username not found or incorrect password. Try again.</p>
		<Login></Login >
	{:else if form?.user == null}
  <Login></Login >
    {:else}
    <p>Login is successful</p>
	{/if}
</div>
