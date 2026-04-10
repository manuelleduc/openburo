/*
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
package org.xwiki.contrib.openburo;

import java.util.List;

import jakarta.inject.Inject;
import jakarta.inject.Named;
import jakarta.inject.Provider;
import jakarta.inject.Singleton;

import org.slf4j.Logger;
import org.xwiki.bridge.DocumentAccessBridge;
import org.xwiki.component.annotation.Component;
import org.xwiki.model.reference.DocumentReference;
import org.xwiki.model.reference.LocalDocumentReference;
import org.xwiki.script.service.ScriptService;
import org.xwiki.stability.Unstable;

import com.xpn.xwiki.XWikiContext;

import static org.apache.commons.lang3.exception.ExceptionUtils.getRootCauseMessage;
import static org.xwiki.contrib.openburo.internal.OpenburoConfigurationMandatoryDocumentInitializer.CONFIG_CLASS_REFERENCE;
import static org.xwiki.contrib.openburo.internal.OpenburoConfigurationMandatoryDocumentInitializer.MANIFEST_FIELD;

/**
 * Provide the services for openburo, mainly access to configuration.
 *
 * @version $Id$
 * @since 1.0.0
 */
@Component
@Singleton
@Named("openburo")
@Unstable
public class OpenburoScriptService implements ScriptService
{
    /**
     * Reference to the openburo configuration document.
     */
    public static final LocalDocumentReference CONFIG_REFERENCE =
        new LocalDocumentReference(List.of("XWiki", "Openburo"), "Configuration");

    private static final String EMPTY_JSON_ARRAY = "[]";

    @Inject
    private DocumentAccessBridge documentAccessBridge;

    @Inject
    private Provider<XWikiContext> contextProvider;

    @Inject
    private Logger logger;

    /**
     *
     * @return the openburo manifest
     */
    public String getManifest()
    {
        try {
            // TODO: replace by a proper configuration API use.
            var xWikiContext = this.contextProvider.get();
            var doc = xWikiContext.getWiki().getDocument(new DocumentReference(CONFIG_REFERENCE,
                xWikiContext.getWikiReference()), xWikiContext);
            var obj = doc.getXObject(CONFIG_CLASS_REFERENCE);
            if (obj == null) {
                this.logger.debug("Fail to find an object of type [] in [].");
                return EMPTY_JSON_ARRAY;
            } else {
                return obj.getLargeStringValue(MANIFEST_FIELD);
            }
        } catch (Exception e) {
            this.logger.warn("Failed to load the openburo configuration. Cause: [{}]", getRootCauseMessage(e));
            return EMPTY_JSON_ARRAY;
        }
    }
}
