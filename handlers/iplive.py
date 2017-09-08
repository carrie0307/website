# coding=utf-8
import tornado.web
from methods.db_operation import live_period

class IPlive_PeriodHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('IPlive_period.html')
        # self.write(data)

    def post(self):
        pass
