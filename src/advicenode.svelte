<script lang="ts">
    import type { AdviceNodeData } from "./AdviceNodeData";

	export let data: AdviceNodeData;
    export let depth: number = 0;
    export let setActiveNode: (node: AdviceNodeData) => void;
</script>

<div class="container">
    <p on:click={() => setActiveNode(data)}>
        {#each Array(depth) as d}
            &nbsp;&nbsp;&nbsp;&nbsp;
        {/each}
        {data.advice.title}
    </p>

    {#if data.children.length > 0}
        {#each data.children as childData}
            <svelte:self data={childData} depth={depth + 1} setActiveNode={setActiveNode}/>
        {/each}
    {/if}
</div>

<style>
    p {
        display: block;
		transition: all linear 0.08s;
		border-radius: 3px;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-left: 10px;
		margin: 0;
    }

    p:hover {
        background-color: #2b3038;
		transition: all linear 0.08s;
		cursor: pointer;
    }
</style>