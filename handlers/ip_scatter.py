# coding=utf-8
import tornado.web
from methods.db_operation import ip_change

class ipScatterHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('ip_scatter.html')

    def post(self):
        pass
