# coding=utf-8
import tornado.web
from methods.db_operation import special_ip_count
from methods.db_operation import special_geo

class SepcialIP_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('special_ip.html')

    def post(self):
        domain_type = self.get_argument('domain_type')
        if domain_type != 'geo':
            special_ip_data = special_ip_count(domain_type)
            self.write(special_ip_data)
        else:
            print '======'
            special_geo_data = special_geo()
            self.write(special_geo_data)
