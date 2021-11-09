<script lang="ts">
	import Heading from "../components/Heading.svelte";

	import Container from "../components/Container.svelte";
	import Navbar from "../components/Navbar.svelte";
</script>

<Navbar/>

<Container>
	<div class="segment">
		<Heading content="Lorem"/>

		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non magna eget ligula imperdiet faucibus. Aenean tincidunt, diam sed molestie pharetra, arcu leo gravida nisi, eu cursus mi est congue est. Ut efficitur ultrices metus id tempor. Ut molestie, diam vitae accumsan feugiat, neque risus facilisis lectus, at tincidunt tellus magna vitae tortor. Sed faucibus diam at sapien vehicula euismod. Mauris vitae commodo felis, a tincidunt libero. Vestibulum interdum nisi in dui porttitor, eu scelerisque enim ultricies. In hac habitasse platea dictumst. Sed ligula neque, pellentesque id mattis ut, ultricies eu lectus. Donec placerat dui sed posuere cursus. Nunc iaculis enim a semper venenatis. Etiam quis sapien a ligula facilisis venenatis ac ac magna. Fusce aliquet, sem vitae rutrum tempus, turpis diam ultricies nibh, vel mollis ipsum magna quis ex. 
		</p>

		<p>
			Curabitur et dignissim eros. Fusce non interdum nibh, nec pretium diam. Etiam luctus laoreet rutrum. Maecenas risus ante, accumsan eu auctor at, viverra sit amet magna. Aenean a nulla vel ante accumsan convallis. Praesent congue, odio vitae auctor finibus, justo mauris tincidunt felis, vel sodales libero mi nec lectus. Ut commodo tempus bibendum. Sed sit amet enim nec magna posuere facilisis et ac ex. Curabitur ut ex ut risus egestas tempus quis in eros. Etiam tincidunt, neque in vestibulum faucibus, augue libero blandit lectus, sed accumsan lectus dolor et neque. Sed vitae dolor lobortis urna laoreet molestie. Aliquam erat volutpat. Etiam ac ligula maximus, accumsan est in, ornare arcu. Integer ac neque a sem accumsan dignissim eu a erat. Nunc commodo elit non enim lobortis pharetra. Nunc tristique commodo tristique. 
		</p>
	</div>
	
	<div class="segment">
		<Heading content="Relevant Links"/>

		<ul>
			<li><a href="https://nodejs.org/">NodeJS</a></li>
			<li><a href="https://kit.svelte.dev/">Svelte-Kit</a></li>
			<li><a href="https://www.isalab.nl/">ISA-Lab</a></li>
			<li><a href="https://spoon.gforge.inria.fr/">Spoon</a></li>
			<li><a href="https://www.ou.nl/">De Open Universiteit (OU)</a></li>
		</ul>
	</div>

	<div class="segment">
		<Heading content="Research Papers"/>

		<ul>
			<li>Internal<ul>
				<li><a href="https://scholar.archive.org/work/5lwyur54gbcbre6zvtho4p2fwa/access/wayback/https://s3-eu-west-1.amazonaws.com/pfigshare-u-files/14524037/Code_Context_Based_Generation_of_Refactoring_Guidance.pdf">Code Context Based Generation of Refactoring Guidance</a>P. de Beer</li>
				<li><a href="https://research.ou.nl/files/41584099/Verduin_E_IM9906_AF_SE_scriptie_PURE.pdf">A flexbile mechanism to provide for a refactoring advice based on the source code entity</a>E. Verduin</li>
				<li><a href="#">Contextual refactoring towards contextual based refactoring acknowledgments</a>H. Hilberink</li>
			</ul></li>

			<li>External<ul>
				<li><a href="http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.17.688&rep=rep1&type=pdf">Refactoring Object-Oriented Frameworks</a>W. F. Opdyke</li>
				<li><a href="https://scholar.google.com/scholar?hl=nl&as_sdt=0%2C5&q=Refactoring%3A+improving+the+design+of+existing+code&btnG=">Refactoring: improving the design of existing code</a>M. Fowler</li>
			</ul></li>
		</ul>
	</div>
</Container>

<style>
	.segment {
		margin-bottom: 50px;
	}

	ul li {
		margin-top: 10px;
		margin-bottom: 10px;
	}

	ul li a {
		color: #71A9D7;
		text-decoration: none;
		margin-right: 10px;
	}

	ul li a:hover {
		text-decoration: underline;
	}
</style>