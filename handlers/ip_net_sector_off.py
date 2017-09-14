# coding=utf-8
import tornado.web
from methods.db_operation import ip_net_sector

class ipNetSector_OffHandler(tornado.web.RequestHandler):
    def get(self):
        print '---'
        ip_net_sector_data = ip_net_sector('www.www-4s.cc')
        print ip_net_sector_data
        self.write(ip_net_sector_data)

    def post(self):
        pass
