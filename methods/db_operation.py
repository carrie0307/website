# coding=utf-8
from __future__ import division
from pymongo import *
import operator
import datetime
import time

'''建立连接'''
client = MongoClient()
client = MongoClient('172.29.152.152', 27017)
db = client.eds_last
collection = db.domain_ip_geo_copy


# 计算所有domain的ip更换频率
def change_frequency():
    global collection
    datalist = []
    return_data = {}
    res = collection.find()
    return_data = {}
    # return_data['total'] = res.count()
    return_data['total'] = 10
    return_data['rows'] = []
    i = 0
    for item in res:
        print item['visit_times']
        if i > 9:
            break
        i += 1
        temp = {}
        change_times = len(item['ip_geo'])
        if 'visit_times' in item.keys():
            if item['visit_times'] < change_times:
                visit_times = len(item['ip_geo'])
            else:
                visit_times = item['visit_times'] + 1
        else:
            visit_times = 1
        frequency = change_times / visit_times
        frequency = round(frequency,2)
        return_data['rows'].append({'domain':str(item['domain']), 'change_times' : str(change_times),  'visit_times': str(visit_times), 'frequency': str(frequency)})
    # return_data['rows'] = sorted(return_data['rows'], key=operator.itemgetter('change_times'), reverse = True)
    return return_data


#  ip连续性统计，ip散点图
def ip_change(domain):
    global collection
    return_data = {}
    return_data['rows'] = {}
    item = collection.find_one({'domain':domain})
    for each_visit_res in item['ip_geo']:
        return_data['rows'][each_visit_res['insert_time']] = each_visit_res['ips']
    return_data['total'] = len(item['ip_geo'])
    return return_data


# ip变动具体统计
def ip_change_situation(domain):
    global collection
    



def live_period(domain):
    '''
    这里有些问题，需要改
    '''
    global collection
    return_data = {}
    return_data['rows'] = []
    ip_period = {}
    ip_list = []
    item = collection.find_one({'domain':domain})
    last_ip = []
    for index, each_visit_res in enumerate(item['ip_geo']): # 遍历每一次访问
        ip_list.extend(each_visit_res['ips'])
        if index == 0:
            for ip in each_visit_res['ips']:
                ip_period[ip] = {'ip': ip,'begin': item['record_time'], 'end': each_visit_res['insert_time']}
                last_ip.append(ip)
        else:
            temp = [] #  临时记录这一次访问所的ip的容器，之后将转移到last_ip列表中
            for ip in each_visit_res['ips']:
                if ip in last_ip: # 上一次出现过，即连续出现的ip，更新最后插入时间作为计时结尾
                    ip_period[ip]['end'] = each_visit_res['insert_time']
                else: # 第一次出现的ip，将插入时间作为计时起点，计时结尾记为当前统计时间
                    ip_period[ip] = {'ip': ip, 'begin': each_visit_res['insert_time'], 'end':''}
                temp.append(ip)
            for ip in last_ip:
                if ip not in each_visit_res['ips']: #上次记录有，但这次不存在的ip
                    ip_period[ip]['end'] = each_visit_res['insert_time'] #结束时间记为第一次探测到它不存在的情况
            last_ip = temp # 将这一次访问所得ip置于last_ip列表
            temp = []
    return_data['total'] = len(ip_period.keys())
    for ip in ip_period.keys(): # 计算每个ip的生命时长
        if ip_period[ip]['end'] =='': # 说明该ip刚出现过一次
            ip_period[ip]['end'] = str(time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())))
            # ip_period[ip]['period'] = 1.99 # 则置为访问间隔1.99, 表示不满2小时
            # return_data['rows'].append(ip_period[ip])
            continue
        period = ((datetime.datetime.strptime(ip_period[ip]['end'], "%Y-%m-%d %H:%M:%S") - datetime.datetime.strptime(ip_period[ip]['begin'], "%Y-%m-%d %H:%M:%S")).seconds) / 3600 # 以小时为单位
        ip_period[ip]['period'] = round(period, 2) # 保留两位小数
        return_data['rows'].append(ip_period[ip])
    return_data['rows'] = sorted(return_data['rows'], key=operator.itemgetter('period'), reverse = True)
    return return_data



if __name__ == '__main__':
    # print change_frequency()
    print ip_change('www-4s.cc')
    # www-4s.cc
    # 7777744444.com
    # return_data = live_period('www-4s.cc')
