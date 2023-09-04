<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import type { ModuleLayoutType } from "./Grid.svelte";

  export let layout: ModuleLayoutType,
    handleRowStartMouseDown: MouseEventHandler<HTMLElement>,
    handleColStartMouseDown: MouseEventHandler<HTMLElement>,
    handleRowEndMouseDown: MouseEventHandler<HTMLElement>,
    handleColEndMouseDown: MouseEventHandler<HTMLElement>;
  let classAlias: string = "";
  export { classAlias as class };
</script>

<div
  class="relative p-4 bg-base-200 rounded-box shadow-xl {classAlias}"
  style="grid-area: {layout.rowStart}/{layout.colStart}/{layout.rowEnd}/{layout.colEnd};"
>
  <slot />
  <button
    class="absolute w-full cursor-row-resize p-1 top-0 left-0"
    on:mousedown={handleRowStartMouseDown}
  />
  <button
    class="absolute h-full cursor-col-resize p-1 top-0 left-0"
    on:mousedown={handleColStartMouseDown}
  />
  <button
    class="absolute w-full cursor-row-resize p-1 bottom-0 left-0"
    on:mousedown={handleRowEndMouseDown}
  />
  <button
    class="absolute h-full cursor-col-resize p-1 top-0 right-0"
    on:mousedown={handleColEndMouseDown}
  />
</div>
