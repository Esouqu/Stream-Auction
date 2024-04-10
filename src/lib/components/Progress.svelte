<script lang='ts'>
  export let max: number;
  export let value: number;

  $: isFull = value >= max;
</script>

<div class="progress-bar" class:full={isFull}>
  <span>Сила Замедления</span>
  <div style="position: relative; display: flex; align-items: center; justify-content: center;">
    {#if isFull}
      <span style="position: absolute; font-size: 14px; color: var(--on-surface);">Максимум</span>
    {/if}
    <progress {max} {value} />
  </div>
</div>

<style lang='scss'>
  .progress-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    padding: 10px 0;
    width: 100%;

    & progress {
      appearance: none;
      height: 20px;
  
      &::-webkit-progress-bar {
        border-radius: 1rem;
        box-shadow: inset 0 2px 4px black;
		    background-color: var(--surface-container);
      }
  
      &::-webkit-progress-value {
        border-radius: 1rem;
        background-color: var(--primary-50);
        transition: background-color 0.3s ease;
      }
    }

    &.full progress::-webkit-progress-value {
      background-color: var(--primary-container);
    }
  }

  
</style>