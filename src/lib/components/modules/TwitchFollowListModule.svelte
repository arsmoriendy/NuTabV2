<script lang="ts">
  let accessToken: undefined | string = localStorage["twitchAccessToken"];
  let userId: undefined | string = localStorage["twitchUserId"];

  const redirectUri = import.meta.env["DEV"]
    ? import.meta.env["VITE_TWITCH_REDIRECT_URI"]
    : "https://api.arsmoriendy.com/NuTabV2";

  // check state, get access token, get user id, save to localStorage
  (async () => {
    if (localStorage["twitchState"] !== undefined) {
      const tokens = await getTokens(localStorage["twitchState"]);

      accessToken = tokens.accessToken;
      userId = await getUserId(accessToken!);

      localStorage["twitchAccessToken"] = accessToken;
      localStorage["twitchUserId"] = userId;

      localStorage.removeItem("twitchState");
    }
  })();

  /**
   * Returns an object that contains accesToken and refreshToken
   * @param {string} state - used as a unique index key for token values
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  async function getTokens(
    state: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch(`${redirectUri}/token?state=` + state);
    return await response.json();
  }

  let delay: number = localStorage["twitchRefreshFollowListDelay"]
    ? JSON.parse(localStorage["twitchRefreshFollowListDelay"])
    : 5000; // default delay

  $: {
    localStorage["twitchRefreshFollowListDelay"] = delay;
  }

  // periodically refresh follow list
  let followList: any[] = [];
  (async function refreshFollowList() {
    if (accessToken !== undefined && userId !== undefined) {
      followList = await getFollowList(accessToken, userId);
    }
    setTimeout(refreshFollowList, delay);
  })();

  // toggle settings
  let settingsShown: boolean = false;
  function showSettings() {
    settingsShown = true;
  }
  function hideSettings() {
    settingsShown = false;
  }

  function resetSettings() {
    delay = 5000;
    accessToken = undefined;
    userId = undefined;
    localStorage.removeItem("twitchRefreshFollowListDelay");
    localStorage.removeItem("twitchAccessToken");
    localStorage.removeItem("twitchUserId");
  }

  function giveAuthorization(redirectUri: string) {
    const state = String.fromCharCode(
      ...crypto.getRandomValues(new Uint32Array(30)).map((int) => {
        int %= 31;
        return int < 10 ? int + 48 : int + 87;
      })
    );
    localStorage["twitchState"] = state;
    location.href =
      `https://id.twitch.tv/oauth2/authorize?client_id=yffbv3l3u4erjnr9q26nl43qjqw6xz&force_verify=true&redirect_uri=${redirectUri}/auth&response_type=code&scope=user%3Aread%3Afollows&state=` +
      state;
  }

  async function getFollowList(
    accessToken: string,
    userId: string,
    after: string | undefined = undefined
  ): Promise<any[]> {
    const followURL = new URL("https://api.twitch.tv/helix/streams/followed");
    followURL.searchParams.append("user_id", userId);
    if (after !== undefined) followURL.searchParams.append("after", after);

    const followResponse = await fetch(followURL, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Client-Id": "yffbv3l3u4erjnr9q26nl43qjqw6xz",
      },
    });

    // TODO handle errors
    const followResponseJSON = await followResponse.json();

    const followList = followResponseJSON["data"];
    after = followResponseJSON["pagination"]["cursor"];

    if (after === undefined) {
      return followList;
    } else {
      return [
        ...followList,
        ...(await getFollowList(accessToken, userId, after)),
      ];
    }
  }

  async function getUserId(accessToken: string): Promise<string> {
    const response = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Client-Id": "yffbv3l3u4erjnr9q26nl43qjqw6xz",
      },
    });
    const responseJSON = await response.json();
    return responseJSON["data"][0]["id"];
  }
</script>

<div class="relative w-full h-full overflow-hidden">
  <!-- settings -->
  <div
    class="flex flex-col gap-4 w-full h-full absolute top-0 transition-[right] {settingsShown
      ? 'right-0'
      : 'right-[-100%]'}"
  >
    <div class="flex gap-4">
      <button on:click={hideSettings}
        ><i class="fa-solid fa-chevron-left" /></button
      >
      <p class="font-bold">Settings</p>
    </div>
    <div class="grid grid-cols-[auto,max-content] gap-4 items-center">
      <div>
        Refresh Delay <span class="badge badge-sm badge-neutral ml-1"
          >milliseconds</span
        >
      </div>
      <input
        type="number"
        bind:value={delay}
        step="1000"
        min="0"
        max="60000"
        class="input input-xs text-right"
      />
      <input
        type="range"
        bind:value={delay}
        step="1000"
        min="0"
        max="60000"
        class="range range-xs col-span-2"
      />

      <div>Reset</div>
      <button class="btn btn-xs btn-error" on:click={resetSettings}
        >Reset</button
      >
    </div>
  </div>

  <!-- contents -->
  <div
    class="flex flex-col gap-4 w-full h-full absolute top-0 transition-[left] {settingsShown
      ? 'left-[-100%]'
      : 'left-0'}"
  >
    <div class="flex justify-between">
      <p class="font-bold">Followed Channels</p>
      <button on:click={showSettings}><i class="fa-solid fa-gear" /></button>
    </div>

    {#if accessToken !== undefined && userId !== undefined}
      <div class="overflow-y-auto">
        {#each followList as i}
          <p>{i["user_name"]}</p>
        {/each}
      </div>
    {:else}
      <button
        class="btn btn-primary"
        on:click={() => giveAuthorization(redirectUri)}>Authenticate</button
      >
    {/if}
  </div>
</div>
