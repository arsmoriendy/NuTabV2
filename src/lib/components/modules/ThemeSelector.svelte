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

  let clickedTheme: string | null;

  const handleThemeClick = (e: Event) => {
    clickedTheme = (e.currentTarget as Element).getAttribute("data-theme");
  };

  let currentThemeCategory: Element,
    preferedDarkThemeCategory: Element,
    preferedLightThemeCategory: Element;

  const handleThemeFocusOut = (e: FocusEvent) => {
    if (
      e.relatedTarget === currentThemeCategory ||
      e.relatedTarget === preferedDarkThemeCategory ||
      e.relatedTarget === preferedLightThemeCategory
    )
      return;
    clickedTheme = null;
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

  let closeInfo: Element;

  const handleCloseInfo = () => {
    closeInfo.remove();
    localStorage["hideTutorial-ThemeSelector"] = "true";
  };

  const cardClassList =
    "card card-compact inline-flex select-none shadow-xl !outline-accent !outline-offset-0 text-left";
  const cardCategoryClassList =
    "grid grid-rows-[repeat(2,auto)] grid-cols-[auto,max-content] grid-flow-col gap-x-4 rounded-box p-4 shadow-xl text-left";
</script>

<div class="p-4 bg-base-200 @xl:max-w-3xl rounded-box shadow-xl">
  <header class="mb-8 text-3xl font-bold">Theme Selector</header>

  {#if localStorage["hideTutorial-ThemeSelector"] !== "true"}
    <div class="alert alert-info shadow-xl mb-4" bind:this={closeInfo}>
      <i class="fa-solid fa-circle-info" />
      <div>
        <b>Drag or click</b> on <i>theme cards</i> and <b>drop or click</b> on
        <i>theme categories</i> to set app wide theme
      </div>
      <button class="fa-solid fa-xmark" on:click={handleCloseInfo} />
    </div>
  {/if}

  <div class="flex flex-col gap-4">
    <button
      data-theme={theme}
      class="{cardCategoryClassList} indicator w-auto group"
      on:drop={handleCurrentThemeDrop}
      on:dragover={handleThemeDragOver}
      on:click={handleCurrentThemeClick}
      bind:this={currentThemeCategory}
    >
      {#if theme !== "auto"}
        <button
          class="indicator-item badge badge-error transition-[transform] scale-0 group-hover:scale-100 cursor-pointer"
          on:click={handleClearCurrentTheme}
        >
          <i class="fa-solid fa-xmark absolute" />
        </button>
      {/if}
      <h2>Current Theme</h2>
      <small class="opacity-60"
        >App wide theme, override <b>auto system theme</b>.</small
      >
      <p class="text-sm font-semibold justify-self-end">
        {#if theme === "auto"}
          <b>auto</b>
          ({window.matchMedia("(prefers-color-scheme: dark)").matches
            ? preferedDarkTheme
            : preferedLightTheme})
        {:else}
          {theme}
        {/if}
      </p>
      <div class="flex items-start justify-self-end">
        <span class="p-1 bg-primary" />
        <span class="p-1 bg-secondary" />
        <span class="p-1 bg-accent" />
        <span class="p-1 bg-neutral" />
      </div>
    </button>

    <button
      data-theme={preferedDarkTheme}
      class={cardCategoryClassList}
      on:drop={handlePreferedDarkThemeDrop}
      on:dragover={handleThemeDragOver}
      on:click={handlePreferedDarkThemeClick}
      bind:this={preferedDarkThemeCategory}
    >
      <h2>Prefered Dark Theme</h2>
      <small class="opacity-60"
        >App wide theme to be picked when system theme is set to <b>dark</b
        ></small
      >
      <p class="text-sm font-semibold justify-self-end">
        {preferedDarkTheme}
      </p>
      <div class="flex items-start justify-self-end">
        <span class="p-1 bg-primary" />
        <span class="p-1 bg-secondary" />
        <span class="p-1 bg-accent" />
        <span class="p-1 bg-neutral" />
      </div>
    </button>

    <button
      data-theme={preferedLightTheme}
      class={cardCategoryClassList}
      on:drop={handlePreferedLightThemeDrop}
      on:dragover={handleThemeDragOver}
      on:click={handlePreferedLightThemeClick}
      bind:this={preferedLightThemeCategory}
    >
      <h2>Prefered Light Theme</h2>
      <small class="opacity-60"
        >App wide theme to be picked when system theme is set to <b>light</b
        ></small
      >
      <p class="text-sm font-semibold justify-self-end">
        {preferedLightTheme}
      </p>
      <div class="flex items-start justify-self-end">
        <span class="p-1 bg-primary" />
        <span class="p-1 bg-secondary" />
        <span class="p-1 bg-accent" />
        <span class="p-1 bg-neutral" />
      </div>
    </button>
  </div>

  <div class="divider" />

  <div class="flex flex-wrap gap-4" role="list">
    {#each daisyThemes as theme}
      <button
        data-theme={theme}
        draggable="true"
        class="{cardClassList} cursor-grab transition-[outline-width] !outline outline-0 focus:outline-4"
        on:dragstart={handleThemeDrag}
        on:click={handleThemeClick}
        on:focusout={handleThemeFocusOut}
        aria-grabbed="false"
      >
        <div class="card-body">
          <p class="font-semibold">{theme}</p>
          <div class="flex">
            <div class="p-1 bg-primary" />
            <div class="p-1 bg-secondary" />
            <div class="p-1 bg-accent" />
            <div class="p-1 bg-neutral" />
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>
