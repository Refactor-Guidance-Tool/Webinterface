<script lang="ts">
	import type { AdviceNodeData } from "./AdviceNodeData";

	export let data: AdviceNodeData;
	export let setActiveNode: (data: AdviceNodeData) => void;
</script>

{#if data.parent !== undefined}
	<svelte:self data={data.parent} setActiveNode={setActiveNode} />
{/if}

<p
	class="breadCrumb"
	on:click={function () {
		setActiveNode(data);
	}}
>
	{data.advice.title}
</p>
<p class="breadCrumbDivider">></p>

<style>
	.breadCrumb {
		display: inline;
		cursor: pointer;
		text-decoration: none;
		color: #71a9d7;
	}

	.breadCrumb:hover {
		text-decoration: underline;
	}

	.breadCrumbDivider {
		margin-left: 5px;
		margin-right: 5px;
		display: inline;
	}
</style>
