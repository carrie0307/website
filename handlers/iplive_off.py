# coding=utf-8
import tornado.web
from methods.db_operation import live_period

class iplive_OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_period = live_period('www.www-4s.cc')
        self.write(ip_period)

    def post(self):
        pass
