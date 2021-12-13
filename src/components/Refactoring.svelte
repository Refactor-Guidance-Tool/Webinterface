<script lang="ts">
	import Header from '../components/Navbar.svelte';
	import Container from '../components/Container.svelte';

	import Heading from '../components/Heading.svelte';
	import Advicenode from '../advicenode.svelte';
	import Button from '../components/Button.svelte';

	import { Advice } from '../advice/advice';
	import { Option } from '../advice/option';
	import { Hazard } from '../advice/hazard';
	import Advicebreadcrumbs from '../advicebreadcrumbs.svelte';
	import type { AdviceNodeData } from 'src/AdviceNodeData';
	import AdviceMessage from '../AdviceMessage.svelte';
	import { pendingRefactor } from '../stores';

    export let refactorClb = function() {};
	export let visualizationClb = function() {};

	let branchAAA = new Advice('Refactoring Branch AAA', ['You selected branch AAA.'], [], []);
	let branchAA = new Advice(
		'Refactoring Branch AA',
		['You selected branch AA.'],
		[],
		[new Option('BranchAAA', branchAAA)]
	);
	let branchA = new Advice(
		'Refactoring Branch A',
		['You selected branch A.'],
		[],
		[new Option('BranchAA', branchAA)]
	);
	let branchB = new Advice('Refactoring Branch B', ['You selected branch B.'], [], []);

	let advice = new Advice(
		'Refactoring',
		["You haven't [1,selected] anything [2,to] refactor [3,yet]."],
		[
			new Hazard(
				1,
				'ClassStillReferenced',
				'C:/Users/Tjakka5/Documents/RefactorGuidanceTool/TestWorkspace/test.java',
				7
			),
			new Hazard(
				2,
				'ClassStillInstantiated',
				'C:/Users/Tjakka5/Documents/RefactorGuidanceTool/TestWorkspace/test.java',
				7
			),
			new Hazard(
				3,
				'ClassStillInstantiated',
				'C:/Users/Tjakka5/Documents/RefactorGuidanceTool/TestWorkspace/test.java',
				12
			)
		],
		[new Option('BranchA', branchA), new Option('BranchB', branchB)]
	);

	let adviceTree: AdviceNodeData[] = [];
	let activeNode: AdviceNodeData = undefined;
	let treeRoot: AdviceNodeData = undefined;

	function getMatchingNodeInTree(advice: Advice): AdviceNodeData | undefined {
		const items = adviceTree.filter(v => v.advice == advice);

		if (items.length == 0)
			return undefined;

		return items[0];
	}

	function addToTree(node: AdviceNodeData) {
		// first check if it already exists in the tree
		for (let i = 0; i < adviceTree.length; ++i) {
			const obj = adviceTree[i];
			if (obj.advice == node.advice && obj.parent == node.parent) {
				return;
			}
		}
		
		// doesn't exist yet, so add it
		if (node.parent !== undefined) {
			node.parent.children.push(node);
		}
		
		adviceTree.push(node);
		
		// update tree root to trigger sidepanel contents update
		treeRoot = adviceTree[0];
	}

	function setActiveNodeByIdx(idx: number): void {
		activeNode = adviceTree[idx];
	}

	function setActiveNode(node: AdviceNodeData): void {
		activeNode = node;
	}

	addToTree({ advice: advice, parent: undefined, children: [] });
	setActiveNodeByIdx(0);

	pendingRefactor.subscribe(refactor => {
		if ($pendingRefactor.id !== "" && $pendingRefactor.uuid !== "") {
			fetch(`http://localhost:8080/${$pendingRefactor.id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify($pendingRefactor),
			})
			.then(response => response.json())
  			.then(function(adviceJson) {
				adviceTree = [];

				const advice = new Advice(adviceJson.title, adviceJson.messages, adviceJson.hazards, adviceJson.options);
				const node = { advice: advice, parent: undefined, children: [] };

				addToTree(node);
				setActiveNode(node)
			});
		}
	});
</script>

<!-- Sidebar -->
<div class="sidebar">
	<Advicenode data={treeRoot} setActiveNode={setActiveNode} />
</div>

<Header {refactorClb} {visualizationClb} />

<Container>
	<!-- Breadcrumbs -->
	<Advicebreadcrumbs data={activeNode} setActiveNode={setActiveNode} />

	<Heading content={activeNode.advice.title} />

	<!-- Advice messages -->
	{#each activeNode.advice.messages as message, i}
		<div class="adviceWrapper">
			<input
				type="checkbox"
				class="adviceCheckbox"
				bind:checked={activeNode.advice.checkedMessages[i]}
			/>
			<p class="adviceMessage">{i + 1}. <AdviceMessage adviceData={advice.getData(message)}/></p>
		</div>
	{/each}

	<!-- Advice options -->
	{#each activeNode.advice.options as option, i}
		<Button
			onClick={function () {
				const newAdvice = activeNode.advice.findNewAdvice(i);

				let step = getMatchingNodeInTree(newAdvice);
				if (step == undefined) {
					step = { advice: newAdvice, parent: activeNode, children: [] };
				}

				addToTree(step);
				setActiveNode(step);
			}}>{option.message}</Button
		>
	{/each}
</Container>

<style>
	.adviceMessage {
		white-space: pre-wrap;
		margin: 0;
	}

	.sidebar {
		float: left;
		width: 20%;
		height: 100vh;
		margin-right: 60px;
		background: #21252b;
		padding-top: 51px;
		overflow: auto;
	}

	.adviceWrapper {
		display: flex;
		justify-content: top;
		margin-bottom: 1em;
	}

	.adviceCheckbox {
		margin-right: 1em;
		align-self: baseline;
	}

	.adviceCheckbox:checked ~ .adviceMessage {
		color: gray;
	}

	.adviceCheckbox:checked ~ .adviceMessage :global(.hazard) {
		color: #3e629e;
	}
</style>