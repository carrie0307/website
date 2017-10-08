# coding=utf-8
import tornado.web
from methods.db_operation import province_count
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

class Provincespread_Handler(tornado.web.RequestHandler):
    def get(self):
        self.render('province_spread.html')

    def post(self):
        province_data = province_count()
        self.write(province_data)
