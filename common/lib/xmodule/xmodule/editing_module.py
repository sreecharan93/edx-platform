"""Descriptors for XBlocks/Xmodules, that provide editing of atrributes"""

from pkg_resources import resource_string
from xmodule.mako_module import MakoModuleDescriptor
from xblock.core import Scope, String
import logging

log = logging.getLogger(__name__)


class EditingFields(object):
    """Contains specific template information (the raw data body)"""
    data = String(scope=Scope.content, default='')


class EditingDescriptor(EditingFields, MakoModuleDescriptor):
    """
    Module that provides a raw editing view of its data and children.  It does not
    perform any validation on its definition---just passes it along to the browser.

    This class is intended to be used as a mixin.
    """
    mako_template = "widgets/raw-edit.html"

    # cdodge: a little refactoring here, since we're basically doing the same thing
    # here as with our parent class, let's call into it to get the basic fields
    # set and then add our additional fields. Trying to keep it DRY.
    def get_context(self):
        _context = MakoModuleDescriptor.get_context(self)
        # Add our specific template information (the raw data body)
        _context.update({'data': self.data})
        return _context


class TabsEditingDescriptor(EditingFields, MakoModuleDescriptor):
    """
    Module that provides a raw editing view of its data and children.  It does not
    perform any validation on its definition---just passes it along to the browser.

    This class is intended to be used as a mixin.

    Only one inner editor in tabs is supported in front-end. It means that
    you should have only one CodeMirror among tabs, one Tiny MCE, etc.
    """
    mako_template = "widgets/tabs-aggregator.html"
    css = {'scss': [resource_string(__name__, 'css/tabs/tabs.scss')]}
    js = {'coffee': [resource_string(__name__, 'js/src/tabs/tabs-aggregator.coffee')]}
    js_module_name = "TabsEditorDescriptor"
    tabs = []

    # Include settings to tabs and hide setting main bar
    hide_settings = False

    def get_context(self):
        _context = super(TabsEditingDescriptor, self).get_context()
        _context.update({
            'tabs': self.tabs,
            'html_id': self.location.html_id(),  # element_id
            'data': self.data,
            'hide_settings': self.hide_settings
        })
        return _context

    @classmethod
    def get_css(cls):
        for tab in cls.tabs:
            tab_styles = tab.get('css', {})
            for css_type, css_content in tab_styles.items():
                if css_type in cls.css:
                    cls.css[css_type].extend(css_content)
                else:
                    cls.css[css_type] = css_content
        return cls.css


class XMLEditingDescriptor(EditingDescriptor):
    """
    Module that provides a raw editing view of its data as XML. It does not perform
    any validation of its definition
    """

    css = {'scss': [resource_string(__name__, 'css/codemirror/codemirror.scss')]}

    js = {'coffee': [resource_string(__name__, 'js/src/raw/edit/xml.coffee')]}
    js_module_name = "XMLEditingDescriptor"


class MetadataOnlyEditingDescriptor(EditingDescriptor):
    """
    Module which only provides an editing interface for the metadata, it does
    not expose a UI for editing the module data
    """

    js = {'coffee': [resource_string(__name__, 'js/src/raw/edit/metadata-only.coffee')]}
    js_module_name = "MetadataOnlyEditingDescriptor"

    mako_template = "widgets/metadata-only-edit.html"


class JSONEditingDescriptor(EditingDescriptor):
    """
    Module that provides a raw editing view of its data as XML. It does not perform
    any validation of its definition
    """

    css = {'scss': [resource_string(__name__, 'css/codemirror/codemirror.scss')]}

    js = {'coffee': [resource_string(__name__, 'js/src/raw/edit/json.coffee')]}
    js_module_name = "JSONEditingDescriptor"
