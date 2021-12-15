<script lang="ts">
	import type { CodeElement } from '../types/CodeElement';
    import type { Refactoring } from '../types/Refactoring';
    import type { SubjectRefactorSetting, StringRefactorSetting, ChoiseRefactorSetting, BooleanRefactorSetting, RefactorSetting } from '../types/RefactorSetting';
    import { Project } from '../types/Project.d';

	import Header from '../components/Navbar.svelte';
	import Container from '../components/Container.svelte';
	import Heading from '../components/Heading.svelte';
	import CodeElementView from './CodeElementView.svelte';
	import { currentProjectUuid } from '../stores';
    import Textfield from '../components/Textfield.svelte';
    import Button from '../components/Button.svelte';
    import PageControl from '../components/PageControl.svelte';
    import MultiSelect from '../components/MultiSelect.svelte';

    const maxItems = 20;

    export let refactorClb = function() {};
	export let visualizationClb = function() {};

	let activeProjectUuid = '';
	currentProjectUuid.subscribe(async (currentProjectUuid) => {
		activeProjectUuid = currentProjectUuid;

        await getProjects();
        await getKindsOfCodeElements();
        const elements = await getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString());

        codeElements = [...elements];
        if(codeElements.length !== 0) {
            selectElementClb(codeElements[0]);
        }
	});

    async function getProjects() {
        const res = await fetch(`http://localhost:1337/Projects/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();

        // Making it undefined, and populating it a bit later will cause the svelte component to update
        projects = [];
        for (const uuid of json.projectUuids) {
            const language = await getProjectLanguage(uuid);
            projects = [...projects, new Project(uuid, language)];
        }

        if (projects.length !== 0) {
            //if (activeProjectUuid == "") {
                selectedProject = projects[0];
                activeProjectUuid = selectedProject.id;
            // } else {
            //     // For when we use the start page and get the projectid passed from the code editor extension
            //     for (const project of projects) {
            //         if (project.id == activeProjectUuid) {
            //             selectedProject = project;
            //             break;
            //         }
            //     }
            // }

            await getKindsOfCodeElements();
            const elements = await getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString());

            codeElements = [...elements];
            if(codeElements.length !== 0) {
                selectElementClb(codeElements[0]);
            }
        }
    }

    async function getProjectLanguage(uuid: string): Promise<number> {
        const res = await fetch(`http://localhost:1337/Projects/${uuid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();
        return json.language;
    }

    async function getKindsOfCodeElements() {
        if (activeProjectUuid === '') {
			return;
		}

        const res = await fetch(`http://localhost:1337/Projects/${activeProjectUuid}/codeElementTypes`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();
        kindsOfCodeElements = [...json.codeElementTypes];

        if (elementWhitelist === undefined) {
            elementWhitelist = kindsOfCodeElements;
        }
    }

	async function getCodeElements(projectUuid: string, numItems: number, nameFilter: string, typeFilter: string, usePaging: boolean = true) : Promise<CodeElement[]> {
		if (activeProjectUuid === '') {
			return;
		}

        const offset = usePaging ? currentPage * maxItems : 0;
		const res = await fetch(`http://localhost:1337/Projects/${projectUuid}/codeElements?offset=${offset}&limit=${numItems}&nameFilter=!${nameFilter}&typeFilter=${typeFilter}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await res.json();

        if (usePaging && offset == 0) {
            numCodeElementPages = Math.ceil(json.remaining / maxItems) + 1;
        }

        return json.codeElements;
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

        selectedCodeElementRefactorings = [...json.refactorings];
        if (selectedCodeElementRefactorings.length !== 0) {
            selectRefactoringClb(selectedCodeElementRefactorings[0]);
        }
    }

    type SettingDTO = {
        booleanSetting?: BooleanRefactorSetting
        choiceSetting?: ChoiseRefactorSetting
        stringSetting?: StringRefactorSetting
        subjectSetting?: SubjectRefactorSetting
    }

    async function getRefactoringSettings(id: string) {
        const res = await fetch(`http://localhost:1337/Refactorings/${id}/settings?projectLanguage=${selectedProject.language}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const response: SettingDTO[] = await res.json();

        var settings = [];
        for (const setting of response) {
            if (setting.booleanSetting !== null) {
                settings.push(setting.booleanSetting);
            }
            else if (setting.choiceSetting !== null) {
                settings.push(setting.choiceSetting);
            }
            else if (setting.stringSetting !== null) {
                settings.push(setting.stringSetting);
            }
            else if (setting.subjectSetting !== null) {
                settings.push(setting.subjectSetting);
            }
        }

        selectedRefactoringSettings = [...settings];
    }

    async function selectProjectClb(project: Project) {
        selectedProject = project;
        activeProjectUuid = selectedProject.id;
        await getKindsOfCodeElements();
        await getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString());

        const elements = await getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString());

        codeElements = [...elements];
        if(codeElements.length !== 0) {
            selectElementClb(codeElements[0]);
        }
    }

    function selectElementClb(codeElement: CodeElement) {
        selectedCodeElement = codeElement;
        getSelectedCodeElementRefactorings();
    }

    async function selectRefactoringClb(refactoring: Refactoring) {
        selectedRefactoring = refactoring;
        getRefactoringSettings(selectedRefactoring.id);
    }

    async function executeRefactoring() {
        // for debugging
        console.log(refactorSettingsResp);

        const res = await fetch(`http://localhost:1337/Refactorings/${selectedRefactoring.id}/hazards?projectId=${selectedProject.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
			},
            body: JSON.stringify(refactorSettingsResp)
		});

		const json = await res.json();
        console.log(JSON.parse(json));
    }

    function onCodeElementPageChanged(newPage: number) {
        codeElements = undefined;
        getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString()).then(elements => codeElements = [...elements]);
    }

    let nameFilterValue = "";
    function onNameFilterInput(e) {
        nameFilterValue = e.target.value;
        getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString()).then(elements => codeElements = [...elements]);
    }

    let kindsOfCodeElements: string[] = undefined;
    let codeElements: CodeElement[] = undefined;
    let projects: Project[] = undefined;

    let selectedProject: Project = undefined;
    let selectedCodeElement: CodeElement = undefined;
    let selectedRefactoring: Refactoring = undefined;

    let selectedCodeElementRefactorings: Refactoring[] = undefined;

    type RefactorSettingType = SubjectRefactorSetting | StringRefactorSetting | ChoiseRefactorSetting | BooleanRefactorSetting;
    let selectedRefactoringSettings: RefactorSettingType[] = undefined;

    let refactorSettingsResp = new Map<string, string>();

    let currentPage = 0;
    let numCodeElementPages = 1;

    let elementWhitelist: string[] = kindsOfCodeElements;

    $: {
        if (elementWhitelist) {
            getCodeElements(activeProjectUuid, maxItems, nameFilterValue, elementWhitelist.concat(",").toString()).then(elements => codeElements = [...elements]);
        }
    }
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

                {#if kindsOfCodeElements !== undefined}
                    <Textfield placeholder={"Name filter"} onInput={onNameFilterInput} extraStyling={"width:100%;margin-bottom:10px;"}/>
                    <MultiSelect id="elementWhitelist" bind:value={elementWhitelist}>
                        {#each kindsOfCodeElements as elementType}
                            <option value="{elementType}">{elementType}</option>
                        {/each}
                    </MultiSelect>

                    <hr>
                {/if}

				{#if codeElements !== undefined}
					<CodeElementView {codeElements} selectClb={selectElementClb} bind:selectedCodeElement={selectedCodeElement}/>
				{/if}

                <hr>

                <PageControl numPages={numCodeElementPages} bind:pageIndex={currentPage} onPageChanged={onCodeElementPageChanged}/>
		</div>

        <div class="info-container">
            <Heading content="Refactor"/>

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
                {#each selectedRefactoringSettings as setting, i}
                    {setting.label}:
                    <br>

                    {#if setting.type == "subject"}
                        <select style="width:100%" on:input="{(e) => refactorSettingsResp[setting.identifier] = e.target.value}">
                            <option value="" selected disabled hidden>Select a subject...</option>
                            {#await getCodeElements(activeProjectUuid, 9999, "", setting.codeElementType, false) then elements}
                                {#each elements as element, i}
                                    <option value="{element.name}">{element.name}</option>
                                {/each}
                            {/await}
                        </select>
                    {/if}

                    {#if setting.type == "boolean"}
                        <!-- draw widget here -->
                        Boolean setting
                    {/if}

                    {#if setting.type == "choice"}
                        <!-- draw widget here -->
                        Choice setting
                    {/if}
                    
                    {#if setting.type == "string"}
                        <!-- draw widget here -->
                        String setting
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