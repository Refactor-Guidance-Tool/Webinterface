<script lang="ts">
import { AdvFetch } from "$lib/FetchUtils";

	import Container from "../../components/Container.svelte";
	import Navbar from "../../components/Navbar.svelte";

	let databaseStatus: "Ready" | "Building" = "Ready";
	let className = "";

	type Result = {
		detector: string,
		message: string,
	}

	let results: Result[] = [];

	async function rebuildDatabase() {
		databaseStatus = "Building";

		const res = await fetch("/api/rebuildDatabase");

		databaseStatus = "Ready";
	}

	async function deleteClass() {
		// alert(`Deleting class: ${className}`);
		const res = await fetch(`/api/deleteClass-${className}`);

		if (res.ok) {
			const data: {
				results: Result[]
			} = await res.json();

			results = data.results;
		}
	}
</script>

<Navbar/>

<Container>
	<button on:click={rebuildDatabase}> Rebuild database </button>
	<div>Database status: {databaseStatus}</div>

	<input type="text" placeholder="Class name" bind:value={className}/>
	<button on:click={deleteClass}>Delete class</button>

	<ul>
		{#each results as result}
			<li>[{result.detector}]: {result.message}</li>
		{/each}
	</ul>
</Container>

<style>
	button {
		margin-top: 5px;
		margin-right: 5px;
		background-color: #21252b;
		border: none;
		font-size: 16px;
		padding: 7px;
		border-radius: 4px;
		min-width: 200px;
		color: white;
		text-align: center;
	}

	button:hover {
		background-color: #2b3038;
		cursor: pointer;
	}
</style>
