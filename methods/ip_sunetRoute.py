# coding=utf-8
class ipSunetRoute(object):

    ##将IP地址转为二进制
    def ipToBinary(self,ip):
        '''ip address transformat into binary
        Argv:
            ip: ip address
        Return:
            binary
        '''
        ip_num = ip.split('.')
        x = 0
        print ip_num

        ##IP地址是点分十进制，例如：192.168.1.33，共32bit
        ##第1节（192）向前移24位，第2节（168）向前移16位
        ##第3节（1）向迁移8位，第4节（33）不动
        ##然后进行或运算，得出数据
        for i in range(len(ip_num)):
            num = int(ip_num[i]) << (24 - i*8)
            x = x | num # QUESTION:why?

        brnary = str(bin(x).replace('0b',''))
        return brnary

    ##将子网掩码转为二进制
    def maskToBinary(self,mask):
        '''netmask change, example: 24 or 255.255.255.0 change binary
        Argv:
            mask: netmask, example:24 or 255.255.255.0
        Return:
            binary
        '''
        mask_list = str(mask).split('.')

        ##子网掩码有两种表现形式，例如：/24或255.255.255.0
        if len(mask_list) == 1:
            ##生成一个32个元素均是0的列表
            binary32 = []
            for i in range(32):
                binary32.append('0')

            ##多少位子网掩码就是连续多少个1
            for i in range(int(mask)):
                binary32[i] = '1'

            binary = ''.join(binary32)

        ##输入的子网掩码是255.255.255.0这种点分十进制格式
        elif len(mask_list) == 4:
            binary = self.ipToBinary(mask)

        return binary

    ##判断IP地址是否属于这个网段
    def ipInSubnet(self,ip,subnet):
        '''
        Argv:
            ip: ip address,example:1.1.1.1
            subnet: subnet,example:1.1.1.0/24,or 1.1.1.0/255.255.255.0
        Return:
            False or True
        '''
        subnet_list = subnet.split('/')
        networt_add = subnet_list[0]
        # network_mask = subnet_list[1]

        ##原来的得出的二进制数据类型是str，转换数据类型
        ip_num = int(self.ipToBinary(ip),2)
        print ip_num
        print '---'
        subnet_num = int(self.ipToBinary(networt_add),2)
        print subnet_num
        print '--'
        # mask_bin = int(self.maskToBinary(network_mask),2)

        ##IP和掩码与运算后比较
        # if (ip_num & mask_bin) == (subnet_num & mask_bin):
            # return True
        # else:
            # return False


if __name__ == '__main__':
    ip = ipSunetRoute()
    # ip.ipToBinary('43.230.115.148')
    # print ip.maskToBinary('255.255.255.0')
    ip.ipInSubnet('43.230.115.148','43.230.115.59')
