<script lang="ts">
	import type { CodeElement } from '../types/CodeElement';
    import type { Refactoring } from '../types/Refactoring';
    import type { RefactorSetting } from '../types/RefactorSetting';
    import { Project } from '../types/Project.d';

	import Header from '../components/Navbar.svelte';
	import Container from '../components/Container.svelte';
	import Heading from '../components/Heading.svelte';
	import CodeElementView from './CodeElementView.svelte';
	import { currentProjectUuid } from '../stores';
    import Textfield from '../components/Textfield.svelte';
    import Button from '../components/Button.svelte';

    export let refactorClb = function() {};
	export let visualizationClb = function() {};

	let activeProjectUuid = '';
	currentProjectUuid.subscribe(async (currentProjectUuid) => {
		activeProjectUuid = currentProjectUuid;

        await getProjects();
        getCodeElements();
	});

    async function getProjects() {
        const res = await fetch(`http://localhost:1337/Projects/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();

        codeElements = undefined;
		setTimeout(() => {
			// Making it undefined, and populating it a bit later will cause the svelte component to update
            projects = [];
            for (const uuid of json.projectUuids) {
                projects.push(new Project(uuid, 1));
            }

            if (projects.length !== 0) {
                selectedProject = projects[0];
                activeProjectUuid = selectedProject.id;
                getCodeElements();
            }
		}, 1);
    }

	async function getCodeElements() {
		if (activeProjectUuid === '') {
			return;
		}

		const res = await fetch(`http://localhost:1337/Projects/${activeProjectUuid}/CodeElements`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();

		codeElements = undefined;
		setTimeout(() => {
			// Making it undefined, and populating it a bit later will cause the svelte component to update
			codeElements = json.codeElements;
		}, 1);
	}

    async function getSelectedCodeElementRefactorings() {
        if (selectedCodeElement === undefined) {
            return;
        }

        const res = await fetch(`http://localhost:1337/Projects/${activeProjectUuid}/refactorings`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();

        selectedCodeElementRefactorings = undefined;
		setTimeout(() => {
			// Making it undefined, and populating it a bit later will cause the svelte component to update
			selectedCodeElementRefactorings = json.refactorings;
            if (selectedCodeElementRefactorings.length !== 0) {
                selectRefactoringClb(selectedCodeElementRefactorings[0]);
            }
		}, 1);
    }

    async function getSelectedRefactoringSettings() {
        if (selectedRefactoring === undefined) {
            return;
        }

        // TODO: backend needs endpoint so we know what the project language is
        const res = await fetch(`http://localhost:1337/Refactorings/${selectedRefactoring.id}/settings?projectLanguage=${selectedProject.language}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();

        selectedRefactoringSettings = undefined;
		setTimeout(() => {
			// Making it undefined, and populating it a bit later will cause the svelte component to update
			selectedRefactoringSettings = json;
		}, 1);
    }

    function selectProjectClb(project: Project) {
        selectedProject = project;
        activeProjectUuid = selectedProject.id;
        getCodeElements();
    }

    function selectElementClb(codeElement: CodeElement) {
        selectedCodeElement = codeElement;
        getSelectedCodeElementRefactorings();
    }

    function selectRefactoringClb(refactoring: Refactoring) {
        selectedRefactoring = refactoring;
        getSelectedRefactoringSettings();
    }

    function executeRefactoring() {

    }

    let codeElements: CodeElement[] = undefined;
    let projects: Project[] = undefined;

    let selectedProject: Project = undefined;
    let selectedCodeElement: CodeElement = undefined;
    let selectedRefactoring: Refactoring = undefined;

    let selectedCodeElementRefactorings: Refactoring[] = undefined;
    let selectedRefactoringSettings: RefactorSetting[] = undefined;
</script>

<Header {refactorClb} {visualizationClb} />

<Container>
	<div class="container">
		<div class="visualization">
			<Heading content="Visualization" />

                Select project:<br>
                <select name="projectUuidSelect" style="width:100%">
                    {#if projects !== undefined}
                        {#each projects as project}
                            <option value="{project.id}" on:click="{() => selectProjectClb(project)}">{project.id}</option>
                        {/each}
                    {/if}
                </select>

                <hr>

				{#if codeElements !== undefined}
					<CodeElementView {codeElements} selectClb={selectElementClb} bind:selectedCodeElement={selectedCodeElement}/>
				{/if}
		</div>

        <div class="info-container">
            <Heading content="Info"/>

            {#if selectedCodeElementRefactorings !== undefined}
                Select refactoring:<br>
                <select name="refactoringSelect" style="width:100%">
                    {#each selectedCodeElementRefactorings as refactoring}
                        <option value="{refactoring.id}" on:click="{() => selectRefactoringClb(refactoring)}">{refactoring.name}</option>
                    {/each}
                </select>

                <hr>
            {/if}

            {#if selectedRefactoringSettings !== undefined}
                {#each selectedRefactoringSettings as setting}
                    {#if setting.type == "something"}
                        <!-- draw widget here -->
                    {/if}
                {/each}

                <Button onClick={executeRefactoring} extraStyling={"width:100%"}>Execute</Button>
            {/if}
		</div>
	</div>
</Container>

<style>
    hr {
        margin-top: 12px;
        margin-bottom: 12px;
    }

    select {
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

	select:hover {
		background-color: #2b3038;
	}

	.visualization {
		flex: 4;
	}

	.container {
		display: flex;
	}

    .info-container {
		flex: 3;
		padding-left: 50px;
	}
</style>