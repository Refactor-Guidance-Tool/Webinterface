<script type="ts">
    export let onClick = function(){};
	export let extraStyling = "";
</script>

<button style={extraStyling} on:click={onClick}>
	<slot></slot>
</button>

<style>
	button {
        margin-top: 5px;
        margin-right: 5px;
		background-color: #21252b;
		border: none;
		font-size: 16px;
		padding: 7px;
		border-radius: 4px;
		min-width: 200px;
		color: white;
        text-align: center;
	}

	button:hover {
		background-color: #2b3038;
		cursor: pointer;
	}
</style>