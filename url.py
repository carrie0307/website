# coding=utf-8
"""
the url structure of website
设置网站的目录结构
"""

import sys     #utf-8，兼容汉字
reload(sys)
sys.setdefaultencoding("utf-8")

from handlers.index import IndexHandler    #假设已经有了
from handlers.off import OffHandler
from handlers.ip import IP_PeriodHandler

url = [
    (r'/', IndexHandler),
    (r'/off', OffHandler),
    r'/IP_period', OffHandler)

]
