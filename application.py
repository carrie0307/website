# coding=utf-8
'''
完成对网站系统的基本配置，建立网站的请求处理集合
'''

from url import url # 将 url.py 中设定的目录引用过来。

import tornado.web
import os

'''
setting 引用了一个字典对象，里面约定了模板和静态文件的路径，即声明已经建立的文件夹"templates"和"statics"分别为模板目录和静态文件目录。

settings 的设置，不仅仅是文件中的两个，还有其它，比如，如果填上 debug = True 就表示出于调试模式; cookie_secret = "×××"设置cokkie加密的密钥.
'''
settings = dict(
    template_path = os.path.join(os.path.dirname(__file__), "templates"),
    static_path = os.path.join(os.path.dirname(__file__), "statics"),
    debug = True
    )

# application 是一个请求处理集合对象
application = tornado.web.Application(
    handlers = url,
    **settings
    )
