<script type="ts">
	export let name = "";
    export let placeholder = "";
	export let onInput = function(e) {};
	export let extraStyling = "";
</script>

<input on:input={onInput} style={extraStyling} name={name} type="text" placeholder={placeholder}/>

<style>
	input {
		box-sizing: border-box;
		margin-top: 5px;
        margin-right: 5px;
		background-color: #21252b;
		border: none;
		font-size: 16px;
		padding: 7px;
		border-radius: 4px;
		width: 200px;
		text-align: center;
		color: white;
	}

	input:hover {
		background-color: #2b3038;
	}
</style>