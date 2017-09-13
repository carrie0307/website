# coding=utf-8
import tornado.web
from methods.db_operation import ip_num_percent

class ipPercent_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('ip_percent.html')

    def post(self):
        pass
