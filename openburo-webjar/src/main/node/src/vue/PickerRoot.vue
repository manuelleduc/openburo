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
console.log(appShare);
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
            <strong>Supported import formats</strong>
          </div>
        </template>
        <template #footer>
          <x-btn variant="primary">Open Selection</x-btn>
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
