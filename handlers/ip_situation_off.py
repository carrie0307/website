# coding=utf-8
import tornado.web
from methods.db_operation import ip_change

class ipSituation_OffHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('---')

    def post(self):
        pass
