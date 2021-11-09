<script lang="ts">
	import type { MetaElement, MetaModel } from '../types/MetaModel';

	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let metaModel: MetaModel;
	export let metaElement: MetaElement;
	export let selectedMetaElement: MetaElement;
	export let selectCallback: (metaElement: MetaElement) => void;
	export let nameFilter = '';

	const dispatch = createEventDispatcher();

	function getChildren(metaElement: MetaElement) {
		let outChildren;
		
		if (metaModel.parentChildRelations.receivers.has(metaElement)) {
			outChildren = metaModel.parentChildRelations.receivers
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

		return outChildren;
	}

	let children: MetaElement[] | undefined = undefined;
	$: {
		children = getChildren(metaElement);
	}

	function childrenContains(children: MetaElement[] | undefined): boolean {
		if (children !== undefined) {
			for (let i = 0; i < children.length; ++i) {
				if (children[i].name.includes(nameFilter)) {
					return true;
				}

				if (childrenContains(getChildren(children[i]))) {
					return true;
				}
			}
		}

		return false;
	}

	function shouldOpen() {
		// just leave everything open by default
		if (nameFilter === '') {
			return true;
		}

		// check if this name contains name filter
		if (metaElement.name.includes(nameFilter)) {
			return true;
		}

		// check if children and children's children contain name filter
		return childrenContains(getChildren(metaElement));
	}

	let open = true;
	$: {
		open = shouldOpen();
	}
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
			<i class="fa-solid fa-box" />
		{:else if metaElement.__class == 'MetaClass'}
			<i class="fa-solid fa-file" />
		{:else if metaElement.__class == 'MetaMethod'}
			<i class="fa-solid fa-gear" />
		{:else if metaElement.__class == 'MetaConstructorCall'}
			<i class="fas fa-mobile-alt" />
		{:else if metaElement.__class == 'MetaField'}
			<i class="fab fa-elementor" />
		{:else if metaElement.__class == 'MethodCall'}
			<i class="fas fa-phone-volume" />
		{/if}
	</div>

	<div
		class="name"
		class:searched={nameFilter != '' && metaElement.name.includes(nameFilter)}
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
				<svelte:self
					{metaModel}
					metaElement={child}
					{selectedMetaElement}
					{nameFilter}
					{selectCallback}
				/>
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
		white-space: nowrap;
	}

	.container .selected {
		color: #98c875;
		transition: all linear 0.1s;
	}

	.container .searched {
		text-decoration: underline;
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
