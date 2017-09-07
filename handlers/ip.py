# coding=utf-8
import tornado.web
from methods.db_operation import live_period

class IP_PeriodHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('IP_period.html')
        # self.write(data)

    def post(self):
        pass
