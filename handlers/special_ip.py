# coding=utf-8
import tornado.web
from methods.db_operation import special_ip_count

class SepcialIP_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('special_ip.html')

    def post(self):
        domain_type = self.get_argument('domain_type')
        special_ip_data = special_ip_count(domain_type)
        self.write(special_ip_data)
