# coding=utf-8
import tornado.web
from methods.db_operation import ip_net_sector
from methods.db_operation import general_ip_sector

class ipNetSector_OffHandler(tornado.web.RequestHandler):
    def get(self):
        # ip_net_sector_data = ip_net_sector('www.www-4s.cc')
        # self.write(ip_net_sector_data)
        type_ip_sector = general_ip_sector('Gamble')
        print type_ip_sector
        self.write(type_ip_sector)

    def post(self):
        pass
