# coding=utf-8
import tornado.web
from methods.db_operation import ip_num_percent

class ipPercent_OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_percent_data = ip_num_percent()
        self.write(ip_percent_data)

    def post(self):
        pass
