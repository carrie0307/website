# coding=utf-8
import tornado.web
from methods.db_operation import ip_net_sector

class ipNetSector_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('ip_net_sector.html')

    def post(self):
        pass
