<!--
  See the NOTICE file distributed with this work for additional
  information regarding copyright ownership.

  This is free software; you can redistribute it and/or modify it
  under the terms of the GNU Lesser General Public License as
  published by the Free Software Foundation; either version 2.1 of
  the License, or (at your option) any later version.

  This software is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this software; if not, write to the Free
  Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
  02110-1301 USA, or see the FSF site: http://www.fsf.org.
-->
<script setup lang="ts">
import XBtn from "./components/XBtn.vue";
import XDialog from "./components/XDialog.vue";
import { appShare } from "../appShare";
import { onMounted, ref } from "vue";
import type { Ref } from "vue";

const dialog = ref();
const details: Ref<
  { url: string; name: string; size: string; mimeType: string } | undefined
> = ref();
const savers = appShare().filter((as) =>
  as.capabilities.some((capability) => capability.action == "SAVE"),
);

const currentSaver = ref(savers[0]);
const error = ref();

onMounted(() => {
  const rootEl = document.querySelector("#openburo-share-root")!;
  rootEl.addEventListener("show-share-modal", (e) => {
    dialog.value = true;
    error.value = undefined;
    details.value = (e as CustomEvent).detail;
  });
});

// eslint-disable-next-line max-statements
function sendFile() {
  const path = currentSaver.value.capabilities.find(
    (c) => c.action == "SAVE",
  )?.path;
  error.value = undefined;
  if (!path) {
    error.value =
      "no path found for action PICK and pick " + currentSaver.value.id;
    return;
  }

  const randomID = crypto.randomUUID();
  const url: string = `${new URL(path, currentSaver.value.url)}?${new URLSearchParams(
    {
      clientUrl: window.location.origin,
      // Random value, we have no use for it yet
      id: randomID,
      type: "downloadUrl",
      // TODO: use allowed mimetypes from config here
      allowedMimeType: "*/*",
      multiple: "true",
    },
  )}`;
  const popup = window.open(url, `${randomID}ShareWindow`, "popup=true")!;

  popup.onerror = function (msg) {
    console.debug("popup onerror", msg);
    error.value = msg;
    popup.close();
    return true; // Prevents default browser handling
  };
  try {
    enum State {
      START,
      READY,
    }

    const state = { value: State.START };

    // eslint-disable-next-line max-statements
    window.addEventListener("message", async (event) => {
      try {
        console.debug("showShareModal", event);
        // Check if the event is from the popup we just opened
        if (event.source !== popup) {
          console.log("source dismissed", event.source, popup);
          return;
        }

        if (state.value === State.START) {
          if (event.data.status === "ready" && event.data.id === randomID) {
            state.value = State.READY;

            const detailsObject = details.value!;
            console.log("post messaage to ", currentSaver.value.url);
            popup.postMessage(
              {
                status: "save",
                id: randomID,
                results: [
                  {
                    name: detailsObject.name,
                    mimeType: detailsObject.mimeType,
                    size: detailsObject.size,
                    downloadUrl: detailsObject.url,
                  },
                ],
              },
              currentSaver.value.url,
            );
          }
        } else if (state.value === State.READY) {
          if (event.data.status === "error") {
            error.value = event.data.message;
            popup.close();
          } else if (event.data.status === "done") {
            new XWiki.widgets.Notification(
              `File ${details.value?.name} uploaded`,
              "done",
            );
            popup.close();
          } else {
            console.debug("unknown staus for event", event);
          }
        } else {
          console.debug("unknown state with event", event);
        }
      } catch (e) {
        if (e instanceof Error) {
          error.value = e.message;
        } else {
          error.value = `${e}`;
        }
        popup.close();
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = `${e}`;
    }
    popup?.close();
  }
}
</script>

<template>
  <x-dialog title="Share with remote services" v-model="dialog" width="600px">
    <template #default>
      <div v-if="details">
        Share file
        <a :href="details.url">{{ details.name }}</a>
        ({{ details.mimeType }} / {{ details.size }}b)
      </div>
      <div>
        <strong>Save Apps</strong>
        <div v-if="savers.length > 0">
          <x-btn
            v-for="saver in savers"
            :key="saver.id"
            :variant="saver.id == currentSaver.id ? 'primary' : 'default'"
            @click="currentSaver = saver"
            :class="$style.margin"
          >
            {{ saver.name }}
          </x-btn>
        </div>
        <div v-else>No saver apps available</div>
      </div>
    </template>
    <template #footer>
      <x-btn variant="primary" @click="sendFile">Send file</x-btn>
      <div v-if="error">{{ error }}</div>
    </template>
  </x-dialog>
</template>

<style module>
.margin {
  margin-right: 1em;
}
</style>
