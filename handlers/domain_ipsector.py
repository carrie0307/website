# coding=utf-8
import tornado.web
from methods.db_operation import domain_ip_sector_num

class domainIPsector_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('domain_ip_sector.html')

    def post(self):
        # domain_type = self.get_argument('domain_type')
        domain_ip_sector_data = domain_ip_sector_num()
        self.write(domain_ip_sector_data)
