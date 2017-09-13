# coding=utf-8
import tornado.web
from methods.db_operation import ip_change_situation

class ipSituation_OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_situation = ip_change_situation('www.www-4s.cc')
        self.write(ip_situation)

    def post(self):
        print '---'
        domain = self.get_argument('domain')
        print domain
        ip_situation = ip_change_situation(domain)
        self.write(ip_situation)
