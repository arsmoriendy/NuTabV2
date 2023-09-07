<script lang="ts">
  let accessToken: undefined | string = localStorage["twitchAccessToken"];
  let userId: undefined | string = localStorage["twitchUserId"];
  let followList: any[] = [];

  const redirectUri = import.meta.env["DEV"]
    ? import.meta.env["VITE_TWITCH_REDIRECT_URI"]
    : "https://api.arsmoriendy.com/NuTabV2";

  // check state, get access token, get user id, save to localStorage
  (async () => {
    if (localStorage["twitchState"] !== undefined) {
      const tokenResponse = await fetch(
        `${redirectUri}/token?state=` + localStorage["twitchState"]
      );

      if (tokenResponse.status === 200) {
        accessToken = (await tokenResponse.json())["accessToken"];
        userId = await getUserId(accessToken!);
        localStorage["twitchAccessToken"] = accessToken;
        localStorage["twitchUserId"] = userId;
      }
      localStorage.removeItem("twitchState");
    }
  })();

  // periodically refresh follow list
  const delay = 5000;
  (async function refreshFollowList() {
    if (accessToken !== undefined && userId !== undefined) {
      followList = await getFollowList(accessToken, userId);
    }
    setTimeout(refreshFollowList, delay);
  })();

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
    followURL.searchParams.append("first", "10");
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

{#if accessToken === undefined}
  <button
    class="btn btn-primary"
    on:click={() => giveAuthorization(redirectUri)}>Authenticate</button
  >
{:else}
  {#each followList as i}
    <p>{i["user_name"]}</p>
  {/each}
{/if}
