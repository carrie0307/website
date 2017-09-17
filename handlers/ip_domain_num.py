# coding=utf-8
import tornado.web
from methods.db_operation import general_ip_domain

class ipDomain_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('ip_domain_num.html')

    def post(self):
        pass
