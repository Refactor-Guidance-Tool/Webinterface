<script lang="ts">
	import type { CodeElement } from '../types/CodeElement';

	export let codeElements: CodeElement[];
	export let selectClb;
	export let selectedCodeElement: CodeElement;
</script>

{#each codeElements as codeElement, i}
	<div class="container">
		<label>
			<input type="checkbox"/>
		</label>

		<div class="icon">
			{#if codeElement.type == 'Interface'}
				<i class="fas fa-info" />
			{:else if codeElement.type == 'Class'}
				<i class="fa fa-solid fa-file" />
			{/if}
		</div>

		<div class="name" class:selected={codeElement == selectedCodeElement} on:click="{() => selectClb(codeElement)}">
			{codeElement.name}
		</div>
		<p class="type">({codeElement.type})</p>
	</div>
{/each}

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: left;

		margin-top: 3px;
		margin-bottom: 3px;
	}

	.container label input {
		position: absolute;
		top: 0;
		left: 0;
		display: none;
	}

	.container .selected {
		color: #98c875;
		transition: all linear 0.1s;
	}

	.container .name {
		margin-left: 0px;
		cursor: pointer;

		margin-top: 0px;
		margin-bottom: 0px;

		height: 100%;
		white-space: nowrap;
	}

	.container .type {
		margin-left: 5px;
		color: #71a9d7;

		margin-top: 0px;
		margin-bottom: 0px;
	}

	.container .icon {
		fill: white;
		margin-left: 5px;
		margin-right: 5px;
	}
</style>
