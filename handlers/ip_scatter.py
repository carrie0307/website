# coding=utf-8
import tornado.web
from methods.db_operation import ip_change

class ipScatterHandler(tornado.web.RequestHandler):
    def get(self):
        # ip_change_res = ip_change('www.www-4s.cc')
        # self.write(ip_change_res)
        self.render('ip_scatter.html')

    def post(self):
        pass
