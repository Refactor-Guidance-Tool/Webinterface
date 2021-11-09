<script lang="ts">
	import { fly } from "svelte/transition";

	export let data: TreeItemData;
</script>

<div class="container">
	<label class:invisible={data.children.length == 0}>
		<input type=checkbox bind:checked={data.open}>
		<span class="caret">
			<i class="fa-solid fa-caret-right"></i>
		</span>
	</label>
	
	<div class="icon">
		{#if data.type == "PtPackage"}
			<i class="fa-solid fa-box"></i>
		{:else if data.type == "PtClass"}
			<i class="fa-solid fa-file"></i>
		{:else if data.type == "PtMethod"}
			<i class="fa-solid fa-function"></i>
		{/if}
	</div>

	<div class="name">
		{data.name}
	</div>
	<p class="type">({data.type})</p>
</div>

{#if data.children.length > 0 && data.open}
	<ul>
		{#each data.children as childData, i}
			<li transition:fly={{ x: 20, y: 0, duration: 100, delay: i * 20}}>
				<svelte:self data={childData}/>
			</li>
		{/each}
	</ul>
{/if}

<style>
	li {
		margin-top: 0px;
		margin-bottom: 0px;

		padding-top: 0px;
		padding-bottom: 0px;

		transform-origin: top center;
	}

	ul {
		list-style: none;

		margin-top: 0px;
		margin-bottom: 0px;

		padding-top: 0px;
		padding-bottom: 0px;

		padding-left: 20px;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: left;

		margin-top: 3px;
		margin-bottom: 3px;
	}

	.container .invisible {
		visibility: hidden;
	}

	.container label input {
		position: absolute;
		top: 0;
		left: 0;
		display: none;
	}

	.container label input + span svg {
		fill: white;

		transform: rotate(0deg);
		transition: linear 0.1s;
	}

	.container label input:checked + span svg {
		transform: rotate(90deg);
		transition: linear 0.1s;
	}

	.container .name {
		margin-left: 0px;
		cursor: default;

		margin-top: 0px;
		margin-bottom: 0px;

		height: 100%;
	}
	
	.container .type {
		margin-left: 5px;
		color: lightblue;

		margin-top: 0px;
		margin-bottom: 0px;
	}

	.container .icon {
		fill: white;
		margin-left: 5px;
		margin-right: 5px;
	}
</style>
