<script lang="ts">
	export let content: string;
</script>

<h2>
	<div class="angleBracket">&lt;</div> 
	{content}
	<div class="angleBracket">/&gt;</div> 
</h2>

<style>
	.angleBracket {
		color: #EA5964;
		display: inline-block
	}
</style>