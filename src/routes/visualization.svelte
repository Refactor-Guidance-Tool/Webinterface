<script lang="ts">
	import type { MetaModelData } from '../types/MetaModelData';
	import type { MetaElement, MetaElementId, MetaModel, MetaRelation } from '../types/MetaModel';

	import Header from '../components/Navbar.svelte';
	import Container from '../components/Container.svelte';
	import Heading from '../components/Heading.svelte';
	import MetaElementTreeView from '../components/MetaElementTreeView.svelte';
	import MetaElementInfoView from '../components/MetaElementInfoView.svelte';
	import Button from '../components/Button.svelte';
	import { socketStore } from '../stores';
	import Textfield from '../components/Textfield.svelte';

	let metaModel: MetaModel = undefined;
	let selectedMetaElement: MetaElement = undefined;

	function buildMetaModel(metaModelData: MetaModelData) {
		const metaElementLookup: { [key: MetaElementId]: MetaElement } = {};

		metaModel = {
			metaElements: [],
			rootMetaElements: [],
			parentChildRelations: {
				relations: [],
				creators: new Map(),
				receivers: new Map()
			}
		};

		for (const metaElementData of metaModelData.metaElements) {
			const metaElement: MetaElement = {
				id: metaElementData.id,
				name: metaElementData.name,
				refactorings: metaElementData.refactorings,
				__class: metaElementData.__class
			};

			metaModel.metaElements.push(metaElement);
			metaElementLookup[metaElementData.id] = metaElement;
		}

		for (const rootMetaElementData of metaModelData.rootMetaElements) {
			const rootMetaElement = metaElementLookup[rootMetaElementData];

			metaModel.rootMetaElements.push(rootMetaElement);
		}

		for (const metaRelationData of metaModelData.parentChildRelations.relations) {
			const creator = metaElementLookup[metaRelationData.creator];
			const accepter = metaElementLookup[metaRelationData.accepter];

			const metaRelation: MetaRelation = {
				creator: creator,
				accepter: accepter
			};

			metaModel.parentChildRelations.relations.push(metaRelation);

			metaModel.parentChildRelations.creators.set(creator, metaRelation);

			if (!metaModel.parentChildRelations.receivers.get(accepter))
				metaModel.parentChildRelations.receivers.set(accepter, []);
			metaModel.parentChildRelations.receivers.get(accepter).push(metaRelation);
		}
	}

	let metaModelData: MetaModelData | undefined;
	const getMetaModel = async (): Promise<void> => {
		const res = await fetch('http://localhost:8080/GetMetaModel', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: 'F:\\Documenten\\RefactorGuidanceTool\\TestWorkspace\\test.java'
			})
		});

		metaModelData = await res.json();
		console.log(metaModelData);

		buildMetaModel(metaModelData);
	};

	function selectCallback(metaElement: MetaElement): void {
		selectedMetaElement = metaElement;
	}

	getMetaModel();

	socketStore.subscribe((incomingMessage) => {
		if (incomingMessage.event === 'META_MODEL_UPDATED') {
			getMetaModel();
		}
	});

	let nameFilter = '';
	function onSearchInput(e: Event): void {
		nameFilter = e.target.value;

		// Rebuilding the metamodel to force the components to update.
		// Won't work without the delay.
		metaModel = undefined;
		setTimeout(() => {
			buildMetaModel(metaModelData);
		}, 1);
	}
</script>

<Header />

<Container>
	<div class="container">
		<div class="visualization">
			<Heading content="Visualization" />

			<p style="display: inline;">Search:</p>
			<Textfield
				name="searchField"
				placeholder="Element to search for..."
				onInput={onSearchInput}
				extraStyling="width: calc(100% - 62px); text-align: left; margin-bottom: 10px;"
			/>

			<div class="tree-container">
				<div class="tree">
					{#if metaModel != undefined}
						{#each metaModel.rootMetaElements as rootMetaElement}
							<MetaElementTreeView
								{metaModel}
								metaElement={rootMetaElement}
								{selectedMetaElement}
								{nameFilter}
								{selectCallback}
							/>
						{/each}
					{:else}
						<p>Loading...</p>
					{/if}

					<Button
						onClick={getMetaModel}
						extraStyling="position: absolute; bottom: 14px; right: 14px;"
					>
						<i class="fa-solid fa-rotate" />
						Reload
					</Button>
				</div>
			</div>
		</div>

		<div class="info-container">
			<MetaElementInfoView metaElement={selectedMetaElement} />
		</div>
	</div>
</Container>

<style>
	.visualization {
		flex: 4;
	}

	.container {
		display: flex;
	}

	.tree-container {
		position: relative;
	}

	.tree {
		height: calc(90vh - 160px);
		overflow: auto;
	}

	.info-container {
		flex: 3;
		padding-left: 50px;
	}
</style>
