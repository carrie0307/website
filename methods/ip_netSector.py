# coding=utf-8
'''
    这里只讨论A、B和C类的网络段

    A类地址：1.0.0.1～126.255.255.254    子网掩码：255.0.0.0
        特殊ip：
            0.0.0.0 保留ip
            10.X.X.X 私有地址
            127.X.X.X 保留地址

    B类地址：128.0.0.1～191.255.255.254  子网掩码：255.255.0.0
        特殊ip：172.16.0.0---172.31.255.255是私有地址
               169.254.X.X是保留地址
               191.255.255.255是广播地址

    C类地址：192.0.0.0---223.255.255.0    子网掩码：255.255.255.0
        特殊ip：192.168.X.X是私有地址  192.168.0.0---192.168.255.255

    D类地址：224.0.0.0～239.255.255.255
    E类地址：240.0.0.0---255.255.255.254
'''


masks = {
        'A':'11111111000000000000000000000000',
        'B': '11111111111111110000000000000000',
        'C': '11111111111111111111111100000000'
        }


class ip_category():

    def special_ip_category(self,ip):
        '''
        包含特殊类型判别的ip判断
        '''
        ip_flag = map(eval, ip.split('.'))
        if 224 <= ip_flag[0] <= 239:
            return 'D'
        elif 240 <= ip_flag[0] <= 255:
            return 'E'
        elif ip_flag[0] == 127 or ip_flag[0] == 0:
            return 'A类保留'
        elif ip_flag[0] == 10:
            return 'A类私有'
        elif ip_flag[0] == 172 and ip_flag[1] >= 16 and ip_flag[1] <= 31:
            return 'B类私有'
        elif ip_flag[0] == 169 and ip_flag[2] == 154:
            return 'B类保留'
        elif ip == '191.255.255.255':
            return 'B类广播'
        elif ip_flag[0] == 192 and ip_flag[1] == 168:
            return 'C类私有'
        elif 1 <= ip_flag[0] <= 126:
            return 'A'
        elif 128 <= ip_flag[0] <= 191:
            return 'B'
        elif 192 <= ip_flag[0] <= 223:
            return 'C'
        else:
            return 'other'


    def judge_category(self, ip):
        '''
        ip地址类型判断（为了方便后续处理，这里不对私有和保留ip进行处理）
        '''
        ip_flag = int(ip.split('.')[0])
        if 1 <= ip_flag <= 126:
            return 'A'
        elif 128 <= ip_flag <= 191:
            return 'B'
        elif 192 <= ip_flag <= 223:
            return 'C'
        elif 224 <= ip_flag <= 239:
            return 'D'
        elif 240 <= ip_flag <= 255:
            return 'E'
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
            if category != 'D' and category != 'E' and category != 'other': # 只对A，B，C三类进行子网判断
                for ip in ip_category[category]:
                    ip_num = self.ipToBinary(ip)
                    ip_num = int(ip_num, 2)
                    mask_num = int(masks[category], 2)
                    res = ip_num & mask_num
                    if res in sector_dict[category].keys():
                        sector_dict[category][res].append(ip)
                    else:
                        sector_dict[category][res] = [ip]
        for key in sector_dict:
            for res in sector_dict[key]:
                return_data.append({'category': key, 'ips': sector_dict[key][res]})
        return return_data


if __name__ == '__main__':
    ip = ip_category()
    ips = ['140.205.94.189', '43.230.115.59', '23.252.162.230']
    ip.judge_Sector(ips)
