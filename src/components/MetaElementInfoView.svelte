<script lang="ts">
	import { pendingRefactor } from "../stores";

	import type { MetaElement } from "../types/MetaModel";
	import Heading from "./Heading.svelte";
	import { goto } from "$app/navigation";
	import Button from "../components/Button.svelte";
	import Textfield from "../components/Textfield.svelte";

	export let metaElement: MetaElement;

	const refactoringInfo = {
		"CLASS_RENAME": { icon: "fa-solid fa-pencil", text: "Rename", input: { name: "CLASS_RENAME_INPUT", placeholder: "Enter new name..." } },
		"CLASS_REMOVE": { icon: "fa-solid fa-trash-can", text: "Remove" },
		"CLASS_MOVE_UP": { icon: "fa-solid fa-arrow-up", text: "Move up" },
		"METHOD_RENAME": { icon: "fa-solid fa-pencil", text: "Rename", input: { name: "METHOD_RENAME_INPUT", placeholder: "Enter new name..." } },
		"METHOD_REMOVE": { icon: "fa-solid fa-trash-can", text: "Remove" },
		"METHOD_INLINE": { text: "Inline" },
		"METHOD_CHANGE_DECLARATION": { icon: "fa-solid fa-pencil", text: "Change declaration", input: { name: "METHOD_DECLARATION_INPUT", placeholder: "void F() // SEND THIS FROM BACKEND" } },
		"METHOD_MOVE": { icon: "fa-solid fa-up-down-left-right", text: "Move" },
		"METHOD_PARAMETERIZE": { icon: "fa-solid fa-right-to-bracket", text: "Parameterize" }
	};

	function doRefactoring(refactoringId: string, uuid: string): void {
		pendingRefactor.update(r => {
			r.id = refactoringId;
			r.uuid = uuid;

			const refactorInfo = refactoringInfo[refactoringId];
			if (refactorInfo.input !== undefined) {
				// this refactoring has an input, add it to the object
				r["input"] = (<HTMLInputElement>document.getElementsByName(refactorInfo.input.name)[0]).value;
			}

			console.log(JSON.stringify(r));

			return r;
		});

		goto("/refactoring");
	}
</script>

<div>
	<Heading content="Refactorings"/>
	{#if metaElement == undefined}
		<p>No item selected</p>
	{:else}
		<p>Selected: {metaElement.name}</p>
		{#if metaElement.refactorings !== null}
			{#each metaElement.refactorings as refactoringId}
				{#if refactoringInfo[refactoringId].input !== undefined}
					<Textfield name={refactoringInfo[refactoringId].input.name} placeholder={refactoringInfo[refactoringId].input.placeholder}/>
				{/if}

				<Button onClick={() => doRefactoring(refactoringId, metaElement.uuid)}>
					{#if refactoringInfo[refactoringId].icon !== undefined}
						<i class={refactoringInfo[refactoringId].icon}></i> 
					{/if}

					{refactoringInfo[refactoringId].text}
				</Button>
			{/each}
		{:else}
			This element doesn't support any refactorings.
		{/if}
	{/if}
</div>