/**
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
import ShareRoot from "./vue/ShareRoot.vue";
import { createApp } from "vue";

export function initShare() {
  const rootElement = document.createElement("div");
  rootElement.id = "openburo-share-root";

  document.body.append(rootElement);

  createApp(ShareRoot, {}).mount(rootElement);

  // TODO: move somewhere else, specific to the share action
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require(["jquery"], ($: JQueryStatic) => {
    $(document).on("click", ".actionshare.action", (e) => {
      const event = new CustomEvent("show-share-modal", {
        detail: {
          url: $(e.target).data("attachment-url"),
          name: $(e.target).data("attachment-name"),
          size: $(e.target).data("attachment-size"),
          mimeType: $(e.target).data("attachment-mimetype"),
        },
        bubbles: true,
      });
      rootElement.dispatchEvent(event);
    });
  });
}
