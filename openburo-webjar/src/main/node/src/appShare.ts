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

type Properties = {
  mimeTypes: string[];
  multiple?: boolean;
  // TODO: not exactly sure what is is for, and it can possibly be specific to PICK actions
  sourceItems?: string[];
};

type Capability = {
  action: "SAVE" | "PICK";
  properties: Properties;
  path: string;
};

type AppShare = {
  id: string;
  name: string;
  url: string;
  version: string;
  display?: "modal";
  capabilities: Capability[];
};

type AppShares = AppShare[];

let config: undefined | AppShares = undefined;

// eslint-disable-next-line max-statements
function internal(): AppShares {
  const text = document
    .getElementById("xwiki-contrib-openburo-configuration")
    ?.textContent.trim();
  if (!text) {
    console.debug("Openburo configuration not found");
    new XWiki.widgets.Notification("Openburo configuration not found", "error");
    return [];
  }
  try {
    const parse = JSON.parse(text);
    if (["{}", "[]"].includes(JSON.stringify(parse))) {
      new XWiki.widgets.Notification(
        "Empty Openburo configuration, please add a manifest in the administration",
        "error",
      );
      return [];
    }
    return parse;
  } catch (e) {
    console.debug("Unable to parse Openburo configuration", e);
    new XWiki.widgets.Notification(
      "Unable to parse Openburo configuration",
      "error",
    );
    return [];
  }
}

export function appShare(): AppShares {
  if (!config) {
    config = internal();
  }
  return config;
}
