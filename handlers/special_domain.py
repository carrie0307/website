# coding=utf-8
import tornado.web
from methods.db_operation import special_domain

class Specialdomain_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('special_domain.html')

    def post(self):
        special_domain_data = special_domain()
        self.write(special_domain_data)
        pass
