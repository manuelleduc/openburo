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
package org.xwiki.contrib.openburo.internal;

import java.util.List;

import jakarta.inject.Named;
import jakarta.inject.Singleton;

import org.xwiki.component.annotation.Component;
import org.xwiki.model.reference.LocalDocumentReference;

import com.xpn.xwiki.doc.AbstractMandatoryClassInitializer;
import com.xpn.xwiki.objects.classes.BaseClass;

import static com.xpn.xwiki.objects.classes.TextAreaClass.ContentType;
import static com.xpn.xwiki.objects.classes.TextAreaClass.EditorType;

/**
 * Initialize the configuration object.
 *
 * @version $Id$
 * @since 1.0.0
 */
@Component
@Singleton
@Named("XWiki.Openbruo.ConfigurationClass")
public class OpenburoConfigurationMandatoryDocumentInitializer extends AbstractMandatoryClassInitializer
{
    /**
     * Configuration class for openburo.
     */
    public static final LocalDocumentReference CONFIG_CLASS_REFERENCE =
        new LocalDocumentReference(List.of("XWiki", "Openburo"), "ConfigurationClass");

    /**
     * Manifest class field.
     */
    public static final String MANIFEST_FIELD = "manifest";

    /**
     * Default constructor.
     */
    public OpenburoConfigurationMandatoryDocumentInitializer()
    {
        super(CONFIG_CLASS_REFERENCE);
    }

    @Override
    protected void createClass(BaseClass xclass)
    {
        super.createClass(xclass);

        xclass.addTextAreaField(MANIFEST_FIELD, "Manifest", 10, 10, EditorType.PURE_TEXT, ContentType.PURE_TEXT);
    }
}
