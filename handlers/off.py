# coding=utf-8
import tornado.web
from methods.db_operation import change_frequency

class OffHandler(tornado.web.RequestHandler):
    def get(self):
        ip_frequency = change_frequency()
        print ip_frequency
        self.write(ip_frequency)
        # self.write(data)

    def post(self):
        pass
