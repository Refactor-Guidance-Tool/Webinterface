<script lang="ts">
	import Refactoring from '../components/Refactoring.svelte';
	import Visualization from '../components/Visualization.svelte';

	let refactoringPage = true;
	function refactorClb() {
		refactoringPage = true;
	}

	function visualizationClb() {
		refactoringPage = false;
	}
</script>

<div hidden={!refactoringPage}>
	<Refactoring {refactorClb} {visualizationClb} />
</div>

<div hidden={refactoringPage}>
	<Visualization {refactorClb} {visualizationClb} />
</div>

<style>
	
</style>
