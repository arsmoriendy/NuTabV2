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

  let clickedTheme: string | null;

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

  const handleThemeClick = (e: Event) => {
    clickedTheme = (e.currentTarget as Element).getAttribute("data-theme");
  };

  const handleCurrentThemeDrop = (e: DragEvent) => {
    e.preventDefault();
    theme = e.dataTransfer?.getData("text/plain")!;
  };

  const handleCurrentThemeClick = () => {
    theme = clickedTheme ?? theme;
    clickedTheme = null;
  };

  const handlePreferedDarkThemeDrop = (e: DragEvent) => {
    e.preventDefault();
    preferedDarkTheme = e.dataTransfer?.getData("text/plain");
  };

  const handlePreferedDarkThemeClick = () => {
    preferedDarkTheme = clickedTheme ?? preferedDarkTheme;
    clickedTheme = null;
  };

  const handlePreferedLightThemeDrop = (e: DragEvent) => {
    e.preventDefault();
    preferedLightTheme = e.dataTransfer?.getData("text/plain");
  };

  const handlePreferedLightThemeClick = () => {
    preferedLightTheme = clickedTheme ?? preferedLightTheme;
    clickedTheme = null;
  };

  const handleClearCurrentTheme = () => {
    theme = "auto";
  };

  const handleThemeDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const cardClassList =
    "card card-compact inline-flex select-none shadow-xl !outline-accent !outline-offset-0 text-left";
</script>

<div class="p-2 bg-base-200 @container">
  <header class="p-2">
    <h1 class="text-2xl font-semibold">Theme Selector</h1>
    <small class="opacity-60">Drag and drop to select themes</small>
  </header>

  <div class="divider" />

  <div class="grid @xl:grid-cols-[repeat(3,max-content)] gap-2 p-2 items-center">
    <div>
      <h2 class="text-lg font-semibold">Current Theme</h2>
      <small class="opacity-60"
        >App wide theme, override prefered system theme</small
      >
    </div>

    <div class="divider divider-horizontal" />

    <div class="indicator group w-full">
      {#if theme !== "auto"}
        <button
          class="indicator-item badge badge-error transition-[transform] scale-0 group-hover:scale-100 cursor-pointer"
          on:click={handleClearCurrentTheme}
        >
          <i class="fa-solid fa-xmark absolute" />
        </button>
      {/if}

      <button
        data-theme={theme}
        class="{cardClassList} cursor-default grow !outline-0"
        on:drop={handleCurrentThemeDrop}
        on:dragover={handleThemeDragOver}
        on:click={handleCurrentThemeClick}
      >
        <div class="card-body">
          <p class="font-semibold">
            {#if theme === "auto"}
              <b>Auto: </b>
              {window.matchMedia("(prefers-color-scheme: dark)").matches
                ? preferedDarkTheme
                : preferedLightTheme}
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
      </button>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Prefered Dark Theme</h2>
      <small class="opacity-60"
        >App wide theme to be picked when system theme is set to <b>dark</b
        ></small
      >
    </div>

    <div class="divider divider-horizontal" />

    <button
      data-theme={preferedDarkTheme}
      class="{cardClassList} cursor-default !outline-0"
      on:drop={handlePreferedDarkThemeDrop}
      on:dragover={handleThemeDragOver}
      on:click={handlePreferedDarkThemeClick}
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
    </button>

    <div>
      <h2 class="text-lg font-semibold">Prefered Light Theme</h2>
      <small class="opacity-60"
        >App wide theme to be picked when system theme is set to <b>light</b
        ></small
      >
    </div>

    <div class="divider divider-horizontal" />

    <button
      data-theme={preferedLightTheme}
      class="{cardClassList} cursor-default !outline-0"
      on:drop={handlePreferedLightThemeDrop}
      on:dragover={handleThemeDragOver}
      on:click={handlePreferedLightThemeClick}
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
    </button>
  </div>

  <div class="divider" />

  <div class="flex flex-wrap gap-2" role="list">
    {#each daisyThemes as theme}
      <button
        data-theme={theme}
        draggable="true"
        class="{cardClassList} cursor-grab transition-[outline-width] !outline outline-0 focus:outline-4"
        on:dragstart={handleThemeDrag}
        on:click={handleThemeClick}
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
      </button>
    {/each}
  </div>
</div>
