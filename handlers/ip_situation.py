# coding=utf-8
import tornado.web


class ipSituationHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('ip_change_situation.html')

    def post(self):
        pass
