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
collection = db.domain_ip_cname


# 计算所有domain的ip更换频率--index的柱状图
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
        change_times = len(item['dm_ip'])
        if 'visit_times' in item.keys():
            if item['visit_times'] < change_times:
                visit_times = len(item['dm_ip'])
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
    for each_visit_res in item['dm_ip']:
        return_data['rows'][each_visit_res['insert_time']] = each_visit_res['ips']
    return_data['total'] = len(item['dm_ip'])
    return return_data


# ip变动具体统计--ip_situation
def ip_change_situation(domain):
    global collection
    return_data = {}
    return_data['data'] = []
    item = collection.find_one({'domain':domain})
    return_data['frequency'] = {}
    return_data['frequency']['change_times'] = len(item['dm_ip'])
    return_data['frequency']['visit_times'] = item['visit_times'] + 1
    last_time = item['record_time']
    last_ip = []
    i = 0
    for each_visit_res in item['dm_ip']:
        i += 1
        insert_time = each_visit_res['insert_time']
        time_gap = ((datetime.datetime.strptime(insert_time, "%Y-%m-%d %H:%M:%S") - datetime.datetime.strptime(last_time, "%Y-%m-%d %H:%M:%S")).seconds) / 3600 # 以小时为单位
        time_gap = round(time_gap, 2) #距离上次更新时间间隔
        last_time = insert_time # 将当次时间置为上次时间，以便下次处理
        ip_geos = each_visit_res['geos'] # ip_geo是当前这次访问所有ip的地理位置列表
        this_geo_list = [] # 地理位置城市列表
        # 获取当前访问所有ip的地理位置分布
        geo_detail = {} #地理位置信息，包括地理位置以及每个位置对应的数量
        for geo in ip_geos:
            this_geo = '' # 一条ip的地理位置
            for key in ['country', 'region', 'city']:
                if geo[key] != '0':
                    this_geo = this_geo + geo[key] + '-'
            this_geo_list.append(this_geo[0:-1])
            if this_geo[0:-1] in geo_detail.keys():
                geo_detail[this_geo[0:-1]] += 1
            else:
                geo_detail[this_geo[0:-1]] = 1
        this_geo_list = list(set(this_geo_list)) # 去重
        this_geo_list = '</br>'.join(this_geo_list) # 转化为字符串
        geo_info = {'geo':this_geo_list, 'geo_detail':geo_detail}
        ip_info = {}
        ip_info['num'] = len(each_visit_res['ips']) #ip数量
        ip_info['ips'] = '\n'.join(each_visit_res['ips']) # 具体ip
        ips = each_visit_res['ips']
        update_ip = {}
        update_ip['num'] = len(list(set(ips).difference(set(last_ip))))
        update_ip['ips'] = '\n'.join(list(set(ips).difference(set(last_ip))))
        last_ip = ips
        return_data['data'].append({'time':insert_time,'time_gap':time_gap,'ip':ip_info,'ip_geo':geo_info,'update_ip':update_ip})
        # return_data['data'].append([insert_time,time_gap,ip_num,this_geo_list,update_ip,delete_ip])
    # print return_data
    return return_data

# ip_period
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
    for index, each_visit_res in enumerate(item['dm_ip']): # 遍历每一次访问
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
    # print ip_change('www-4s.cc')
    # www-4s.cc
    # 7777744444.com
    # return_data = live_period('www-4s.cc')
    print ip_change_situation('www-4s.cc')
    # print ip_change_situation('511789.com')
