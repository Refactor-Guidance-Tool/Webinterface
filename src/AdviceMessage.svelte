<script lang="ts">
  import type { AdviceData } from "./advice/advice";

  export let adviceData: AdviceData;
</script>

{#each adviceData.messages as message, i}
  {message}
  {#if i < adviceData.hazards.length}
    <p class="hazard tooltip">
      {adviceData.hazards[i].title}
      <span class="tooltiptext">{adviceData.hazards[i].message}</span>
    </p>
  {/if}
{/each}

<style>
  .hazard {
    cursor: pointer;
    text-decoration: underline;
    color: #71a9d7;
    margin: 0;
  }

  .tooltip {
    position: relative;
    display: inline-block;
    white-space: pre-line;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px;
    border-radius: 6px;

    position: absolute;
    z-index: 1;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>