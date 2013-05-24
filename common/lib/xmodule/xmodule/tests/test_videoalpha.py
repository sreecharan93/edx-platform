# -*- coding: utf-8 -*-
"""Test for Video Alpha Xmodule functional logic."""

from xmodule.videoalpha_module import VideoAlphaDescriptor
from . import PostData, LogicTest, etree


class VideoAlphaModuleTest(LogicTest):
    descriptor_class = VideoAlphaDescriptor

    raw_model_data = {
        'data': '<videoalpha />'
    }

    def test_get_timeframe_no_parameters(self):
        "Make sure that timeframe() works correctly w/o parameters"
        xmltree = etree.fromstring('<videoalpha>test</videoalpha>')
        output = self.xmodule._get_timeframe(xmltree)
        self.assertEqual(output, ('', ''))

    def test_get_timeframe_with_one_parameter(self):
        "Make sure that timeframe() works correctly with one parameter"
        xmltree = etree.fromstring(
            '<videoalpha start_time="00:04:07">test</videoalpha>'
        )
        output = self.xmodule._get_timeframe(xmltree)
        self.assertEqual(output, (247, ''))

    def test_get_timeframe_with_two_parameters(self):
        "Make sure that timeframe() works correctly with two parameters"
        xmltree = etree.fromstring(
            '''<videoalpha
                    start_time="00:04:07"
                    end_time="13:04:39"
                >test</videoalpha>'''
        )
        output = self.xmodule._get_timeframe(xmltree)
        self.assertEqual(output, (247, 47079))
