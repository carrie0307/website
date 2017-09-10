# coding=utf-8
import tornado.web
from methods.db_operation import ip_change_situation

class ipSituation_OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_situation = ip_change_situation('www-4s.cc')
        # ip_situation = ip_change_situation('hk308.com')
        # print ip_situation
        self.write(ip_situation)

    def post(self):
        pass