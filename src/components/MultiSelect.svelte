<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    export let id = '';
    export let value = [];
    export let readonly = false;
    export let placeholder = '';
  
    let input, 
      inputValue, 
      options = [],
      activeOption, 
      showOptions = false,
      selected = {},
      first = true,
      slot
    const iconClearPath = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';
  
    onMount(() => {
      slot.querySelectorAll('option').forEach(o => {
        o.selected && !value.includes(o.value) && (value = [...value, o.value]);
        options = [...options, {value: o.value, name: o.textContent}]
      });
      value && (selected = options.reduce((obj, op) => value.includes(op.value) ? {...obj, [op.value]: op} : obj, {}));
      first = false;
    });
  
    $: if (!first) value = Object.values(selected).map(o => o.value);
    $: filtered = options.filter(o => inputValue ? o.name.toLowerCase().includes(inputValue.toLowerCase()) : o);
    $: if (activeOption && !filtered.includes(activeOption) || !activeOption && inputValue) activeOption = filtered[0];
  
  
    function add(token) {
      if (!readonly) selected[token.value] = token;
    }
  
    function remove(vall) {
      if (!readonly) {
        const {[vall]: val, ...rest} = selected;
        selected = rest;
      }
    }
  
    function optionsVisibility(show) {
      if (readonly) return;
      if (typeof show === 'boolean') {
        showOptions = show;
        show && input.focus();
      } else {
        showOptions = !showOptions;
      }
      if (!showOptions) {
        activeOption = undefined;
      }
    }
  
    function handleKeyup(e) {
      if (e.keyCode === 13) {
        Object.keys(selected).includes(activeOption.value) ? remove(activeOption.value) : add(activeOption);
        inputValue = '';
      }
      if ([38,40].includes(e.keyCode)) { // up and down arrows
        const increment = e.keyCode === 38 ? -1 : 1;
        const calcIndex = filtered.indexOf(activeOption) + increment;
        activeOption = calcIndex < 0 ? filtered[filtered.length - 1]
          : calcIndex === filtered.length ? filtered[0]
          : filtered[calcIndex];
      }
    }
  
    function handleBlur(e) {
      optionsVisibility(false);
    }
  
    function handleTokenClick(e) {
      if (e.target.closest('.token-remove')) {
        e.stopPropagation();
        remove(e.target.closest('.token').dataset.id);
      } else if (e.target.closest('.remove-all')) {
        selected = [];
        inputValue = '';
      } else {
        optionsVisibility(true);
      }
    }
  
    function handleOptionMousedown(e) {
      const value = e.target.dataset.value;
      if (selected[value]) {
        remove(value);
      } else {
        add(options.filter(o => o.value === value)[0]);
        input.focus();
      }
    }
  </script>
  
  <style>
    .multiselect {
      border-radius: 4px;
		  background-color: #21252b;
      position: relative;
      color: white;
    }

    .tokens {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      position: relative;
    }

    .tokens.showOptions::after { 
      width: 100%; 
      left: 0; 
    }
    
    .token {
      align-items: center;
      background-color: #21252b;
      border-radius: 1.25rem;
      display: flex;
      margin: .25rem .5rem .25rem 0;
      max-height: 1.3rem;
      padding: .25rem 0 0 .5rem;
      transition: background-color .3s;
      white-space: nowrap;
      color: white;
    }

    .readonly .token {
      color: hsl(0, 0%, 40%);
      color: white;
    }

    .token-remove {
      align-items: center;
      background-color: hsl(214, 15%, 55%);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      height: 1.25rem;
      margin-left: .25rem;
      min-width: 1.25rem;
      color: white;
    }
    
    .token-remove:hover {
      background-color: hsl(215, 21%, 43%);
      cursor: pointer;
      color: white;
    }
  
    .actions {
      align-items: center;
      display: flex;
      flex: 1;
      min-width: 15rem;
      color: white;
    }
  
    .select {
      border: none;
      border-radius: 4px;
      padding: 7px;
      font-size: 16px;
      margin: 0;
      outline: none;
      width: 100%;
      background-color: #21252b;
      pointer-events: none;
      color: white;
    }
  
    .multiselect:hover .dropdown-arrow path {
      fill: hsl(0, 0%, 50%);
    }
  
    .icon-clear path {
      background-color: #21252b;
    }
  
    .options {
      box-shadow: 0px 2px 4px rgba(0,0,0,.1), 0px -2px 4px rgba(0,0,0,.1);
      left: 0;
      list-style: none;
      margin-block-end: 0;
      margin-block-start: 0;
      max-height: 70vh;
      overflow: auto;
      padding-inline-start: 0;
      position: absolute;
      top: calc(100% + 1px);
      width: 100%;
    }

    li {
      background-color: #21252b;
      cursor: pointer;
      padding: .5rem;
      color: white;
    }

    li:last-child {
      border-bottom-left-radius: .2rem;
      border-bottom-right-radius: .2rem;
    }
    li:not(.selected):hover {
      background-color: #2b3038;
    }
    li.selected {
      background-color: #2b3038;
      color: white;
    }

    li.active {
      background-color: #2b3038;
    }
    li.selected.active, li.selected:hover {
      background-color: #2b3038;
    }
  
    .hidden {
      display: none;
    }
  </style>
  
  <div class="multiselect" class:readonly>
    <div class="tokens" class:showOptions on:click={handleTokenClick}>
      {#each Object.values(selected) as s}
        <div class="token" data-id="{s.value}">
          <span>{s.name}</span>
          {#if !readonly}
            <div class="token-remove" title="Remove {s.name}">
              <svg class="icon-clear" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="{iconClearPath}"/>
              </svg>
            </div>
          {/if}
        </div>
      {/each}
      <div class="actions">
        {#if !readonly}
          <select id={id} class="select" autocomplete="off" bind:value={inputValue} bind:this={input} on:keyup={handleKeyup} on:blur={handleBlur} placeholder={placeholder}/>
        {/if}
      </div>
    </div>
  
    <select bind:this={slot} type="multiple" class="hidden"><slot></slot></select>
    
    {#if showOptions}
      <ul class="options" on:mousedown|preventDefault={handleOptionMousedown}>
        {#each filtered as option}
          <li class:selected={selected[option.value]} class:active={activeOption === option} data-value="{option.value}">{option.name}</li>
        {/each}
      </ul>
    {/if}
  </div>