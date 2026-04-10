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
import { ref } from "vue";

const dialog = ref();

function openModal() {
  dialog.value = true;
}
const picks = appShare().filter((as) =>
  as.capabilities.some((capability) => capability.action == "PICK"),
);

const currentPicker = ref(picks[0]);
const error = ref();

// eslint-disable-next-line max-statements
function openRemoteSource() {
  const path = currentPicker.value.capabilities.find(
    (c) => c.action == "PICK",
  )?.path;
  error.value = undefined;
  if (!path) {
    error.value =
      "no path found for action PICK and pick " + currentPicker.value.id;
    return;
  }
  try {
    // See https://benibur.github.io/openburo-spec/sujets-ateliers.html#callback--r%C3%A9sultat
    const randomID = crypto.randomUUID();
    const url: string = `${new URL(path, currentPicker.value.url)}?${new URLSearchParams(
      {
        clientUrl: window.location.origin,
        // Random value, we have no use for it yet
        id: randomID,
        type: "payload",
        // TODO: use allowed mimetypes from config here
        allowedMimeType: "*/*",
        multiple: "true",
      },
    )}`;
    const popup = window.open(url, `${randomID}ShareWindow`, "popup=true");
    // eslint-disable-next-line max-statements
    window.addEventListener("message", async (event) => {
      // Check if the event is from the popup we just opened
      if (event.source !== popup) {
        return;
      }

      if (event.origin !== currentPicker.value.url) {
        console.debug(
          "message rejected",
          `${url} expected but ${event.origin} received`,
        );
        return;
      }

      popup?.close();

      console.debug("Received:");

      const data: {
        id: string;
        results: { name: string; mimeType: string; payload: string }[];
      } = event.data;
      dialog.value = false;
      // https://www.xwiki.org/xwiki/bin/view/Documentation/UserGuide/Features/XWikiRESTfulAPI#H2Fwikis2F7BwikiName7D2Fspaces2F7BspaceName7D5B2Fspaces2F7BnestedSpaceName7D5D2A2Fpages2F7BpageName7D2Fattachments2F7BattachmentName7D

      const dt = new DataTransfer();
      for (const result of data.results) {
        const bin = atob(result.payload);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          arr[i] = bin.charCodeAt(i);
        }
        const file = new File([arr], result.name, { type: result.mimeType });
        dt.items.add(file);
      }

      const input = document.getElementById(
        "xwikiuploadfile",
      )! as HTMLInputElement;

      input.files = dt.files;
      new XWiki.FileUploader(input, {
        responseContainer: document.createElement("div"),
        responseURL: "",
      });
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  } catch (e) {
    if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = `${e}`;
    }
  }
}
</script>

<template>
  <fieldset>
    <legend>Import attachments from a remote source</legend>
    <div>
      <x-btn @click="openModal">Pick</x-btn>
      <x-dialog
        title="Import attachments from a remote source"
        v-model="dialog"
        width="600px"
      >
        <template #default>
          <div>
            <strong>Source Apps</strong>
            <div v-if="picks.length > 0">
              <x-btn
                v-for="pick in picks"
                :key="pick.id"
                :variant="pick.id == currentPicker.id ? 'primary' : 'default'"
                @click="currentPicker = pick"
                :class="$style.margin"
              >
                {{ pick.name }}
              </x-btn>
            </div>
            <div v-else>No available openburo pickers</div>
          </div>
        </template>
        <template #footer>
          <x-btn variant="primary" @click="openRemoteSource">
            Open Selection
          </x-btn>
          <!-- TODO: style me -->
          <div v-if="error">{{ error }}</div>
        </template>
      </x-dialog>
    </div>
  </fieldset>
</template>

<style scoped>
legend {
  font-size: 1.3em; /* to stay consistent with "Attach files to this page" */
}
</style>
<style module>
.margin {
  margin-right: 1em;
}
</style>
