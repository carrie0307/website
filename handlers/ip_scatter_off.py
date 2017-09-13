# coding=utf-8
import tornado.web
from methods.db_operation import ip_change

class ipScatter_OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_change_res = ip_change('www.www-4s.cc')
        # print ip_change_res
        self.write(ip_change_res)

    def post(self):
        domain = self.get_argument('domain')
        print domain
        ip_change_res = ip_change(domain)
        # print ip_change_res
        self.write(ip_change_res)
