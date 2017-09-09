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

from handlers.iplive import IPlive_PeriodHandler # 生命周期统计
from handlers.iplive_off import iplive_OffHandler

from handlers.ip_scatter import ipScatterHandler # 具体变动的散点图
from handlers.ip_scatter_off import ipScatter_OffHandler # 具体每个域名的ip变化情况

from handlers.ip_situation import ipSituationHandler
from handlers.ip_situation_off import ipSituation_OffHandler


url = [
    (r'/', IndexHandler),
    (r'/off', OffHandler),
    (r'/IPlive_period', IPlive_PeriodHandler),
    (r'/iplive_off', iplive_OffHandler),
    ('/ip_scatter', ipScatterHandler), # 展示每个域名ip具体变化散点图的页面
    (r'/ip_scatter_off',ipScatter_OffHandler),
    (r'/ip_change_situation',ipSituationHandler), # ip变化具体情况，包括ip增减等
    (r'/ip_change_situation_off',ipSituation_OffHandler)
]
