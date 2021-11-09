<script lang="ts" context="module">
	import { AdvFetch } from '$lib/FetchUtils';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import { parse } from '@ts-graphviz/parser';

	export async function load(loadInput: LoadInput): Promise<LoadOutput> {
		console.log('Loading');

		const getASTRes = await AdvFetch<{
			ast: string;
		}>('/api/getAST', loadInput);

		if (!getASTRes.success) return; // TODO: Handle this

		const ast = parse(getASTRes.data.ast);
		return {
			props: {
				ast: ast
			}
		};
	}
</script>

<script lang="ts">
	import Heading from '../../components/Heading.svelte';
	import Navbar from '../../components/Navbar.svelte';
	import Container from '../../components/Container.svelte';
	import type { RootCluster, Node } from 'ts-graphviz';

	export let ast: RootCluster;
	export let parents: Node[];

	export let children: Node[];

	$: {
		if (ast != undefined) {
			const notAParent = new Set();
			ast.edges.forEach((edge) => {
				const node = edge.targets[1] as Node;
				notAParent.add(node.id);
			});

			parents = ast.nodes.filter((node) => {
				return !notAParent.has(node.id);
			});

			children = ast.nodes.filter((node) => {
				return notAParent.has(node.id);
			});
		}
	}
</script>

<Navbar />

<Container>
	<Heading content="Root elements" />
	<ul>
		{#each parents as parent}
			<li>
				{parent.attributes
					.get('label')
					.toString()
					.replace(/\[(.*?)\]/, '')}
				{parent.attributes
					.get('label')
					.toString()
					.match(/\[(.*?)\]/)[0]}
			</li>
		{/each}
	</ul>

	<Heading content="Child elements" />
	<ul>
		{#each children as child}
			<li>
				{#if child.attributes
					.get('label')
					.toString()
					.match(/\[(.*?)\]/) != undefined}
					{child.attributes
						.get('label')
						.toString()
						.replace(/\[(.*?)\]/, '')}
					{child.attributes
						.get('label')
						.toString()
						.match(/\[(.*?)\]/)[0]}
				{/if}
			</li>
		{/each}
	</ul>
</Container>
