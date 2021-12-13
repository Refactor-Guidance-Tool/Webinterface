<script>
	export let refactorClb = function() {};
	export let visualizationClb = function() {};
</script>

<div class="header">
	<div class="header-segment">
		<a href="/" class="title">
			<img src="favicon.png" alt="Logo">
			<div><b>ISA-Lab</b></div>
			<div class="spacing"/>
			<div>Refactor Guidance Tool</div>
		</a>
		<div class="divider"/>
		<a href="/" class="header-item" on:click={refactorClb}>Refactoring</a>
		<a href="/" class="header-item" on:click={visualizationClb}>Graph visualization</a>
		<div class="divider"/>
	</div>

	<div class="header-segment">
		<div class="divider"/>
		<a href="about" class="header-item">About</a>
		<a href="license" class="header-item">License</a>
	</div>

</div>

<div class="header-spacer"/>

<style>
	.header {
		font-family: 'Fira Sans', sans-serif;

		user-select: none;
		position: fixed;
		left: 0px;
		right: 0px;
		height: 50px;
		display: flex;
		justify-content: space-between;

		background-color: #21252b;

		box-shadow: 0px 0px 7px -2px #000000;
	}

	.header-segment {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.header-item {
		background-color: #21252b;
		color: white;
		height: 80%;
		margin-left: 5px;
		margin-right: 5px;
		padding-left: 10px;
		padding-right: 10px;

		display: flex;
		align-items: center;
		justify-content: space-around;

		transition: all linear 0.08s;

		border-radius: 3px;
	}

	.header-item:hover {
		background-color: #2b3038;
		transition: all linear 0.08s;
		cursor: pointer;
	}

	.title {
		background-color: #21252b;
		color: white;
		height: 80%;
		margin-left: 5px;
		margin-right: 5px;
		padding-left: 10px;
		padding-right: 10px;

		display: flex;
		align-items: center;
		justify-content: space-around;

		cursor: pointer;
	}

	img {
		height: 30px;
		width: 30px;
		margin-right: 10px;
	}

	.header a {
		text-decoration: none;
	}

	.spacing {
		margin-left: 5px;
		margin-right: 5px;
	}

	.divider {
		width: 1px;
		background: gray;
		height: 50%;
		margin-left: 10px;
		margin-right: 10px;
	}

	.header-spacer {
		height: 50px;
		margin-bottom: 50px;
	}
</style>