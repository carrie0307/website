# coding=utf-8
from __future__ import division
from pymongo import *
import operator
import datetime
import time
from ip_netSector import ip_category

'''建立连接'''
client = MongoClient()
client = MongoClient('172.29.152.152', 27017)
db = client.eds_last
collection = db.domain_ip_cname1

ip_dealer = ip_category()


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


# ip_period IP服务时长
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


# 每一类域名拥有ip数量比例统计 ip_percent.html
def ip_num_percent():
    '''
    {
    'Gamble':[[ip_num, percint], [ip_num, percint], ...]}，
    'Porno':{[ip_num, percint], [ip_num, percint], ...]}，
    'ip_num': 平均ip数量列表， 'percent': 该数量ip占该类型ip数量百分比
    }
    '''

    def domain_deal(domains):
        '''
            domains = collection.find({'type':'***'})
            对某类型域名进行具体统计的函数
        '''
        data = []
        domain_num = domains.count() # 该类型域名总量
        # num_dict = {'0':0,'1':0,'2':0,'3~10':0,'11~15':0,'>15':0}  #{ip平均数量: 该数量域名占域名总量的比例}
        num_info = [0,0,0,0,0,0]
        for item in domains:
            change_times = len(item['dm_ip']) # 该域名ip变动次数
            ip_total = 0 # 该域名ip总量
            for each_visit in item['dm_ip']:
                ip_total += len(each_visit['ips'])
            ip_aveg_num = int(ip_total / change_times) # 该域名平均ip数量
            if ip_aveg_num <= 2:
                num_info[ip_aveg_num] += 1
            elif 3 <= ip_aveg_num <= 10:
                num_info[3] += 1
            elif 11 <= ip_aveg_num <= 15:
                num_info[4] += 1
            elif ip_aveg_num >= 15:
                num_info[5] += 1
        for i in range(len(num_info)):
            num_info[i] = round((num_info[i] / domain_num) * 100, 2)
        return num_info

    global collection
    return_data = {}
    return_data['Gamble'] = {}
    return_data['Porno'] = {}
    Gamble_domains = collection.find({'dm_type':'Gamble'})
    Porno_domains = collection.find({'dm_type':'Porno'})
    gamble_data = domain_deal(Gamble_domains)
    porno_data = domain_deal(Porno_domains)
    return_data['Gamble'] = gamble_data
    return_data['Porno'] = porno_data
    return return_data


# 单一域名的ip网段统计
def ip_net_sector(domain):
    return_data = {}
    global collection
    global ip_dealer
    item = collection.find_one({'domain':domain})
    ips = []
    geo_dict = {}
    for each_visit in item['dm_ip']:
        ips.extend(each_visit['ips'])
        for index,ip in enumerate(each_visit['ips']):
            this_geo = ''
            geo = each_visit['geos'][index] # 当前ip的地理位置字典
            for key in ['country', 'region', 'city']:
                if geo[key] != '0':
                    this_geo = this_geo + geo[key] + '-'
            this_geo = this_geo[:-1]
            if this_geo in geo_dict.keys(): # 若该地理位置在geo_dict中
                if ip not in geo_dict[this_geo]:
                    geo_dict[this_geo].append(ip) # 如果改ip未在该地理位置集合中，则加入
            else:
                geo_dict[this_geo] = [ip]
    ips = list(set(ips)) # 获取到所有的ip
    general_ipsector = ip_dealer.judge_Sector(ips)
    # return_data['domain_general'] = general_ipsector
    for record in general_ipsector:
        record['geo'] = []
        for ip in record['ips']: # 判断每个ip的地理位置
            for geo in geo_dict.keys():
                if ip in geo_dict[geo] and geo not in record['geo']: # 如果属于某个地理位置
                    print geo
                    record['geo'].append(geo)
                    break # 说明找到了当前ip对应的地理位置
    return_data['domain_general'] = general_ipsector
    return return_data


def general_ip_sector(dm_type):
    '''
    整体的ip网段分布统计
    '''
    global collection
    global ip_dealer
    res = collection.find({'dm_type':dm_type})
    ips = []
    ip_dict = {} # 以ip为key，关于地理位置和域名的字典
    geo_dict = {} # 以地理位置为key，关于ip的字典
    for item in res:
        for each_visit in item['dm_ip']:
            ips.extend(each_visit['ips'])
            for index,ip in enumerate(each_visit['ips']): # 建立每个ip的地理位置与域名的对应关系
                temp = {}
                if ip not in ip_dict.keys(): # 初次遇到的ip，建立域名的列表,并提取地理位置信息
                    temp['domain'] = [item['domain']]# 建立域名的列表
                    this_geo = ''
                    geo = each_visit['geos'][index]
                    for key in ['country', 'region', 'city']:
                        if geo[key] != '0':
                            this_geo = this_geo + geo[key] + '-'
                    temp['geo'] = this_geo[:-1] # 获取到地理位位置信息
                    ip_dict[ip] = temp
                else: # 已处理u过的ip，将新的域名加入列表
                    ip_dict[ip]['domain'].append(item['domain'])
                # 建立地理位置字典
    ips = list(set(ips))
    ip_sector_info = ip_dealer.judge_Sector(ips) # 所有ip的网段信息
    for record in ip_sector_info:
        record['geo'] = []
        record['domain'] = []
        for ip in record['ips']:
            if ip_dict[ip]['geo'] not in record['geo']: # 避免同一网段的重复地址
                record['geo'].append(ip_dict[ip]['geo'])
            record['domain'].extend(ip_dict[ip]['domain'])
    return_data = {}
    return_data['domain_general'] = ip_sector_info
    # print ip_sector_info
    return return_data


def general_ip_domain(dm_type):
    '''
    ip提供服务域名数量统计
    '''
    global collection
    global ip_dealer
    res = collection.find({'dm_type':dm_type})
    ips = []
    ip_dict= {} # 以ip为key，内容为域名的列表
    for item in res:
        for each_visit in item['dm_ip']:
            # ips.extend(each_visit['ips'])
            for index, ip in enumerate(each_visit['ips']):
                # 获取地理位置
                geo = each_visit['geos'][index] #当前ip地理位置
                this_geo = ''
                for key in ['country', 'region', 'city']:
                    if geo[key] != '0':
                        this_geo = this_geo + geo[key] + '-'
                if ip not in ip_dict.keys():
                    ip_dict[ip] = {'ip': ip, 'geo': this_geo[:-1], 'domains': [item['domain']], 'category': ip_dealer.judge_category(ip)}
                else:
                    ip_dict[ip]['domains'].append(item['domain'])
    print ip_dict


if __name__ == '__main__':
    # print change_frequency()
    # print ip_change('www.www-4s.cc')
    # www-4s.cc
    # 7777744444.com
    # live_period('www.www-4s.cc')
    # print ip_change_situation('www.www-4s.cc')
    # print ip_change_situation('www.511789.com')
    # print ip_num_percent()
    # print ip_net_sector('www.www-4s.cc')
    # general_ip_sector('Gamble')
    general_ip_domain('Gamble')
