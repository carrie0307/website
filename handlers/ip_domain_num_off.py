# coding=utf-8
import tornado.web
from methods.db_operation import general_ip_domain

class ipDomain_OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_domain_data = general_ip_domain('Gamble')
        self.write('ip_domain_data')

    def post(self):
        pass
