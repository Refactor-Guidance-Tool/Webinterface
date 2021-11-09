<script lang="ts">
	import type { MetaElement, MetaModel } from '../types/MetaModel';

	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let metaModel: MetaModel;
	export let metaElement: MetaElement;
	export let selectedMetaElement: MetaElement;
	export let selectCallback: (metaElement: MetaElement) => void;

	const dispatch = createEventDispatcher();

	let children: MetaElement[] | undefined = undefined;
	$: {
		if (metaModel.parentChildRelations.receivers.has(metaElement)) {
			children = metaModel.parentChildRelations.receivers
				.get(metaElement)
				.map((v) => v.creator)
				.sort((a, b) => {
					if (a.__class == 'MetaPackage' && b.__class == 'MetaPackage')
						return a.name.localeCompare(b.name);

					if (a.__class == 'MetaPackage') return -1;

					if (b.__class == 'MetaPackage') return 1;

					return a.name.localeCompare(b.name);
				});
		}
	}

	let open = true;
</script>

<div class="container">
	<label class:invisible={children == undefined || children.length == 0}>
		<input type="checkbox" bind:checked={open} />
		<span class="caret">
			<svg width="12" height="12" viewBox="0 0 24 24"
				><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" /></svg
			>
		</span>
	</label>

	<div class="icon">
		{#if metaElement.__class == 'MetaPackage'}
			<svg width="12" height="12" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"
				><path
					d="M23 6.066v12.065l-11.001 5.869-11-5.869v-12.131l11-6 11.001 6.066zm-21.001 11.465l9.5 5.069v-10.57l-9.5-4.946v10.447zm20.001-10.388l-9.501 4.889v10.568l9.501-5.069v-10.388zm-5.52 1.716l-9.534-4.964-4.349 2.373 9.404 4.896 4.479-2.305zm-8.476-5.541l9.565 4.98 3.832-1.972-9.405-5.185-3.992 2.177z"
				/></svg
			>
		{:else if metaElement.__class == 'MetaClass'}
			<svg width="12" height="12" viewBox="0 0 24 24"
				><path
					d="M4 22v-20h16v11.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-7.362zm18-7.614v-14.386h-20v24h10.189c3.163 0 9.811-7.223 9.811-9.614z"
				/></svg
			>
		{:else if metaElement.__class == 'MetaMethod'}
			<svg width="12" height="12" viewBox="0 0 24 24"
				><path
					d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"
				/></svg
			>
		{:else if metaElement.__class == 'MetaField'}
			<svg width="12" height="12" viewBox="0 0 24 24">
				<path
					d="M10 12C9.44769 12 9 12.4477 9 13C9 13.5523 9.44769 14 10 14H14C14.5522 14 15 13.5523 15 13C15 12.4477 14.5522 12 14 12H10Z"
					fill="currentColor"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4 2C2.34314 2 1 3.34314 1 5V19C1 20.6569 2.34314 22 4 22H20C21.6569 22 23 20.6569 23 19V5C23 3.34314 21.6569 2 20 2H4ZM20 4H4C3.44769 4 3 4.44769 3 5V8H21V5C21 4.44769 20.5522 4 20 4ZM3 19V10H21V19C21 19.5523 20.5522 20 20 20H4C3.44769 20 3 19.5523 3 19Z"
					fill="currentColor"
				/>
			</svg>
		{/if}
	</div>

	<div
		class="name"
		class:selected={metaElement == selectedMetaElement}
		on:click={() => selectCallback(metaElement)}
	>
		{metaElement.name}
	</div>
	<p class="type">({metaElement.__class})</p>
</div>

{#if children != undefined && children.length > 0 && open}
	<ul>
		{#each children as child, i}
			<li>
				<svelte:self {metaModel} metaElement={child} {selectedMetaElement} {selectCallback} />
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
		cursor: pointer;

		margin-top: 0px;
		margin-bottom: 0px;

		height: 100%;
	}

	.container .selected {
		color: #98c875;

		transition: all linear 0.1s;
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
