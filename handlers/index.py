# coding=utf-8
import tornado.web
'''
当访问根目录的时候（不论输入 localhost:8000，还是 http://127.0.0.1:8000，或者网站域名），
就将相应的请求交给了 handlers 目录中的 index.py 文件中的 IndexHandler 类的 get() 方法来处理，
它的处理结果是呈现 index.html 模板内容
'''
from methods.db_operation import change_frequency

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        name = 'Lucy'
        # self.render("index.html")
        self.render("index.html", user = name)
        # self.render("index.html") # 向请求者反馈网页模板，并且可以向模板中传递数值

    def post(self):
        name = self.get_argument("name")
        job = self.get_argument("job")
        print 'job is ' + str(job)
        self.write("welcome you: " + name) # 不做处理的话，会直接通过js弹窗弹出显示
        # self.write(name) # 后端向前端返回数据。这里返回的实际上是一个字符串，也可返回 json 字符串
