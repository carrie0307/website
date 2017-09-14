# coding=utf-8
'''
    这里只讨论A、B和C类的网络段

    A类地址：1.0.0.1～126.255.255.254    子网掩码：255.0.0.0
    B类地址：128.0.0.1～191.255.255.254  子网掩码：255.255.0.0
    C类地址：192.168.0.0～192.168.255.255    子网掩码：255.255.255.0
'''


masks = {
        'A':'11111111000000000000000000000000',
        'B': '11111111111111110000000000000000',
        'C': '11111111111111111111111100000000'
        }


class ip_category():
    def judge_category(self, ip):
        ip_flag = int(ip.split('.')[0])
        if 1 <= ip_flag <= 126:
            return 'A'
        elif 128 <= ip_flag <= 191:
            return 'B'
        elif ip_flag == 192:
            return 'C'
        else:
            return 'other'


    def ipToBinary(self,ip):
        '''ip address transformat into binary
        Argv:
            ip: ip address
        Return:
            binary
        '''
        ip_num = ip.split('.')
        x = 0

        ##IP地址是点分十进制，例如：192.168.1.33，共32bit
        ##第1节（192）向前移24位，第2节（168）向前移16位
        ##第3节（1）向迁移8位，第4节（33）不动
        ##然后进行或运算，得出数据
        for i in range(len(ip_num)):
            num = int(ip_num[i]) << (24 - i*8)
            x = x | num # QUESTION:why?
        brnary = str(bin(x).replace('0b',''))
        return brnary


    def judge_Sector(self,ips):
        '''
        ips: 输入的ip列表
        return_data = [{网段序号，ip类型， 该网段的ip列表}]
        '''
        return_data = []
        ip_category = {}
        for ip in ips:
            category = self.judge_category(ip)
            if category in ip_category.keys():
                ip_category[category].append(ip)
            else:
                ip_category[category] = [ip]
        sector_dict = {'A':{}, 'B':{}, 'C':{}}
        for category in ip_category.keys():
            if category != 'other': # 只对A，B，C三类进行子网判断
                for ip in ip_category[category]:
                    ip_num = self.ipToBinary(ip)
                    ip_num = int(ip_num, 2)
                    mask_num = int(masks[category], 2)
                    res = ip_num & mask_num
                    if res in sector_dict[category].keys():
                        sector_dict[category][res].append(ip)
                    else:
                        sector_dict[category][res] = [ip]
        i = 1
        for key in sector_dict:
            for res in sector_dict[key]:
                return_data.append({'sector': '网段' + str(i), 'category': key, 'ips': sector_dict[key][res]})
                i = i + 1
        return return_data






if __name__ == '__main__':
    ip = ip_category()
    ips = ['140.205.94.189', '43.230.115.59', '23.252.162.230']
    ip.judge_Sector(ips)
