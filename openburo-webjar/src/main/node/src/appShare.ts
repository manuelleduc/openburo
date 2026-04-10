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

export const appShare: AppShares = [
  {
    capabilities: [
      {
        action: "PICK",
        path: "http://10.4.0.32:5000/browse/",
        properties: {
          mimeTypes: ["*/*"],
        },
      },
      {
        action: "SAVE",
        path: "http://10.4.0.32:5000/save/",
        properties: {
          mimeTypes: ["*/*"],
        },
      },
    ],
    id: "webdav-filepicker",
    name: "WebDAV File Picker",
    url: "http://10.4.0.32:5000",
    version: "1",
  },
  {
    id: "xwiki",
    name: "XWiki",
    url: "http://10.4.0.13:7003",
    version: "2.0.0",
    capabilities: [
      {
        action: "PICK",
        properties: {
          mimeTypes: [
            "text/uri-list",
            "text/plain",
            "application/octet-stream",
            "application/pdf",
          ],
          sourceItems: ["xwiki-001", "xwiki-002"],
        },
        path: "select.html",
      },
      {
        action: "SAVE",
        properties: {
          mimeTypes: [
            "text/uri-list",
            "text/plain",
            "application/octet-stream",
            "application/pdf",
          ],
        },
        path: "share.html",
      },
    ],
  },
  {
    id: "webmail",
    name: "Webmail",
    url: "http://localhost:7002",
    version: "2.0.0",
    capabilities: [
      {
        action: "SAVE",
        properties: {
          mimeTypes: [
            "text/uri-list",
            "application/octet-stream",
            "application/pdf",
          ],
        },
        path: "share.html",
      },
    ],
  },
  {
    id: "jalios-demo",
    name: "Jalios Demo",
    url: "https://openburo-jalios.eu.ngrok.io/en/",
    version: "0.1",
    capabilities: [
      {
        action: "PICK",
        properties: {
          mimeTypes: ["*/*"],
          multiple: true,
        },
        path: "https://openburo-jalios.eu.ngrok.io/en/plugins/OpenBuroPlugin/jsp/openBuroChooser.jsp",
      },
    ],
  },
  {
    capabilities: [
      {
        action: "PICK",
        path: "http://837a-46-255-204-128.ngrok-free.app/embed/file-picker",
        properties: {
          mimeTypes: ["*/*"],
        },
      },
    ],
    id: "fichiers-file-picker",
    name: "Fichiers File Picker",
    url: "https://837a-46-255-204-128.ngrok-free.app",
    version: "1",
    display: "modal",
  },
  {
    id: "twake-drive-filepicker",
    name: "Twake Drive File Picker",
    url: "https://openburo1-drive.stg.lin-saas.com/openburo.json",
    version: "0.0.1",
    capabilities: [
      {
        action: "PICK",
        properties: {
          mimeTypes: ["*/*"],
        },
        path: "https://openburo1-drive.stg.lin-saas.com/capabilities/PICK",
      },
    ],
  },
];
