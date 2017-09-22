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

from handlers.ip_situation import ipSituationHandler # 域名ip具体变化情况统计
from handlers.ip_situation_off import ipSituation_OffHandler

from handlers.ip_percent import ipPercent_Handler # 域名拥有ip数量的统计
from handlers.ip_percent_off import ipPercent_OffHandler

from handlers.ip_net_sector import ipNetSector_Handler # ip整体的网段划分统计
from handlers.ip_net_sector_off import ipNetSector_OffHandler

from handlers.ip_domain_num import ipDomain_Handler # 每个ip提供服务域名数量统计
from handlers.ip_domain_num_off import ipDomain_OffHandler

from handlers.special_ip import SepcialIP_Handler # 特殊ip统计

from handlers.domain_ipsector import domainIPsector_Handler # 每个域名ip的网段统计

from handlers.domain_oper import domain_Oper_Handler # 运营商数量大于1的域名统计

from handlers.special_domain import Specialdomain_Handler # 网段、地理位置、运营商数量大于1的域名统计

url = [
    (r'/', IndexHandler),
    (r'/off', OffHandler),
    (r'/IPlive_period', IPlive_PeriodHandler),
    (r'/iplive_off', iplive_OffHandler),
    ('/ip_scatter', ipScatterHandler), # 展示每个域名ip具体变化散点图的页面
    (r'/ip_scatter_off',ipScatter_OffHandler),
    (r'/ip_change_situation',ipSituationHandler), # ip变化具体情况，包括ip增减等
    (r'/ip_change_situation_off',ipSituation_OffHandler),
    (r'/ip_percent',ipPercent_Handler),
    (r'/ip_percent_off',ipPercent_OffHandler),
    (r'/ip_net_sector',ipNetSector_Handler),
    (r'/ip_net_sector_off',ipNetSector_OffHandler),
    (r'/ip_domain_num',ipDomain_Handler),
    (r'/ip_domain_num_off',ipDomain_OffHandler),
    (r'/special_ip',SepcialIP_Handler),
    (r'/domain_ip_sector',domainIPsector_Handler),
    (r'/domain_oper',domain_Oper_Handler),
    (r'/special_domain', Specialdomain_Handler)

]
