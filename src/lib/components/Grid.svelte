<script lang="ts" context="module">
  export type ModuleLayoutType = {
    [rowStart: string]: number;
    colStart: number;
    rowEnd: number;
    colEnd: number;
  };
</script>

<script lang="ts">
  import ModuleContainer from "./ModuleContainer.svelte";
  import TwitchFollowListModule from "./modules/TwitchFollowListModule.svelte";

  let gridEl: Element;
  let cols: number = 4;
  let rows: number = 3;

  const modulesStringMap = new Map([
    ["TwitchFollowListModule", TwitchFollowListModule],
  ]);

  type module = {
    name: string;
    layout: ModuleLayoutType;
  };
  let modules: module[] = localStorage["modules"]
    ? JSON.parse(localStorage["modules"])
    : // default modules
      [
        {
          name: "TwitchFollowListModule",
          layout: { rowStart: 2, colStart: 2, rowEnd: 3, colEnd: 4 },
        },
      ];

  let resizedModuleIndex: number | null = null;

  const handleRowStartMouseDown = (i: number) => {
    resizedModuleIndex = i;
    const handleRowStartMouseUp = (e: Event) => {
      const row =
        Math.trunc(((e as MouseEvent).clientY / gridEl.clientHeight) * rows) +
        1;
      modules[i].layout.rowStart = row;
      gridEl.removeEventListener("mouseup", handleRowStartMouseUp);
      resizedModuleIndex = null;
    };
    gridEl.addEventListener("mouseup", handleRowStartMouseUp);
  };

  const handleColStartMouseDown = (i: number) => {
    resizedModuleIndex = i;
    const handleColStartMouseUp = (e: Event) => {
      const col =
        Math.trunc(((e as MouseEvent).clientX / gridEl.clientWidth) * cols) + 1;
      modules[i].layout.colStart = col;
      gridEl.removeEventListener("mouseup", handleColStartMouseUp);
      resizedModuleIndex = null;
    };
    gridEl.addEventListener("mouseup", handleColStartMouseUp);
  };

  const handleRowEndMouseDown = (i: number) => {
    resizedModuleIndex = i;
    const handleRowEndMouseUp = (e: Event) => {
      const row =
        Math.trunc(((e as MouseEvent).clientY / gridEl.clientHeight) * rows) +
        2;
      modules[i].layout.rowEnd = row;
      gridEl.removeEventListener("mouseup", handleRowEndMouseUp);
      resizedModuleIndex = null;
    };
    gridEl.addEventListener("mouseup", handleRowEndMouseUp);
  };

  const handleColEndMouseDown = (i: number) => {
    resizedModuleIndex = i;
    const handleColEndMouseUp = (e: Event) => {
      const col =
        Math.trunc(((e as MouseEvent).clientX / gridEl.clientWidth) * cols) + 2;
      modules[i].layout.colEnd = col;
      gridEl.removeEventListener("mouseup", handleColEndMouseUp);
      resizedModuleIndex = null;
    };
    gridEl.addEventListener("mouseup", handleColEndMouseUp);
  };
</script>

<div
  class="grid h-screen gap-4 p-4"
  style="grid-template-columns: repeat({cols}, 1fr); grid-template-rows: repeat({rows}, 1fr);"
  bind:this={gridEl}
>
  {#each modules as module, i}
    <ModuleContainer
      class={resizedModuleIndex === i ? "pointer-events-auto opacity-60" : ""}
      layout={module.layout}
      handleRowStartMouseDown={() => {
        handleRowStartMouseDown(i);
      }}
      handleColStartMouseDown={() => {
        handleColStartMouseDown(i);
      }}
      handleRowEndMouseDown={() => {
        handleRowEndMouseDown(i);
      }}
      handleColEndMouseDown={() => {
        handleColEndMouseDown(i);
      }}
    >
      <svelte:component this={modulesStringMap.get(module.name)} />
    </ModuleContainer>
  {/each}
</div>
