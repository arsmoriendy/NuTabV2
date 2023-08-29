<script lang="ts">
  const daisyThemes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  let theme = localStorage["theme"] ?? "auto";
  let preferedDarkTheme = localStorage["preferedDarkTheme"] ?? "dark";
  let preferedLightTheme = localStorage["preferedLightTheme"] ?? "light";

  $: {
    if (theme === "auto") {
      localStorage.removeItem("theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", preferedDarkTheme);
      } else {
        document.documentElement.setAttribute("data-theme", preferedLightTheme);
      }
    } else {
      localStorage["theme"] = theme;
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  $: {
    localStorage["preferedDarkTheme"] = preferedDarkTheme;
  }

  $: {
    localStorage["preferedLightTheme"] = preferedLightTheme;
  }

  const handleThemeDrag = (e: DragEvent) => {
    e.dataTransfer?.setData(
      "text/plain",
      (e.currentTarget as Element).getAttribute("data-theme")!
    );
  };

  const handleCurrentThemeDrop = (e: DragEvent) => {
    e.preventDefault();
    theme = e.dataTransfer?.getData("text/plain")!;
  };

  const handleClearCurrentTheme = () => {
    theme = "auto";
  };

  const cardClassList =
    "card card-compact inline-flex select-none shadow-xl outline-accent";
</script>

<div class="p-2 bg-base-200">
  <header class="p-2">
    <h1 class="text-2xl font-semibold">Theme Selector</h1>
    <small class="opacity-60">Drag and drop to select themes</small>
  </header>

  <div class="divider" />

  <div class="grid grid-cols-[repeat(3,_max-content)] gap-2 p-2 items-center">
    <div>
      <h2 class="text-lg font-semibold">Current Theme</h2>
      <small class="opacity-60"
        >App wide theme, override prefered system theme</small
      >
    </div>

    <div class="divider divider-horizontal" />

    <div class="indicator group">
      {#if theme !== "auto"}
        <button
          class="indicator-item badge badge-error transition-[transform] scale-0 group-hover:scale-100 cursor-pointer"
          on:click={handleClearCurrentTheme}
        >
          <i class="fa-solid fa-xmark absolute" />
        </button>
      {/if}

      <div
        data-theme={theme}
        class="{cardClassList} cursor-default {theme === 'auto'
          ? 'outline-dashed'
          : 'outline'}"
        on:drop={handleCurrentThemeDrop}
        on:dragover={(e) => {
          e.preventDefault();
        }}
        role="listitem"
      >
        <div class="card-body">
          <p class="font-semibold">
            {#if theme === "auto"}
              <b>Auto: </b>
              {document.documentElement.getAttribute("data-theme")}
            {:else}
              {theme}
            {/if}
          </p>
          <div class="flex">
            <div class="p-1 bg-secondary" />
            <div class="p-1 bg-accent" />
            <div class="p-1 bg-neutral" />
            <div class="p-1 bg-base-100" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Prefered Dark Theme</h2>
      <small class="opacity-60"
        >App wide theme to be picked when system theme is set to <b>dark</b></small
      >
    </div>

    <div class="divider divider-horizontal" />

    <div
      data-theme={preferedDarkTheme}
      class="{cardClassList} cursor-default outline"
      on:drop={(e) => {
        e.preventDefault();
        preferedDarkTheme = e.dataTransfer?.getData("text/plain");
      }}
      on:dragover={(e) => {
        e.preventDefault();
      }}
      role="listitem"
    >
      <div class="card-body">
        <p class="font-semibold">
          {preferedDarkTheme}
        </p>
        <div class="flex">
          <div class="p-1 bg-secondary" />
          <div class="p-1 bg-accent" />
          <div class="p-1 bg-neutral" />
          <div class="p-1 bg-base-100" />
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Prefered Light Theme</h2>
      <small class="opacity-60"
        >App wide theme to be picked when system theme is set to <b>light</b></small
      >
    </div>

    <div class="divider divider-horizontal" />

    <div
      data-theme={preferedLightTheme}
      class="{cardClassList} cursor-default outline"
      on:drop={(e) => {
        e.preventDefault();
        preferedLightTheme = e.dataTransfer?.getData("text/plain");
      }}
      on:dragover={(e) => {
        e.preventDefault();
      }}
      role="listitem"
    >
      <div class="card-body">
        <p class="font-semibold">
          {preferedLightTheme}
        </p>
        <div class="flex">
          <div class="p-1 bg-secondary" />
          <div class="p-1 bg-accent" />
          <div class="p-1 bg-neutral" />
          <div class="p-1 bg-base-100" />
        </div>
      </div>
    </div>
  </div>

  <div class="divider" />

  <div class="flex flex-wrap gap-2" role="list">
    {#each daisyThemes as theme}
      <div
        data-theme={theme}
        draggable="true"
        class="{cardClassList} cursor-grab hover:outline"
        on:dragstart={handleThemeDrag}
        role="listitem"
        aria-grabbed="false"
      >
        <div class="card-body">
          <p class="font-semibold">{theme}</p>
          <div class="flex">
            <div class="p-1 bg-secondary" />
            <div class="p-1 bg-accent" />
            <div class="p-1 bg-neutral" />
            <div class="p-1 bg-base-100" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
