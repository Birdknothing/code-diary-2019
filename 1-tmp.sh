Last login: Sun Mar  1 10:43:22 on console
sfbDreamWalker:~ shaofeibo$ ssh tencent
root@111.230.229.143: Permission denied (publickey,gssapi-keyex,gssapi-with-mic).
sfbDreamWalker:~ shaofeibo$ su root
Password:
sh-3.2# ssh tencent
Last login: Sat Feb 29 23:40:52 2020 from 59.57.175.218
[root@DreamWalker ~]# ls
closeSamba.sh        package-lock.json  php-7.2.11.tar.gz  startSamba.sh
ip.sh                pcre-8.42.tar.gz   Shao_Projects      test.sh
nginx-1.14.0.tar.gz  php-7.1.23.tar.gz  sqlite
[root@DreamWalker ~]# sh ip.sh 
{"ip": "117.30.196.102", "country": "福建省厦门市", "city": "电信"}
{"ip": "59.57.175.218", "country": "福建省厦门市", "city": "电信"}
{"ip": "59.57.175.218", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.30.197.3", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.30.197.3", "country": "福建省厦门市", "city": "电信"}
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
{"ip": "116.4.24.154", "country": "广东省东莞市", "city": "电信"}
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
{"ip": "113.77.123.139", "country": "广东省东莞市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 13:11 (182+21:06) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mon
Nov
5
10:12:14
116.4.24.154
Mon
Nov
5
boot
3.10.0-862.14.4.
Wed
Jan
113.77.123.139
Wed
Jan
30
117.25.162.227
Wed
Jan
30
117.25.162.227
Wed
Jan
30
117.25.162.227
Thu
Jan
31
117.25.162.227
Thu
Jan
31
117.25.162.227
Fri
Feb
1
27.154.161.107
Sun
Feb
3
boot
3.10.0-957.1.3.e
Sun
Feb
27.154.161.107
Sun
Feb
3
27.154.218.161
Mon
Feb
4
27.154.218.161
Mon
Feb
4
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
27.154.218.161
Wed
Feb
6
110.87.12.156
Wed
Feb
6
boot
3.10.0-957.1.3.e
Wed
Feb
110.87.12.156
Wed
Feb
6
27.154.218.161
Thu
Feb
7
110.87.12.156
Thu
Feb
7
Thu
Feb
7
19:58
27.154.218.161
Thu
Feb
7
110.87.73.216
Fri
Feb
8
110.87.73.216
Fri
Feb
8
120.79.243.112
Fri
Feb
8
110.87.75.220
Fri
Feb
8
110.87.75.220
Fri
Feb
8
27.154.218.161
Sat
Feb
9
110.87.12.156
Sun
Feb
10
27.154.218.161
Sun
Feb
10
117.25.162.227
Mon
Feb
11
110.87.12.156
Mon
Feb
11
117.25.162.227
Tue
Feb
12
117.25.162.227
Wed
Feb
13
boot
3.10.0-957.1.3.e
Wed
Feb
boot
3.10.0-957.1.3.e
Wed
Feb
117.25.162.227
Wed
Feb
13
117.25.162.227
Wed
Feb
13
117.25.162.227
Thu
Feb
14
27.154.161.209
Fri
Feb
15
117.25.162.227
Sat
Feb
16
boot
3.10.0-957.1.3.e
Sat
Feb
117.25.162.227
Sat
Feb
16
27.154.161.209
Sun
Feb
17
117.25.162.227
Mon
Feb
18
117.25.162.227
Wed
Feb
20
117.30.197.149
Sun
Mar
31
117.30.208.154
Sun
May
5
117.30.208.112
Mon
May
6
106.122.165.95
Wed
May
8
106.122.165.95
Wed
May
8
106.122.174.162
Thu
May
23
117.28.133.164
Mon
Jun
3
117.28.133.164
Mon
Jun
3
117.28.133.230
Tue
Jun
4
117.30.208.79
Thu
Jul
18
110.87.74.167
Sat
Aug
31
110.87.74.167
Sat
Aug
31
110.87.72.93
Sat
Aug
31
boot
3.10.0-957.1.3.e
Sat
Aug
119.123.50.141
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.13.50
Sun
Sep
1
110.87.13.50
Mon
Sep
2
110.87.13.50
Tue
Sep
3
59.57.195.29
Wed
Sep
4
117.30.204.139
Fri
Sep
13
120.41.145.233
Fri
Sep
13
117.30.197.18
Sun
Sep
15
110.87.71.225
Sun
Sep
15
117.30.197.18
Sun
Sep
15
110.87.71.225
Sun
Sep
15
110.87.71.225
Mon
Sep
16
110.87.12.61
Sun
Sep
22
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
121.204.57.163
Sat
Jan
18
117.30.196.157
Mon
Jan
20
117.30.196.157
Mon
Jan
20
110.84.205.33
Fri
Feb
14
121.204.56.187
Thu
Feb
20
117.30.197.3
Sat
Feb
29
117.30.197.3
Sat
Feb
29
59.57.175.218
Sat
Feb
29
59.57.175.218
Sat
Feb
29
117.30.196.102
Sun
Mar
1
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
ip.sh:行10: 未预期的符号 `done' 附近有语法错误
ip.sh:行10: `   done		'
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
ip.sh:行10: 未预期的符号 `fi' 附近有语法错误
ip.sh:行10: `	fi'
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    77    0    77    0     0     16      0 --:--:--  0:00:04 --:--:--    21
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    77    0    77    0     0     86      0 --:--:-- --:--:-- --:--:--    86
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    77    0    77    0     0     40      0 --:--:--  0:00:01 --:--:--    40
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    77    0    77    0     0     87      0 --:--:-- --:--:-- --:--:--    87
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    74    0    74    0     0     29      0 --:--:--  0:00:02 --:--:--    29
{"ip": "116.4.24.154", "country": "广东省东莞市", "city": "电信"}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "116.4.24.154", "country": "广东省东莞市", "city": "电信"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "113.77.123.139", "country": "广东省东莞市", "city": "电信"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

^C
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
ip.sh: 第 4 行:local: 只能在函数中使用
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

ip.sh: 第 4 行:local: 只能在函数中使用
2
Nov
ip.sh: 第 4 行:local: 只能在函数中使用
3

ip.sh: 第 4 行:local: 只能在函数中使用
4

ip.sh: 第 4 行:local: 只能在函数中使用
5

ip.sh: 第 4 行:local: 只能在函数中使用
6

ip.sh: 第 4 行:local: 只能在函数中使用
7

ip.sh: 第 4 行:local: 只能在函数中使用
8

ip.sh: 第 4 行:local: 只能在函数中使用
9

ip.sh: 第 4 行:local: 只能在函数中使用
10

ip.sh: 第 4 行:local: 只能在函数中使用
11

ip.sh: 第 4 行:local: 只能在函数中使用
12

ip.sh: 第 4 行:local: 只能在函数中使用
13

ip.sh: 第 4 行:local: 只能在函数中使用
14

ip.sh: 第 4 行:local: 只能在函数中使用
15

ip.sh: 第 4 行:local: 只能在函数中使用
16

ip.sh: 第 4 行:local: 只能在函数中使用
17

ip.sh: 第 4 行:local: 只能在函数中使用
18

ip.sh: 第 4 行:local: 只能在函数中使用
19

ip.sh: 第 4 行:local: 只能在函数中使用
20

ip.sh: 第 4 行:local: 只能在函数中使用
21

ip.sh: 第 4 行:local: 只能在函数中使用
22

ip.sh: 第 4 行:local: 只能在函数中使用
23

ip.sh: 第 4 行:local: 只能在函数中使用
24

ip.sh: 第 4 行:local: 只能在函数中使用
25

ip.sh: 第 4 行:local: 只能在函数中使用
26

ip.sh: 第 4 行:local: 只能在函数中使用
27

ip.sh: 第 4 行:local: 只能在函数中使用
28

ip.sh: 第 4 行:local: 只能在函数中使用
29

ip.sh: 第 4 行:local: 只能在函数中使用
30

ip.sh: 第 4 行:local: 只能在函数中使用
31

ip.sh: 第 4 行:local: 只能在函数中使用
32

ip.sh: 第 4 行:local: 只能在函数中使用
33

ip.sh: 第 4 行:local: 只能在函数中使用
34

ip.sh: 第 4 行:local: 只能在函数中使用
35

ip.sh: 第 4 行:local: 只能在函数中使用
36

ip.sh: 第 4 行:local: 只能在函数中使用
37

ip.sh: 第 4 行:local: 只能在函数中使用
38

ip.sh: 第 4 行:local: 只能在函数中使用
39

ip.sh: 第 4 行:local: 只能在函数中使用
40

ip.sh: 第 4 行:local: 只能在函数中使用
41

ip.sh: 第 4 行:local: 只能在函数中使用
42

ip.sh: 第 4 行:local: 只能在函数中使用
43

ip.sh: 第 4 行:local: 只能在函数中使用
44

ip.sh: 第 4 行:local: 只能在函数中使用
45

ip.sh: 第 4 行:local: 只能在函数中使用
46

ip.sh: 第 4 行:local: 只能在函数中使用
47

ip.sh: 第 4 行:local: 只能在函数中使用
48

ip.sh: 第 4 行:local: 只能在函数中使用
49

ip.sh: 第 4 行:local: 只能在函数中使用
50

ip.sh: 第 4 行:local: 只能在函数中使用
51

ip.sh: 第 4 行:local: 只能在函数中使用
52

ip.sh: 第 4 行:local: 只能在函数中使用
53

ip.sh: 第 4 行:local: 只能在函数中使用
54

ip.sh: 第 4 行:local: 只能在函数中使用
55

ip.sh: 第 4 行:local: 只能在函数中使用
56

ip.sh: 第 4 行:local: 只能在函数中使用
57

ip.sh: 第 4 行:local: 只能在函数中使用
58

ip.sh: 第 4 行:local: 只能在函数中使用
59

ip.sh: 第 4 行:local: 只能在函数中使用
60

ip.sh: 第 4 行:local: 只能在函数中使用
61

ip.sh: 第 4 行:local: 只能在函数中使用
62

ip.sh: 第 4 行:local: 只能在函数中使用
63

ip.sh: 第 4 行:local: 只能在函数中使用
64

ip.sh: 第 4 行:local: 只能在函数中使用
65

ip.sh: 第 4 行:local: 只能在函数中使用
66

ip.sh: 第 4 行:local: 只能在函数中使用
67

ip.sh: 第 4 行:local: 只能在函数中使用
68

ip.sh: 第 4 行:local: 只能在函数中使用
69

ip.sh: 第 4 行:local: 只能在函数中使用
70

ip.sh: 第 4 行:local: 只能在函数中使用
71

ip.sh: 第 4 行:local: 只能在函数中使用
72

ip.sh: 第 4 行:local: 只能在函数中使用
73

ip.sh: 第 4 行:local: 只能在函数中使用
74

ip.sh: 第 4 行:local: 只能在函数中使用
75

ip.sh: 第 4 行:local: 只能在函数中使用
76

ip.sh: 第 4 行:local: 只能在函数中使用
77

ip.sh: 第 4 行:local: 只能在函数中使用
78

ip.sh: 第 4 行:local: 只能在函数中使用
79

ip.sh: 第 4 行:local: 只能在函数中使用
80

ip.sh: 第 4 行:local: 只能在函数中使用
81

ip.sh: 第 4 行:local: 只能在函数中使用
82

ip.sh: 第 4 行:local: 只能在函数中使用
83

ip.sh: 第 4 行:local: 只能在函数中使用
84

ip.sh: 第 4 行:local: 只能在函数中使用
85

ip.sh: 第 4 行:local: 只能在函数中使用
86

ip.sh: 第 4 行:local: 只能在函数中使用
87

ip.sh: 第 4 行:local: 只能在函数中使用
88

ip.sh: 第 4 行:local: 只能在函数中使用
89

ip.sh: 第 4 行:local: 只能在函数中使用
90

ip.sh: 第 4 行:local: 只能在函数中使用
91

ip.sh: 第 4 行:local: 只能在函数中使用
92

ip.sh: 第 4 行:local: 只能在函数中使用
93

ip.sh: 第 4 行:local: 只能在函数中使用
94

ip.sh: 第 4 行:local: 只能在函数中使用
95

ip.sh: 第 4 行:local: 只能在函数中使用
96

ip.sh: 第 4 行:local: 只能在函数中使用
97

ip.sh: 第 4 行:local: 只能在函数中使用
98

ip.sh: 第 4 行:local: 只能在函数中使用
99

ip.sh: 第 4 行:local: 只能在函数中使用
100

ip.sh: 第 4 行:local: 只能在函数中使用
101

ip.sh: 第 4 行:local: 只能在函数中使用
102

ip.sh: 第 4 行:local: 只能在函数中使用
103

ip.sh: 第 4 行:local: 只能在函数中使用
104

ip.sh: 第 4 行:local: 只能在函数中使用
105

ip.sh: 第 4 行:local: 只能在函数中使用
106

ip.sh: 第 4 行:local: 只能在函数中使用
107

ip.sh: 第 4 行:local: 只能在函数中使用
108

ip.sh: 第 4 行:local: 只能在函数中使用
109

ip.sh: 第 4 行:local: 只能在函数中使用
110

ip.sh: 第 4 行:local: 只能在函数中使用
111

ip.sh: 第 4 行:local: 只能在函数中使用
112

ip.sh: 第 4 行:local: 只能在函数中使用
113

ip.sh: 第 4 行:local: 只能在函数中使用
114

ip.sh: 第 4 行:local: 只能在函数中使用
115

ip.sh: 第 4 行:local: 只能在函数中使用
116

ip.sh: 第 4 行:local: 只能在函数中使用
117

ip.sh: 第 4 行:local: 只能在函数中使用
118

ip.sh: 第 4 行:local: 只能在函数中使用
119

ip.sh: 第 4 行:local: 只能在函数中使用
120

ip.sh: 第 4 行:local: 只能在函数中使用
121

ip.sh: 第 4 行:local: 只能在函数中使用
122

ip.sh: 第 4 行:local: 只能在函数中使用
123

ip.sh: 第 4 行:local: 只能在函数中使用
124

ip.sh: 第 4 行:local: 只能在函数中使用
125

ip.sh: 第 4 行:local: 只能在函数中使用
126

ip.sh: 第 4 行:local: 只能在函数中使用
127

ip.sh: 第 4 行:local: 只能在函数中使用
128

ip.sh: 第 4 行:local: 只能在函数中使用
129

ip.sh: 第 4 行:local: 只能在函数中使用
130

ip.sh: 第 4 行:local: 只能在函数中使用
131

ip.sh: 第 4 行:local: 只能在函数中使用
132

ip.sh: 第 4 行:local: 只能在函数中使用
133

ip.sh: 第 4 行:local: 只能在函数中使用
134

ip.sh: 第 4 行:local: 只能在函数中使用
135

ip.sh: 第 4 行:local: 只能在函数中使用
136

ip.sh: 第 4 行:local: 只能在函数中使用
137

ip.sh: 第 4 行:local: 只能在函数中使用
138

ip.sh: 第 4 行:local: 只能在函数中使用
139

ip.sh: 第 4 行:local: 只能在函数中使用
140

ip.sh: 第 4 行:local: 只能在函数中使用
141

ip.sh: 第 4 行:local: 只能在函数中使用
142

ip.sh: 第 4 行:local: 只能在函数中使用
143

ip.sh: 第 4 行:local: 只能在函数中使用
144

ip.sh: 第 4 行:local: 只能在函数中使用
145

ip.sh: 第 4 行:local: 只能在函数中使用
146

ip.sh: 第 4 行:local: 只能在函数中使用
147

ip.sh: 第 4 行:local: 只能在函数中使用
148

ip.sh: 第 4 行:local: 只能在函数中使用
149

ip.sh: 第 4 行:local: 只能在函数中使用
150

ip.sh: 第 4 行:local: 只能在函数中使用
151

ip.sh: 第 4 行:local: 只能在函数中使用
152

ip.sh: 第 4 行:local: 只能在函数中使用
153

ip.sh: 第 4 行:local: 只能在函数中使用
154

ip.sh: 第 4 行:local: 只能在函数中使用
155

ip.sh: 第 4 行:local: 只能在函数中使用
156

ip.sh: 第 4 行:local: 只能在函数中使用
157

ip.sh: 第 4 行:local: 只能在函数中使用
158

ip.sh: 第 4 行:local: 只能在函数中使用
159

ip.sh: 第 4 行:local: 只能在函数中使用
160

ip.sh: 第 4 行:local: 只能在函数中使用
161

ip.sh: 第 4 行:local: 只能在函数中使用
162

ip.sh: 第 4 行:local: 只能在函数中使用
163

ip.sh: 第 4 行:local: 只能在函数中使用
164

ip.sh: 第 4 行:local: 只能在函数中使用
165

ip.sh: 第 4 行:local: 只能在函数中使用
166

ip.sh: 第 4 行:local: 只能在函数中使用
167

ip.sh: 第 4 行:local: 只能在函数中使用
168

ip.sh: 第 4 行:local: 只能在函数中使用
169

ip.sh: 第 4 行:local: 只能在函数中使用
170

ip.sh: 第 4 行:local: 只能在函数中使用
171

ip.sh: 第 4 行:local: 只能在函数中使用
172

ip.sh: 第 4 行:local: 只能在函数中使用
173

ip.sh: 第 4 行:local: 只能在函数中使用
174

ip.sh: 第 4 行:local: 只能在函数中使用
175

ip.sh: 第 4 行:local: 只能在函数中使用
176

ip.sh: 第 4 行:local: 只能在函数中使用
177

ip.sh: 第 4 行:local: 只能在函数中使用
178

ip.sh: 第 4 行:local: 只能在函数中使用
179

ip.sh: 第 4 行:local: 只能在函数中使用
180

ip.sh: 第 4 行:local: 只能在函数中使用
181

ip.sh: 第 4 行:local: 只能在函数中使用
182

ip.sh: 第 4 行:local: 只能在函数中使用
183

ip.sh: 第 4 行:local: 只能在函数中使用
184

ip.sh: 第 4 行:local: 只能在函数中使用
185

ip.sh: 第 4 行:local: 只能在函数中使用
186

ip.sh: 第 4 行:local: 只能在函数中使用
187

ip.sh: 第 4 行:local: 只能在函数中使用
188

ip.sh: 第 4 行:local: 只能在函数中使用
189

ip.sh: 第 4 行:local: 只能在函数中使用
190

ip.sh: 第 4 行:local: 只能在函数中使用
191

ip.sh: 第 4 行:local: 只能在函数中使用
192

ip.sh: 第 4 行:local: 只能在函数中使用
193

ip.sh: 第 4 行:local: 只能在函数中使用
194

ip.sh: 第 4 行:local: 只能在函数中使用
195

ip.sh: 第 4 行:local: 只能在函数中使用
196

ip.sh: 第 4 行:local: 只能在函数中使用
197

ip.sh: 第 4 行:local: 只能在函数中使用
198

ip.sh: 第 4 行:local: 只能在函数中使用
199

ip.sh: 第 4 行:local: 只能在函数中使用
200

ip.sh: 第 4 行:local: 只能在函数中使用
201

ip.sh: 第 4 行:local: 只能在函数中使用
202

ip.sh: 第 4 行:local: 只能在函数中使用
203

ip.sh: 第 4 行:local: 只能在函数中使用
204

ip.sh: 第 4 行:local: 只能在函数中使用
205

ip.sh: 第 4 行:local: 只能在函数中使用
206

ip.sh: 第 4 行:local: 只能在函数中使用
207

ip.sh: 第 4 行:local: 只能在函数中使用
208

ip.sh: 第 4 行:local: 只能在函数中使用
209

ip.sh: 第 4 行:local: 只能在函数中使用
210

ip.sh: 第 4 行:local: 只能在函数中使用
211

ip.sh: 第 4 行:local: 只能在函数中使用
212

ip.sh: 第 4 行:local: 只能在函数中使用
213

ip.sh: 第 4 行:local: 只能在函数中使用
214

ip.sh: 第 4 行:local: 只能在函数中使用
215

ip.sh: 第 4 行:local: 只能在函数中使用
216

ip.sh: 第 4 行:local: 只能在函数中使用
217

ip.sh: 第 4 行:local: 只能在函数中使用
218

ip.sh: 第 4 行:local: 只能在函数中使用
219

ip.sh: 第 4 行:local: 只能在函数中使用
220

ip.sh: 第 4 行:local: 只能在函数中使用
221

ip.sh: 第 4 行:local: 只能在函数中使用
222

ip.sh: 第 4 行:local: 只能在函数中使用
223

ip.sh: 第 4 行:local: 只能在函数中使用
224

ip.sh: 第 4 行:local: 只能在函数中使用
225

ip.sh: 第 4 行:local: 只能在函数中使用
226

ip.sh: 第 4 行:local: 只能在函数中使用
227

ip.sh: 第 4 行:local: 只能在函数中使用
228

ip.sh: 第 4 行:local: 只能在函数中使用
229

ip.sh: 第 4 行:local: 只能在函数中使用
230

ip.sh: 第 4 行:local: 只能在函数中使用
231

ip.sh: 第 4 行:local: 只能在函数中使用
232

ip.sh: 第 4 行:local: 只能在函数中使用
233

ip.sh: 第 4 行:local: 只能在函数中使用
234

ip.sh: 第 4 行:local: 只能在函数中使用
235

ip.sh: 第 4 行:local: 只能在函数中使用
236

ip.sh: 第 4 行:local: 只能在函数中使用
237

ip.sh: 第 4 行:local: 只能在函数中使用
238

ip.sh: 第 4 行:local: 只能在函数中使用
239

ip.sh: 第 4 行:local: 只能在函数中使用
240

ip.sh: 第 4 行:local: 只能在函数中使用
241

ip.sh: 第 4 行:local: 只能在函数中使用
242

ip.sh: 第 4 行:local: 只能在函数中使用
243

ip.sh: 第 4 行:local: 只能在函数中使用
244

ip.sh: 第 4 行:local: 只能在函数中使用
245

ip.sh: 第 4 行:local: 只能在函数中使用
246

ip.sh: 第 4 行:local: 只能在函数中使用
247

ip.sh: 第 4 行:local: 只能在函数中使用
248

ip.sh: 第 4 行:local: 只能在函数中使用
249

ip.sh: 第 4 行:local: 只能在函数中使用
250

ip.sh: 第 4 行:local: 只能在函数中使用
251

ip.sh: 第 4 行:local: 只能在函数中使用
252

ip.sh: 第 4 行:local: 只能在函数中使用
253

ip.sh: 第 4 行:local: 只能在函数中使用
254

ip.sh: 第 4 行:local: 只能在函数中使用
255

ip.sh: 第 4 行:local: 只能在函数中使用
256

ip.sh: 第 4 行:local: 只能在函数中使用
257

ip.sh: 第 4 行:local: 只能在函数中使用
258

ip.sh: 第 4 行:local: 只能在函数中使用
259

ip.sh: 第 4 行:local: 只能在函数中使用
260

ip.sh: 第 4 行:local: 只能在函数中使用
261

ip.sh: 第 4 行:local: 只能在函数中使用
262

ip.sh: 第 4 行:local: 只能在函数中使用
263

ip.sh: 第 4 行:local: 只能在函数中使用
264

ip.sh: 第 4 行:local: 只能在函数中使用
265

ip.sh: 第 4 行:local: 只能在函数中使用
266

ip.sh: 第 4 行:local: 只能在函数中使用
267

ip.sh: 第 4 行:local: 只能在函数中使用
268

ip.sh: 第 4 行:local: 只能在函数中使用
269

ip.sh: 第 4 行:local: 只能在函数中使用
270

ip.sh: 第 4 行:local: 只能在函数中使用
271

ip.sh: 第 4 行:local: 只能在函数中使用
272

ip.sh: 第 4 行:local: 只能在函数中使用
273

ip.sh: 第 4 行:local: 只能在函数中使用
274

ip.sh: 第 4 行:local: 只能在函数中使用
275

ip.sh: 第 4 行:local: 只能在函数中使用
276

ip.sh: 第 4 行:local: 只能在函数中使用
277

ip.sh: 第 4 行:local: 只能在函数中使用
278

ip.sh: 第 4 行:local: 只能在函数中使用
279

ip.sh: 第 4 行:local: 只能在函数中使用
280

ip.sh: 第 4 行:local: 只能在函数中使用
281

ip.sh: 第 4 行:local: 只能在函数中使用
282

ip.sh: 第 4 行:local: 只能在函数中使用
283

ip.sh: 第 4 行:local: 只能在函数中使用
284

ip.sh: 第 4 行:local: 只能在函数中使用
285

ip.sh: 第 4 行:local: 只能在函数中使用
286

ip.sh: 第 4 行:local: 只能在函数中使用
287

ip.sh: 第 4 行:local: 只能在函数中使用
288

ip.sh: 第 4 行:local: 只能在函数中使用
289

ip.sh: 第 4 行:local: 只能在函数中使用
290

ip.sh: 第 4 行:local: 只能在函数中使用
291

ip.sh: 第 4 行:local: 只能在函数中使用
292

ip.sh: 第 4 行:local: 只能在函数中使用
293

ip.sh: 第 4 行:local: 只能在函数中使用
294

ip.sh: 第 4 行:local: 只能在函数中使用
295

ip.sh: 第 4 行:local: 只能在函数中使用
296

ip.sh: 第 4 行:local: 只能在函数中使用
297

ip.sh: 第 4 行:local: 只能在函数中使用
298

ip.sh: 第 4 行:local: 只能在函数中使用
299

ip.sh: 第 4 行:local: 只能在函数中使用
300

ip.sh: 第 4 行:local: 只能在函数中使用
301

ip.sh: 第 4 行:local: 只能在函数中使用
302

ip.sh: 第 4 行:local: 只能在函数中使用
303

ip.sh: 第 4 行:local: 只能在函数中使用
304

ip.sh: 第 4 行:local: 只能在函数中使用
305

ip.sh: 第 4 行:local: 只能在函数中使用
306

ip.sh: 第 4 行:local: 只能在函数中使用
307

ip.sh: 第 4 行:local: 只能在函数中使用
308

ip.sh: 第 4 行:local: 只能在函数中使用
309

ip.sh: 第 4 行:local: 只能在函数中使用
310

ip.sh: 第 4 行:local: 只能在函数中使用
311

ip.sh: 第 4 行:local: 只能在函数中使用
312

ip.sh: 第 4 行:local: 只能在函数中使用
313

ip.sh: 第 4 行:local: 只能在函数中使用
314

ip.sh: 第 4 行:local: 只能在函数中使用
315

ip.sh: 第 4 行:local: 只能在函数中使用
316

ip.sh: 第 4 行:local: 只能在函数中使用
317

ip.sh: 第 4 行:local: 只能在函数中使用
318

ip.sh: 第 4 行:local: 只能在函数中使用
319

ip.sh: 第 4 行:local: 只能在函数中使用
320

ip.sh: 第 4 行:local: 只能在函数中使用
321

ip.sh: 第 4 行:local: 只能在函数中使用
322

ip.sh: 第 4 行:local: 只能在函数中使用
323

ip.sh: 第 4 行:local: 只能在函数中使用
324

ip.sh: 第 4 行:local: 只能在函数中使用
325

ip.sh: 第 4 行:local: 只能在函数中使用
326

ip.sh: 第 4 行:local: 只能在函数中使用
327

ip.sh: 第 4 行:local: 只能在函数中使用
328

ip.sh: 第 4 行:local: 只能在函数中使用
329

ip.sh: 第 4 行:local: 只能在函数中使用
330

ip.sh: 第 4 行:local: 只能在函数中使用
331

ip.sh: 第 4 行:local: 只能在函数中使用
332

ip.sh: 第 4 行:local: 只能在函数中使用
333

ip.sh: 第 4 行:local: 只能在函数中使用
334

ip.sh: 第 4 行:local: 只能在函数中使用
335

ip.sh: 第 4 行:local: 只能在函数中使用
336

ip.sh: 第 4 行:local: 只能在函数中使用
337

ip.sh: 第 4 行:local: 只能在函数中使用
338

ip.sh: 第 4 行:local: 只能在函数中使用
339

ip.sh: 第 4 行:local: 只能在函数中使用
340

ip.sh: 第 4 行:local: 只能在函数中使用
341

ip.sh: 第 4 行:local: 只能在函数中使用
342

ip.sh: 第 4 行:local: 只能在函数中使用
343

ip.sh: 第 4 行:local: 只能在函数中使用
344

ip.sh: 第 4 行:local: 只能在函数中使用
345

ip.sh: 第 4 行:local: 只能在函数中使用
346

ip.sh: 第 4 行:local: 只能在函数中使用
347

ip.sh: 第 4 行:local: 只能在函数中使用
348

ip.sh: 第 4 行:local: 只能在函数中使用
349

ip.sh: 第 4 行:local: 只能在函数中使用
350

ip.sh: 第 4 行:local: 只能在函数中使用
351

ip.sh: 第 4 行:local: 只能在函数中使用
352

ip.sh: 第 4 行:local: 只能在函数中使用
353

ip.sh: 第 4 行:local: 只能在函数中使用
354

ip.sh: 第 4 行:local: 只能在函数中使用
355

ip.sh: 第 4 行:local: 只能在函数中使用
356

ip.sh: 第 4 行:local: 只能在函数中使用
357

ip.sh: 第 4 行:local: 只能在函数中使用
358

ip.sh: 第 4 行:local: 只能在函数中使用
359

ip.sh: 第 4 行:local: 只能在函数中使用
360

ip.sh: 第 4 行:local: 只能在函数中使用
361

ip.sh: 第 4 行:local: 只能在函数中使用
362

ip.sh: 第 4 行:local: 只能在函数中使用
363

ip.sh: 第 4 行:local: 只能在函数中使用
364

ip.sh: 第 4 行:local: 只能在函数中使用
365

ip.sh: 第 4 行:local: 只能在函数中使用
366

ip.sh: 第 4 行:local: 只能在函数中使用
367

ip.sh: 第 4 行:local: 只能在函数中使用
368

ip.sh: 第 4 行:local: 只能在函数中使用
369

ip.sh: 第 4 行:local: 只能在函数中使用
370

ip.sh: 第 4 行:local: 只能在函数中使用
371

ip.sh: 第 4 行:local: 只能在函数中使用
372

ip.sh: 第 4 行:local: 只能在函数中使用
373

ip.sh: 第 4 行:local: 只能在函数中使用
374

ip.sh: 第 4 行:local: 只能在函数中使用
375

ip.sh: 第 4 行:local: 只能在函数中使用
376

ip.sh: 第 4 行:local: 只能在函数中使用
377

ip.sh: 第 4 行:local: 只能在函数中使用
378

ip.sh: 第 4 行:local: 只能在函数中使用
379

ip.sh: 第 4 行:local: 只能在函数中使用
380

ip.sh: 第 4 行:local: 只能在函数中使用
381

ip.sh: 第 4 行:local: 只能在函数中使用
382

ip.sh: 第 4 行:local: 只能在函数中使用
383

ip.sh: 第 4 行:local: 只能在函数中使用
384

ip.sh: 第 4 行:local: 只能在函数中使用
385

ip.sh: 第 4 行:local: 只能在函数中使用
386

ip.sh: 第 4 行:local: 只能在函数中使用
387

ip.sh: 第 4 行:local: 只能在函数中使用
388

ip.sh: 第 4 行:local: 只能在函数中使用
389

ip.sh: 第 4 行:local: 只能在函数中使用
390

ip.sh: 第 4 行:local: 只能在函数中使用
391

ip.sh: 第 4 行:local: 只能在函数中使用
392

ip.sh: 第 4 行:local: 只能在函数中使用
393

ip.sh: 第 4 行:local: 只能在函数中使用
394

ip.sh: 第 4 行:local: 只能在函数中使用
395

ip.sh: 第 4 行:local: 只能在函数中使用
396

ip.sh: 第 4 行:local: 只能在函数中使用
397

ip.sh: 第 4 行:local: 只能在函数中使用
398

ip.sh: 第 4 行:local: 只能在函数中使用
399

ip.sh: 第 4 行:local: 只能在函数中使用
400

ip.sh: 第 4 行:local: 只能在函数中使用
401

ip.sh: 第 4 行:local: 只能在函数中使用
402

ip.sh: 第 4 行:local: 只能在函数中使用
403

ip.sh: 第 4 行:local: 只能在函数中使用
404

ip.sh: 第 4 行:local: 只能在函数中使用
405

ip.sh: 第 4 行:local: 只能在函数中使用
406

ip.sh: 第 4 行:local: 只能在函数中使用
407

ip.sh: 第 4 行:local: 只能在函数中使用
408

ip.sh: 第 4 行:local: 只能在函数中使用
409

ip.sh: 第 4 行:local: 只能在函数中使用
410

ip.sh: 第 4 行:local: 只能在函数中使用
411

ip.sh: 第 4 行:local: 只能在函数中使用
412

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

2
Nov
3
Nov
4
Nov
5
Nov
6
Nov
7
Nov
8
Nov
9
Nov
10
Nov
11
Nov
12
Nov
13
Nov
14
Nov
15
Nov
16
Nov
17
Nov
18
Nov
19
Nov
20
Nov
21
Nov
22
Nov
23
Nov
24
Nov
25
Nov
26
Nov
27
Nov
28
Nov
29
Nov
30
Nov
31
Nov
32
Nov
33
Nov
34
Nov
35
Nov
36
Nov
37
Nov
38
Nov
39
Nov
40
Nov
41
Nov
42
Nov
43
Nov
44
Nov
45
Nov
46
Nov
47
Nov
48
Nov
49
Nov
50
Nov
51
Nov
52
Nov
53
Nov
54
Nov
55
Nov
56
Nov
57
Nov
58
Nov
59
Nov
60
Nov
61
Nov
62
Nov
63
Nov
64
Nov
65
Nov
66
Nov
67
Nov
68
Nov
69
Nov
70
Nov
71
Nov
72
Nov
73
Nov
74
Nov
75
Nov
76
Nov
77
Nov
78
Nov
79
Nov
80
Nov
81
Nov
82
Nov
83
Nov
84
Nov
85
Nov
86
Nov
87
Nov
88
Nov
89
Nov
90
Nov
91
Nov
92
Nov
93
Nov
94
Nov
95
Nov
96
Nov
97
Nov
98
Nov
99
Nov
100
Nov
101
Nov
102
Nov
103
Nov
104
Nov
105
Nov
106
Nov
107
Nov
108
Nov
109
Nov
110
Nov
111
Nov
112
Nov
113
Nov
114
Nov
115
Nov
116
Nov
117
Nov
118
Nov
119
Nov
120
Nov
121
Nov
122
Nov
123
Nov
124
Nov
125
Nov
126
Nov
127
Nov
128
Nov
129
Nov
130
Nov
131
Nov
132
Nov
133
Nov
134
Nov
135
Nov
136
Nov
137
Nov
138
Nov
139
Nov
140
Nov
141
Nov
142
Nov
143
Nov
144
Nov
145
Nov
146
Nov
147
Nov
148
Nov
149
Nov
150
Nov
151
Nov
152
Nov
153
Nov
154
Nov
155
Nov
156
Nov
157
Nov
158
Nov
159
Nov
160
Nov
161
Nov
162
Nov
163
Nov
164
Nov
165
Nov
166
Nov
167
Nov
168
Nov
169
Nov
170
Nov
171
Nov
172
Nov
173
Nov
174
Nov
175
Nov
176
Nov
177
Nov
178
Nov
179
Nov
180
Nov
181
Nov
182
Nov
183
Nov
184
Nov
185
Nov
186
Nov
187
Nov
188
Nov
189
Nov
190
Nov
191
Nov
192
Nov
193
Nov
194
Nov
195
Nov
196
Nov
197
Nov
198
Nov
199
Nov
200
Nov
201
Nov
202
Nov
203
Nov
204
Nov
205
Nov
206
Nov
207
Nov
208
Nov
209
Nov
210
Nov
211
Nov
212
Nov
213
Nov
214
Nov
215
Nov
216
Nov
217
Nov
218
Nov
219
Nov
220
Nov
221
Nov
222
Nov
223
Nov
224
Nov
225
Nov
226
Nov
227
Nov
228
Nov
229
Nov
230
Nov
231
Nov
232
Nov
233
Nov
234
Nov
235
Nov
236
Nov
237
Nov
238
Nov
239
Nov
240
Nov
241
Nov
242
Nov
243
Nov
244
Nov
245
Nov
246
Nov
247
Nov
248
Nov
249
Nov
250
Nov
251
Nov
252
Nov
253
Nov
254
Nov
255
Nov
256
Nov
257
Nov
258
Nov
259
Nov
260
Nov
261
Nov
262
Nov
263
Nov
264
Nov
265
Nov
266
Nov
267
Nov
268
Nov
269
Nov
270
Nov
271
Nov
272
Nov
273
Nov
274
Nov
275
Nov
276
Nov
277
Nov
278
Nov
279
Nov
280
Nov
281
Nov
282
Nov
283
Nov
284
Nov
285
Nov
286
Nov
287
Nov
288
Nov
289
Nov
290
Nov
291
Nov
292
Nov
293
Nov
294
Nov
295
Nov
296
Nov
297
Nov
298
Nov
299
Nov
300
Nov
301
Nov
302
Nov
303
Nov
304
Nov
305
Nov
306
Nov
307
Nov
308
Nov
309
Nov
310
Nov
311
Nov
312
Nov
313
Nov
314
Nov
315
Nov
316
Nov
317
Nov
318
Nov
319
Nov
320
Nov
321
Nov
322
Nov
323
Nov
324
Nov
325
Nov
326
Nov
327
Nov
328
Nov
329
Nov
330
Nov
331
Nov
332
Nov
333
Nov
334
Nov
335
Nov
336
Nov
337
Nov
338
Nov
339
Nov
340
Nov
341
Nov
342
Nov
343
Nov
344
Nov
345
Nov
346
Nov
347
Nov
348
Nov
349
Nov
350
Nov
351
Nov
352
Nov
353
Nov
354
Nov
355
Nov
356
Nov
357
Nov
358
Nov
359
Nov
360
Nov
361
Nov
362
Nov
363
Nov
364
Nov
365
Nov
366
Nov
367
Nov
368
Nov
369
Nov
370
Nov
371
Nov
372
Nov
373
Nov
374
Nov
375
Nov
376
Nov
377
Nov
378
Nov
379
Nov
380
Nov
381
Nov
382
Nov
383
Nov
384
Nov
385
Nov
386
Nov
387
Nov
388
Nov
389
Nov
390
Nov
391
Nov
392
Nov
393
Nov
394
Nov
395
Nov
396
Nov
397
Nov
398
Nov
399
Nov
400
Nov
401
Nov
402
Nov
403
Nov
404
Nov
405
Nov
406
Nov
407
Nov
408
Nov
409
Nov
410
Nov
411
Nov
412
Nov
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
1

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
周一
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
Nov
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
  
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
 
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "116.4.24.154", "country": "广东省东莞市", "city": "电信"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
weekday
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mon
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

Nov
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

5
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

10:12:14
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

116.4.24.154
{"ip": "116.4.24.154", "country": "广东省东莞市", "city": "电信"}

Mon
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

Nov
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}

5
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}


Nov
5
10:12:14




116.4.24.154
Mo
curl: (3) Illegal characters found in URL


Nov
5
boot
3.10.0-862.14.4.
Wed
Ja
curl: (3) Illegal characters found in URL


113.77.123.139
Wed
Ja
curl: (3) Illegal characters found in URL


30
117.25.162.227
Wed
Ja
curl: (3) Illegal characters found in URL


30
117.25.162.227
Wed
Ja
curl: (3) Illegal characters found in URL


30
117.25.162.227
Thu
Ja
curl: (3) Illegal characters found in URL


31
117.25.162.227
Thu
Ja
curl: (3) Illegal characters found in URL


31
117.25.162.227
Fri
Feb
1
27.154.161.107
Su
curl: (3) Illegal characters found in URL


Feb
3
boot
3.10.0-957.1.3.e
Su
curl: (3) Illegal characters found in URL


Feb
27.154.161.107
Su
curl: (3) Illegal characters found in URL


Feb
3
27.154.218.161
Mo
curl: (3) Illegal characters found in URL


Feb
4
27.154.218.161
Mo
curl: (3) Illegal characters found in URL


Feb
4
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
27.154.218.161
Wed
Feb
6
110.87.12.156
Wed
Feb
6
boot
3.10.0-957.1.3.e
Wed
Feb
110.87.12.156
Wed
Feb
6
27.154.218.161
Thu
Feb
7
110.87.12.156
Thu
Feb
7
Thu
Feb
7
19:58
27.154.218.161
Thu
Feb
7
110.87.73.216
Fri
Feb
8
110.87.73.216
Fri
Feb
8
120.79.243.112
Fri
Feb
8
110.87.75.220
Fri
Feb
8
110.87.75.220
Fri
Feb
8
27.154.218.161
Sat
Feb
9
110.87.12.156
Su
curl: (3) Illegal characters found in URL


Feb
10
27.154.218.161
Su
curl: (3) Illegal characters found in URL


Feb
10
117.25.162.227
Mo
curl: (3) Illegal characters found in URL


Feb
11
110.87.12.156
Mo
curl: (3) Illegal characters found in URL


Feb
11
117.25.162.227
Tue
Feb
12
117.25.162.227
Wed
Feb
13
boot
3.10.0-957.1.3.e
Wed
Feb
boot
3.10.0-957.1.3.e
Wed
Feb
117.25.162.227
Wed
Feb
13
117.25.162.227
Wed
Feb
13
117.25.162.227
Thu
Feb
14
27.154.161.209
Fri
Feb
15
117.25.162.227
Sat
Feb
16
boot
3.10.0-957.1.3.e
Sat
Feb
117.25.162.227
Sat
Feb
16
27.154.161.209
Su
curl: (3) Illegal characters found in URL


Feb
17
117.25.162.227
Mo
curl: (3) Illegal characters found in URL


Feb
18
117.25.162.227
Wed
Feb
20
117.30.197.149
Su
curl: (3) Illegal characters found in URL


Mar
31
117.30.208.154
Su
curl: (3) Illegal characters found in URL


May
5
117.30.208.112
Mo
curl: (3) Illegal characters found in URL


May
6
106.122.165.95
Wed
May
8
106.122.165.95
Wed
May
8
106.122.174.162
Thu
May
23
117.28.133.164
Mo
curl: (3) Illegal characters found in URL


Ju
curl: (3) Illegal characters found in URL


3
117.28.133.164
Mo
curl: (3) Illegal characters found in URL


Ju
curl: (3) Illegal characters found in URL


3
117.28.133.230
Tue
Ju
curl: (3) Illegal characters found in URL


4
117.30.208.79
Thu
Jul
18
110.87.74.167
Sat
Aug
31
110.87.74.167
Sat
Aug
31
110.87.72.93
Sat
Aug
31
boot
3.10.0-957.1.3.e
Sat
Aug
119.123.50.141
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.13.50
Su
curl: (3) Illegal characters found in URL


Sep
1
110.87.13.50
Mo
curl: (3) Illegal characters found in URL


Sep
2
110.87.13.50
Tue
Sep
3
59.57.195.29
Wed
Sep
4
117.30.204.139
Fri
Sep
13
120.41.145.233
Fri
Sep
13
117.30.197.18
Su
curl: (3) Illegal characters found in URL


Sep
15
110.87.71.225
Su
curl: (3) Illegal characters found in URL


Sep
15
117.30.197.18
Su
curl: (3) Illegal characters found in URL


Sep
15
110.87.71.225
Su
curl: (3) Illegal characters found in URL


Sep
15
110.87.71.225
Mo
curl: (3) Illegal characters found in URL


Sep
16
110.87.12.61
Su
curl: (3) Illegal characters found in URL


Sep
22
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
121.204.57.163
Sat
Ja
curl: (3) Illegal characters found in URL


18
117.30.196.157
Mo
curl: (3) Illegal characters found in URL


Ja
curl: (3) Illegal characters found in URL


20
117.30.196.157
Mo
curl: (3) Illegal characters found in URL


Ja
curl: (3) Illegal characters found in URL


20
110.84.205.33
Fri
Feb
14
121.204.56.187
Thu
Feb
20
117.30.197.3
Sat
Feb
29
117.30.197.3
Sat
Feb
29
59.57.175.218
Sat
Feb
29
59.57.175.218
Sat
Feb
29
117.30.196.102
Su
curl: (3) Illegal characters found in URL


Mar
1
curl: (3) Illegal characters found in URL

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo


Nov
5
10:12:14




116.4.24.154
Mo


Nov
5
boot
3.10.0-862.14.4.
Wed
Ja


113.77.123.139
Wed
Ja


30
117.25.162.227
Wed
Ja


30
117.25.162.227
Wed
Ja


30
117.25.162.227
Thu
Ja


31
117.25.162.227
Thu
Ja


31
117.25.162.227
Fri
Feb
1
27.154.161.107
Su


Feb
3
boot
3.10.0-957.1.3.e
Su


Feb
27.154.161.107
Su


Feb
3
27.154.218.161
Mo


Feb
4
27.154.218.161
Mo


Feb
4
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
27.154.218.161
Wed
Feb
6
110.87.12.156
Wed
Feb
6
boot
3.10.0-957.1.3.e
Wed
Feb
110.87.12.156
Wed
Feb
6
27.154.218.161
Thu
Feb
7
110.87.12.156
Thu
Feb
7
Thu
Feb
7
19:58
27.154.218.161
Thu
Feb
7
110.87.73.216
Fri
Feb
8
110.87.73.216
Fri
Feb
8
120.79.243.112
Fri
Feb
8
110.87.75.220
Fri
Feb
8
110.87.75.220
Fri
Feb
8
27.154.218.161
Sat
Feb
9
110.87.12.156
Su


Feb
10
27.154.218.161
Su


Feb
10
117.25.162.227
Mo


Feb
11
110.87.12.156
Mo


Feb
11
117.25.162.227
Tue
Feb
12
117.25.162.227
Wed
Feb
13
boot
3.10.0-957.1.3.e
Wed
Feb
boot
3.10.0-957.1.3.e
Wed
Feb
117.25.162.227
Wed
Feb
13
117.25.162.227
Wed
Feb
13
117.25.162.227
Thu
Feb
14
27.154.161.209
Fri
Feb
15
117.25.162.227
Sat
Feb
16
boot
3.10.0-957.1.3.e
Sat
Feb
117.25.162.227
Sat
Feb
16
27.154.161.209
Su


Feb
17
117.25.162.227
Mo


Feb
18
117.25.162.227
Wed
Feb
20
117.30.197.149
Su


Mar
31
117.30.208.154
Su


May
5
117.30.208.112
Mo


May
6
106.122.165.95
Wed
May
8
106.122.165.95
Wed
May
8
106.122.174.162
Thu
May
23
117.28.133.164
Mo


Ju


3
117.28.133.164
Mo


Ju


3
117.28.133.230
Tue
Ju


4
117.30.208.79
Thu
Jul
18
110.87.74.167
Sat
Aug
31
110.87.74.167
Sat
Aug
31
110.87.72.93
Sat
Aug
31
boot
3.10.0-957.1.3.e
Sat
Aug
119.123.50.141
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.13.50
Su


Sep
1
110.87.13.50
Mo


Sep
2
110.87.13.50
Tue
Sep
3
59.57.195.29
Wed
Sep
4
117.30.204.139
Fri
Sep
13
120.41.145.233
Fri
Sep
13
117.30.197.18
Su


Sep
15
110.87.71.225
Su


Sep
15
117.30.197.18
Su


Sep
15
110.87.71.225
Su


Sep
15
110.87.71.225
Mo


Sep
16
110.87.12.61
Su


Sep
22
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
121.204.57.163
Sat
Ja


18
117.30.196.157
Mo


Ja


20
117.30.196.157
Mo


Ja


20
110.84.205.33
Fri
Feb
14
121.204.56.187
Thu
Feb
20
117.30.197.3
Sat
Feb
29
117.30.197.3
Sat
Feb
29
59.57.175.218
Sat
Feb
29
59.57.175.218
Sat
Feb
29
117.30.196.102
Su


Mar
1

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo 
Nov
5
10:12:14




116.4.24.154
Mo 
Nov
5
boot
3.10.0-862.14.4.
Wed
Ja 
113.77.123.139
Wed
Ja 
30
117.25.162.227
Wed
Ja 
30
117.25.162.227
Wed
Ja 
30
117.25.162.227
Thu
Ja 
31
117.25.162.227
Thu
Ja 
31
117.25.162.227
Fri
Feb
1
27.154.161.107
Su 
Feb
3
boot
3.10.0-957.1.3.e
Su 
Feb
27.154.161.107
Su 
Feb
3
27.154.218.161
Mo 
Feb
4
27.154.218.161
Mo 
Feb
4
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
27.154.218.161
Wed
Feb
6
110.87.12.156
Wed
Feb
6
boot
3.10.0-957.1.3.e
Wed
Feb
110.87.12.156
Wed
Feb
6
27.154.218.161
Thu
Feb
7
110.87.12.156
Thu
Feb
7
Thu
Feb
7
19:58
27.154.218.161
Thu
Feb
7
110.87.73.216
Fri
Feb
8
110.87.73.216
Fri
Feb
8
120.79.243.112
Fri
Feb
8
110.87.75.220
Fri
Feb
8
110.87.75.220
Fri
Feb
8
27.154.218.161
Sat
Feb
9
110.87.12.156
Su 
Feb
10
27.154.218.161
Su 
Feb
10
117.25.162.227
Mo 
Feb
11
110.87.12.156
Mo 
Feb
11
117.25.162.227
Tue
Feb
12
117.25.162.227
Wed
Feb
13
boot
3.10.0-957.1.3.e
Wed
Feb
boot
3.10.0-957.1.3.e
Wed
Feb
117.25.162.227
Wed
Feb
13
117.25.162.227
Wed
Feb
13
117.25.162.227
Thu
Feb
14
27.154.161.209
Fri
Feb
15
117.25.162.227
Sat
Feb
16
boot
3.10.0-957.1.3.e
Sat
Feb
117.25.162.227
Sat
Feb
16
27.154.161.209
Su 
Feb
17
117.25.162.227
Mo 
Feb
18
117.25.162.227
Wed
Feb
20
117.30.197.149
Su 
Mar
31
117.30.208.154
Su 
May
5
117.30.208.112
Mo 
May
6
106.122.165.95
Wed
May
8
106.122.165.95
Wed
May
8
106.122.174.162
Thu
May
23
117.28.133.164
Mo 
Ju 
3
117.28.133.164
Mo 
Ju 
3
117.28.133.230
Tue
Ju 
4
117.30.208.79
Thu
Jul
18
110.87.74.167
Sat
Aug
31
110.87.74.167
Sat
Aug
31
110.87.72.93
Sat
Aug
31
boot
3.10.0-957.1.3.e
Sat
Aug
119.123.50.141
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.13.50
Su 
Sep
1
110.87.13.50
Mo 
Sep
2
110.87.13.50
Tue
Sep
3
59.57.195.29
Wed
Sep
4
117.30.204.139
Fri
Sep
13
120.41.145.233
Fri
Sep
13
117.30.197.18
Su 
Sep
15
110.87.71.225
Su 
Sep
15
117.30.197.18
Su 
Sep
15
110.87.71.225
Su 
Sep
15
110.87.71.225
Mo 
Sep
16
110.87.12.61
Su 
Sep
22
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
121.204.57.163
Sat
Ja 
18
117.30.196.157
Mo 
Ja 
20
117.30.196.157
Mo 
Ja 
20
110.84.205.33
Fri
Feb
14
121.204.56.187
Thu
Feb
20
117.30.197.3
Sat
Feb
29
117.30.197.3
Sat
Feb
29
59.57.175.218
Sat
Feb
29
59.57.175.218
Sat
Feb
29
117.30.196.102
Su 
Mar
1
Mo


Nov
5
10:12:14




116.4.24.154
Mo


Nov
5
boot
3.10.0-862.14.4.
Wed
Ja


113.77.123.139
Wed
Ja


30
117.25.162.227
Wed
Ja


30
117.25.162.227
Wed
Ja


30
117.25.162.227
Thu
Ja


31
117.25.162.227
Thu
Ja


31
117.25.162.227
Fri
Feb
1
27.154.161.107
Su


Feb
3
boot
3.10.0-957.1.3.e
Su


Feb
27.154.161.107
Su


Feb
3
27.154.218.161
Mo


Feb
4
27.154.218.161
Mo


Feb
4
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
27.154.218.161
Wed
Feb
6
110.87.12.156
Wed
Feb
6
boot
3.10.0-957.1.3.e
Wed
Feb
110.87.12.156
Wed
Feb
6
27.154.218.161
Thu
Feb
7
110.87.12.156
Thu
Feb
7
Thu
Feb
7
19:58
27.154.218.161
Thu
Feb
7
110.87.73.216
Fri
Feb
8
110.87.73.216
Fri
Feb
8
120.79.243.112
Fri
Feb
8
110.87.75.220
Fri
Feb
8
110.87.75.220
Fri
Feb
8
27.154.218.161
Sat
Feb
9
110.87.12.156
Su


Feb
10
27.154.218.161
Su


Feb
10
117.25.162.227
Mo


Feb
11
110.87.12.156
Mo


Feb
11
117.25.162.227
Tue
Feb
12
117.25.162.227
Wed
Feb
13
boot
3.10.0-957.1.3.e
Wed
Feb
boot
3.10.0-957.1.3.e
Wed
Feb
117.25.162.227
Wed
Feb
13
117.25.162.227
Wed
Feb
13
117.25.162.227
Thu
Feb
14
27.154.161.209
Fri
Feb
15
117.25.162.227
Sat
Feb
16
boot
3.10.0-957.1.3.e
Sat
Feb
117.25.162.227
Sat
Feb
16
27.154.161.209
Su


Feb
17
117.25.162.227
Mo


Feb
18
117.25.162.227
Wed
Feb
20
117.30.197.149
Su


Mar
31
117.30.208.154
Su


May
5
117.30.208.112
Mo


May
6
106.122.165.95
Wed
May
8
106.122.165.95
Wed
May
8
106.122.174.162
Thu
May
23
117.28.133.164
Mo


Ju


3
117.28.133.164
Mo


Ju


3
117.28.133.230
Tue
Ju


4
117.30.208.79
Thu
Jul
18
110.87.74.167
Sat
Aug
31
110.87.74.167
Sat
Aug
31
110.87.72.93
Sat
Aug
31
boot
3.10.0-957.1.3.e
Sat
Aug
119.123.50.141
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.13.50
Su


Sep
1
110.87.13.50
Mo


Sep
2
110.87.13.50
Tue
Sep
3
59.57.195.29
Wed
Sep
4
117.30.204.139
Fri
Sep
13
120.41.145.233
Fri
Sep
13
117.30.197.18
Su


Sep
15
110.87.71.225
Su


Sep
15
117.30.197.18
Su


Sep
15
110.87.71.225
Su


Sep
15
110.87.71.225
Mo


Sep
16
110.87.12.61
Su


Sep
22
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
121.204.57.163
Sat
Ja


18
117.30.196.157
Mo


Ja


20
117.30.196.157
Mo


Ja


20
110.84.205.33
Fri
Feb
14
121.204.56.187
Thu
Feb
20
117.30.197.3
Sat
Feb
29
117.30.197.3
Sat
Feb
29
59.57.175.218
Sat
Feb
29
59.57.175.218
Sat
Feb
29
117.30.196.102
Su


Mar
1

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo 
Nov
5
10:12:14




116.4.24.154
Mo 
Nov
5
boot
3.10.0-862.14.4.
Wed
Ja 
113.77.123.139
Wed
Ja 
30
117.25.162.227
Wed
Ja 
30
117.25.162.227
Wed
Ja 
30
117.25.162.227
Thu
Ja 
31
117.25.162.227
Thu
Ja 
31
117.25.162.227
Fri
Feb
1
27.154.161.107
Su 
Feb
3
boot
3.10.0-957.1.3.e
Su 
Feb
27.154.161.107
Su 
Feb
3
27.154.218.161
Mo 
Feb
4
27.154.218.161
Mo 
Feb
4
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
boot
3.10.0-957.1.3.e
Tue
Feb
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
110.87.74.32
Tue
Feb
5
27.154.218.161
Wed
Feb
6
110.87.12.156
Wed
Feb
6
boot
3.10.0-957.1.3.e
Wed
Feb
110.87.12.156
Wed
Feb
6
27.154.218.161
Thu
Feb
7
110.87.12.156
Thu
Feb
7
Thu
Feb
7
19:58
27.154.218.161
Thu
Feb
7
110.87.73.216
Fri
Feb
8
110.87.73.216
Fri
Feb
8
120.79.243.112
Fri
Feb
8
110.87.75.220
Fri
Feb
8
110.87.75.220
Fri
Feb
8
27.154.218.161
Sat
Feb
9
110.87.12.156
Su 
Feb
10
27.154.218.161
Su 
Feb
10
117.25.162.227
Mo 
Feb
11
110.87.12.156
Mo 
Feb
11
117.25.162.227
Tue
Feb
12
117.25.162.227
Wed
Feb
13
boot
3.10.0-957.1.3.e
Wed
Feb
boot
3.10.0-957.1.3.e
Wed
Feb
117.25.162.227
Wed
Feb
13
117.25.162.227
Wed
Feb
13
117.25.162.227
Thu
Feb
14
27.154.161.209
Fri
Feb
15
117.25.162.227
Sat
Feb
16
boot
3.10.0-957.1.3.e
Sat
Feb
117.25.162.227
Sat
Feb
16
27.154.161.209
Su 
Feb
17
117.25.162.227
Mo 
Feb
18
117.25.162.227
Wed
Feb
20
117.30.197.149
Su 
Mar
31
117.30.208.154
Su 
May
5
117.30.208.112
Mo 
May
6
106.122.165.95
Wed
May
8
106.122.165.95
Wed
May
8
106.122.174.162
Thu
May
23
117.28.133.164
Mo 
Ju 
3
117.28.133.164
Mo 
Ju 
3
117.28.133.230
Tue
Ju 
4
117.30.208.79
Thu
Jul
18
110.87.74.167
Sat
Aug
31
110.87.74.167
Sat
Aug
31
110.87.72.93
Sat
Aug
31
boot
3.10.0-957.1.3.e
Sat
Aug
119.123.50.141
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.72.93
Sat
Aug
31
110.87.13.50
Su 
Sep
1
110.87.13.50
Mo 
Sep
2
110.87.13.50
Tue
Sep
3
59.57.195.29
Wed
Sep
4
117.30.204.139
Fri
Sep
13
120.41.145.233
Fri
Sep
13
117.30.197.18
Su 
Sep
15
110.87.71.225
Su 
Sep
15
117.30.197.18
Su 
Sep
15
110.87.71.225
Su 
Sep
15
110.87.71.225
Mo 
Sep
16
110.87.12.61
Su 
Sep
22
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
120.41.165.224
Tue
Oct
1
121.204.57.163
Sat
Ja 
18
117.30.196.157
Mo 
Ja 
20
117.30.196.157
Mo 
Ja 
20
110.84.205.33
Fri
Feb
14
121.204.56.187
Thu
Feb
20
117.30.197.3
Sat
Feb
29
117.30.197.3
Sat
Feb
29
59.57.175.218
Sat
Feb
29
59.57.175.218
Sat
Feb
29
117.30.196.102
Su 
Mar
1
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo Nov510:12:14

116.4.24.154Mo Nov5
boot3.10.0-862.14.4.WedJa 
113.77.123.139WedJa 30
117.25.162.227WedJa 30
117.25.162.227WedJa 30
117.25.162.227ThuJa 31
117.25.162.227ThuJa 31
117.25.162.227FriFeb1
27.154.161.107Su Feb3
boot3.10.0-957.1.3.eSu Feb
27.154.161.107Su Feb3
27.154.218.161Mo Feb4
27.154.218.161Mo Feb4
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
boot3.10.0-957.1.3.eTueFeb
110.87.74.32TueFeb5
110.87.74.32TueFeb5
boot3.10.0-957.1.3.eTueFeb
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
27.154.218.161WedFeb6
110.87.12.156WedFeb6
boot3.10.0-957.1.3.eWedFeb
110.87.12.156WedFeb6
27.154.218.161ThuFeb7
110.87.12.156ThuFeb7
ThuFeb719:58
27.154.218.161ThuFeb7
110.87.73.216FriFeb8
110.87.73.216FriFeb8
120.79.243.112FriFeb8
110.87.75.220FriFeb8
110.87.75.220FriFeb8
27.154.218.161SatFeb9
110.87.12.156Su Feb10
27.154.218.161Su Feb10
117.25.162.227Mo Feb11
110.87.12.156Mo Feb11
117.25.162.227TueFeb12
117.25.162.227WedFeb13
boot3.10.0-957.1.3.eWedFeb
boot3.10.0-957.1.3.eWedFeb
117.25.162.227WedFeb13
117.25.162.227WedFeb13
117.25.162.227ThuFeb14
27.154.161.209FriFeb15
117.25.162.227SatFeb16
boot3.10.0-957.1.3.eSatFeb
117.25.162.227SatFeb16
27.154.161.209Su Feb17
117.25.162.227Mo Feb18
117.25.162.227WedFeb20
117.30.197.149Su Mar31
117.30.208.154Su May5
117.30.208.112Mo May6
106.122.165.95WedMay8
106.122.165.95WedMay8
106.122.174.162ThuMay23
117.28.133.164Mo Ju 3
117.28.133.164Mo Ju 3
117.28.133.230TueJu 4
117.30.208.79ThuJul18
110.87.74.167SatAug31
110.87.74.167SatAug31
110.87.72.93SatAug31
boot3.10.0-957.1.3.eSatAug
119.123.50.141SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.13.50Su Sep1
110.87.13.50Mo Sep2
110.87.13.50TueSep3
59.57.195.29WedSep4
117.30.204.139FriSep13
120.41.145.233FriSep13
117.30.197.18Su Sep15
110.87.71.225Su Sep15
117.30.197.18Su Sep15
110.87.71.225Su Sep15
110.87.71.225Mo Sep16
110.87.12.61Su Sep22
120.41.165.224TueOct1
120.41.165.224TueOct1
120.41.165.224TueOct1
121.204.57.163SatJa 18
117.30.196.157Mo Ja 20
117.30.196.157Mo Ja 20
110.84.205.33FriFeb14
121.204.56.187ThuFeb20
117.30.197.3SatFeb29
117.30.197.3SatFeb29
59.57.175.218SatFeb29
59.57.175.218SatFeb29
117.30.196.102Su Mar1
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
gawk: cmd. line:1: BEGIN{FS=","; OFS=" " {print $3,$4,$5,$6}
gawk: cmd. line:1:                       ^ syntax error
gawk: cmd. line:1: BEGIN{FS=","; OFS=" " {print $3,$4,$5,$6}
gawk: cmd. line:1:                                          ^ unexpected newline or end of string
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
Mo

Nov510:12:14

116.4.24.154Mo

Nov5
boot3.10.0-862.14.4.WedJa


113.77.123.139WedJa

30
117.25.162.227WedJa

30
117.25.162.227WedJa

30
117.25.162.227ThuJa

31
117.25.162.227ThuJa

31
117.25.162.227FriFeb1
27.154.161.107Su

Feb3
boot3.10.0-957.1.3.eSu

Feb
27.154.161.107Su

Feb3
27.154.218.161Mo

Feb4
27.154.218.161Mo

Feb4
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
boot3.10.0-957.1.3.eTueFeb
110.87.74.32TueFeb5
110.87.74.32TueFeb5
boot3.10.0-957.1.3.eTueFeb
110.87.74.32TueFeb5
110.87.74.32TueFeb5
110.87.74.32TueFeb5
27.154.218.161WedFeb6
110.87.12.156WedFeb6
boot3.10.0-957.1.3.eWedFeb
110.87.12.156WedFeb6
27.154.218.161ThuFeb7
110.87.12.156ThuFeb7
ThuFeb719:58
27.154.218.161ThuFeb7
110.87.73.216FriFeb8
110.87.73.216FriFeb8
120.79.243.112FriFeb8
110.87.75.220FriFeb8
110.87.75.220FriFeb8
27.154.218.161SatFeb9
110.87.12.156Su

Feb10
27.154.218.161Su

Feb10
117.25.162.227Mo

Feb11
110.87.12.156Mo

Feb11
117.25.162.227TueFeb12
117.25.162.227WedFeb13
boot3.10.0-957.1.3.eWedFeb
boot3.10.0-957.1.3.eWedFeb
117.25.162.227WedFeb13
117.25.162.227WedFeb13
117.25.162.227ThuFeb14
27.154.161.209FriFeb15
117.25.162.227SatFeb16
boot3.10.0-957.1.3.eSatFeb
117.25.162.227SatFeb16
27.154.161.209Su

Feb17
117.25.162.227Mo

Feb18
117.25.162.227WedFeb20
117.30.197.149Su

Mar31
117.30.208.154Su

May5
117.30.208.112Mo

May6
106.122.165.95WedMay8
106.122.165.95WedMay8
106.122.174.162ThuMay23
117.28.133.164Mo

Ju

3
117.28.133.164Mo

Ju

3
117.28.133.230TueJu

4
117.30.208.79ThuJul18
110.87.74.167SatAug31
110.87.74.167SatAug31
110.87.72.93SatAug31
boot3.10.0-957.1.3.eSatAug
119.123.50.141SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.72.93SatAug31
110.87.13.50Su

Sep1
110.87.13.50Mo

Sep2
110.87.13.50TueSep3
59.57.195.29WedSep4
117.30.204.139FriSep13
120.41.145.233FriSep13
117.30.197.18Su

Sep15
110.87.71.225Su

Sep15
117.30.197.18Su

Sep15
110.87.71.225Su

Sep15
110.87.71.225Mo

Sep16
110.87.12.61Su

Sep22
120.41.165.224TueOct1
120.41.165.224TueOct1
120.41.165.224TueOct1
121.204.57.163SatJa

18
117.30.196.157Mo

Ja

20
117.30.196.157Mo

Ja

20
110.84.205.33FriFeb14
121.204.56.187ThuFeb20
117.30.197.3SatFeb29
117.30.197.3SatFeb29
59.57.175.218SatFeb29
59.57.175.218SatFeb29
117.30.196.102Su

Mar1

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
wtmp begi

s Mo

 Nov  5 10:12:14 2018

root     pts/0        116.4.24.154     Mo
2018

Mo
 Nov  5 10:12 - 11:46  (01:34)    
reboot   system boot  3.10.0-862.14.4. Wed Ja
-
3.10.0-862.14.4.
 30 14:10 - 23:24 (4+09:14)   
root     pts/0        113.77.123.139   Wed Ja
23:24
Wed
 30 14:11 - 14:22  (00:10)    
root     pts/0        117.25.162.227   Wed Ja
14:22
Wed
 30 14:23 - 19:51  (05:28)    
root     pts/0        117.25.162.227   Wed Ja
19:51
Wed
 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Thu Ja
21:05
Thu
 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Thu Ja
13:56
Thu
 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        27.154.161.107   Su
21:02
Fri
Su
 Feb  3 23:23 - dow
-
   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Su

3.10.0-957.1.3.e
 Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Su
-
Su
 Feb  3 23:25 - 01:39  (02:13)    
root     pts/0        27.154.218.161   Mo
-
Mo
 Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.218.161   Mo
-
Mo
 Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - dow
-
Tue
Tue
Tue
Tue
   (00:36)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - dow

Tue
   (00:27)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - dow

3.10.0-957.1.3.e
Tue
Tue
   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - dow

3.10.0-957.1.3.e
Tue
Tue
Tue
Wed
Wed
   (00:26)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/0        110.87.12.156    Su

3.10.0-957.1.3.e
Wed
Thu
Thu
Feb
Thu
Fri
Fri
Fri
Fri
Fri
Sat
Su
 Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Su
-
Su
 Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        117.25.162.227   Mo
-
Mo
 Feb 11 08:50 - 23:03  (14:13)    
root     pts/1        110.87.12.156    Mo
-
Mo
 Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - dow
-
Tue
Wed
   (00:53)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - dow

3.10.0-957.1.3.e
3.10.0-957.1.3.e
Wed
Wed
Thu
Fri
Sat
   (02:38)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
root     pts/0        27.154.161.209   Su

3.10.0-957.1.3.e
Sat
Su
 Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Mo
-
Mo
 Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.30.197.149   Su
-
Wed
Su
 Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.30.208.154   Su
-
Su
 May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.208.112   Mo
-
Mo
 May  6 21:25 - 21:47  (00:21)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        117.28.133.164   Mo
-
Wed
Wed
Thu
Mo
 Ju

  3 14:12 - 20:19  (06:07)    
root     pts/0        117.28.133.164   Mo
20:19
Mo
 Ju

  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.230   Tue Ju
21:40
Tue
  4 09:28 - 23:40  (14:11)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - dow
23:40
Thu
Sat
   (02:04)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - dow

Sat
Sat
   (00:06)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:41 (182+23:36) 
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.13.50     Su

3.10.0-957.1.3.e
Sat
Sat
Sat
Sat
Sat
Sat
Su
 Sep  1 23:00 - 02:42  (03:41)    
root     pts/0        110.87.13.50     Mo
-
Mo
 Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.197.18    Su
-
Tue
Wed
Fri
Fri
Su
 Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        110.87.71.225    Su
-
Su
 Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Su
-
Su
 Sep 15 23:44 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Su
-
Su
 Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Mo
-
Mo
 Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.12.61     Su
-
Su
 Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        121.204.57.163   Sat Ja
-
Tue
Tue
Tue
Sat
 18 20:24 - 03:15  (06:50)    
root     pts/0        117.30.196.157   Mo
03:15
Mo
 Ja

 20 12:05 - 10:03  (21:58)    
root     pts/1        117.30.196.157   Mo
10:03
Mo
 Ja

 20 13:05 - 05:04  (15:58)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        117.30.196.102   Su
05:04
Fri
Thu
Sat
Sat
Sat
Sat
Su
 Mar  1 13:08   still logged i
still
   

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:42 (182+23:37) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# echo $IFS

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
wtmp begins Mon Nov  5 10:12:14 2018

root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    
reboot   system boot  3.10.0-862.14.4. Wed J
Nov

Mon
3.10.0-862.14.4.
n 30 14:10 - 23:24 (4+09:14)   
root     pts/0        113.77.123.139   Wed J
-
Wed
n 30 14:11 - 14:22  (00:10)    
root     pts/0        117.25.162.227   Wed J
-
Wed
n 30 14:23 - 19:51  (05:28)    
root     pts/0        117.25.162.227   Wed J
-
Wed
n 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Thu J
-
Thu
n 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Thu J
-
Thu
n 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        27.154.218.161   S
-
Fri
Sun
3.10.0-957.1.3.e
Sun
Mon
Mon
Tue
Tue
Tue
Tue
Tue
3.10.0-957.1.3.e
Tue
Tue
3.10.0-957.1.3.e
Tue
Tue
Tue
Wed
Wed
3.10.0-957.1.3.e
Wed
Thu
Thu
Feb
Thu
Fri
Fri
Fri
Fri
Fri
S
t Feb  9 15:28 - 21:29  (06:00)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   S
15:28
Sun
Sun
Mon
Mon
Tue
Wed
3.10.0-957.1.3.e
3.10.0-957.1.3.e
Wed
Wed
Thu
Fri
S
t Feb 16 15:08 - down   (02:38)    
reboot   system boot  3.10.0-957.1.3.e S
15:08
3.10.0-957.1.3.e
t Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   S
17:48
S
t Feb 16 17:48 - 19:56  (02:07)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.30.197.149   Sun M
17:48
Sun
Mon
Wed
Sun
r 31 17:43 - 18:50  (01:06)    
root     pts/0        117.30.208.154   Sun M
-
Sun
y  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.208.112   Mon M
-
Mon
y  6 21:25 - 21:47  (00:21)    
root     pts/0        106.122.165.95   Wed M
-
Wed
y  8 20:51 - 22:30  (01:38)    
root     pts/0        106.122.165.95   Wed M
-
Wed
y  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.174.162  Thu M
-
Thu
y 23 13:48 - 20:59  (07:10)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        110.87.74.167    S
-
Mon
Mon
Tue
Thu
S
t Aug 31 13:59 - down   (02:04)    
root     pts/1        110.87.74.167    S
13:59
S
t Aug 31 14:40 - 14:54  (00:13)    
root     pts/1        110.87.72.93     S
14:40
S
t Aug 31 15:57 - down   (00:06)    
reboot   system boot  3.10.0-957.1.3.e S
15:57
3.10.0-957.1.3.e
t Aug 31 16:05 - 15:43 (182+23:38) 
root     pts/0        119.123.50.141   S
16:05
S
t Aug 31 16:50 - 18:04  (01:13)    
root     pts/1        110.87.72.93     S
16:50
S
t Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        110.87.72.93     S
17:38
S
t Aug 31 18:22 - 18:23  (00:00)    
root     pts/0        110.87.72.93     S
18:22
S
t Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     S
18:29
S
t Aug 31 18:43 - 21:08  (02:25)    
root     pts/2        110.87.72.93     S
18:43
S
t Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        121.204.57.163   S
19:34
Sun
Mon
Tue
Wed
Fri
Fri
Sun
Sun
Sun
Sun
Mon
Sun
Tue
Tue
Tue
S
t J

n 18 20:24 - 03:15  (06:50)    
root     pts/0        117.30.196.157   Mon J
-
Mon
n 20 12:05 - 10:03  (21:58)    
root     pts/1        117.30.196.157   Mon J
-
Mon
n 20 13:05 - 05:04  (15:58)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        117.30.197.3     S
-
Fri
Thu
S
t Feb 29 15:17 - 17:43  (02:25)    
root     pts/1        117.30.197.3     S
15:17
S
t Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        59.57.175.218    S
15:35
S
t Feb 29 18:22 - 23:31  (05:08)    
root     pts/0        59.57.175.218    S
18:22
S
t Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        117.30.196.102   Sun M
23:40
Sun
r  1 13:08   still logged in   
still
[root@DreamWalker ~]# echo $IFS

[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
wtmp begi
s Mo
 Nov  5 10:12:14 2018

root     pts/0        116.4.24.154     Mo
 Nov  5 10:12 - 11:46  (01:34)    
reboot   system boot  3.10.0-862.14.4. Wed Ja
 30 14:10 - 23:24 (4+09:14)   
root     pts/0        113.77.123.139   Wed Ja
 30 14:11 - 14:22  (00:10)    
root     pts/0        117.25.162.227   Wed Ja
 30 14:23 - 19:51  (05:28)    
root     pts/0        117.25.162.227   Wed Ja
 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Thu Ja
 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Thu Ja
 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        27.154.161.107   Su
 Feb  3 23:23 - dow
   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Su
 Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Su
 Feb  3 23:25 - 01:39  (02:13)    
root     pts/0        27.154.218.161   Mo
 Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.218.161   Mo
 Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - dow
   (00:36)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - dow
   (00:27)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - dow
   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - dow
   (00:26)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/0        110.87.12.156    Su
 Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Su
 Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        117.25.162.227   Mo
 Feb 11 08:50 - 23:03  (14:13)    
root     pts/1        110.87.12.156    Mo
 Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - dow
   (00:53)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - dow
   (02:38)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
root     pts/0        27.154.161.209   Su
 Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Mo
 Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.30.197.149   Su
 Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.30.208.154   Su
 May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.208.112   Mo
 May  6 21:25 - 21:47  (00:21)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        117.28.133.164   Mo
 Ju
  3 14:12 - 20:19  (06:07)    
root     pts/0        117.28.133.164   Mo
 Ju
  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.230   Tue Ju
  4 09:28 - 23:40  (14:11)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - dow
   (02:04)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - dow
   (00:06)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:44 (182+23:39) 
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.13.50     Su
 Sep  1 23:00 - 02:42  (03:41)    
root     pts/0        110.87.13.50     Mo
 Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.197.18    Su
 Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        110.87.71.225    Su
 Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Su
 Sep 15 23:44 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Su
 Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Mo
 Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.12.61     Su
 Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        121.204.57.163   Sat Ja
 18 20:24 - 03:15  (06:50)    
root     pts/0        117.30.196.157   Mo
 Ja
 20 12:05 - 10:03  (21:58)    
root     pts/1        117.30.196.157   Mo
 Ja
 20 13:05 - 05:04  (15:58)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        117.30.196.102   Su
 Mar  1 13:08   still logged i
   
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 


10:12:14

116.4.24.154
10:12
boot
-
113.77.123.139
-
117.25.162.227
-
117.25.162.227
-
117.25.162.227
-
117.25.162.227
-
117.25.162.227
27.154.161.107
23:23

boot
23:24
27.154.161.107
23:25
27.154.218.161
12:02
27.154.218.161
12:10
110.87.74.32
110.87.74.32
110.87.74.32
110.87.74.32

110.87.74.32

boot
110.87.74.32
110.87.74.32

boot
110.87.74.32
110.87.74.32
110.87.74.32
27.154.218.161
110.87.12.156

boot
110.87.12.156
27.154.218.161
110.87.12.156
Thu
27.154.218.161
110.87.73.216
110.87.73.216
120.79.243.112
110.87.75.220
110.87.75.220
27.154.218.161
110.87.12.156
00:25
27.154.218.161
12:06
117.25.162.227
08:50
110.87.12.156
22:28
117.25.162.227
117.25.162.227

boot
boot
117.25.162.227
117.25.162.227
117.25.162.227
27.154.161.209
117.25.162.227

boot
117.25.162.227
27.154.161.209
22:30
117.25.162.227
09:58
117.25.162.227
117.30.197.149
17:43
117.30.208.154
11:12
117.30.208.112
21:25
106.122.165.95
106.122.165.95
106.122.174.162
117.28.133.164

-
117.28.133.164

-
117.28.133.230
-
117.30.208.79
110.87.74.167

110.87.74.167
110.87.72.93

boot
119.123.50.141
110.87.72.93
110.87.72.93
110.87.72.93
110.87.72.93
110.87.72.93
110.87.13.50
23:00
110.87.13.50
22:47
110.87.13.50
59.57.195.29
117.30.204.139
120.41.145.233
117.30.197.18
23:25
110.87.71.225
23:40
117.30.197.18
23:44
110.87.71.225
23:45
110.87.71.225
23:09
110.87.12.61
11:11
120.41.165.224
120.41.165.224
120.41.165.224
121.204.57.163
-
117.30.196.157

-
117.30.196.157

-
110.84.205.33
121.204.56.187
117.30.197.3
117.30.197.3
59.57.175.218
59.57.175.218
117.30.196.102
13:08

[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:45 (182+23:40) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:46 (182+23:41) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# sh ip.sh 


10:12:14

116.4.24.154
10:12
boot
-
113.77.123.139
-
117.25.162.227
-
117.25.162.227
-
117.25.162.227
-
117.25.162.227
-
117.25.162.227
27.154.161.107
23:23

boot
23:24
27.154.161.107
23:25
27.154.218.161
12:02
27.154.218.161
12:10
110.87.74.32
110.87.74.32
110.87.74.32
110.87.74.32

110.87.74.32

boot
110.87.74.32
110.87.74.32

boot
110.87.74.32
110.87.74.32
110.87.74.32
27.154.218.161
110.87.12.156

boot
110.87.12.156
27.154.218.161
110.87.12.156
Thu
27.154.218.161
110.87.73.216
110.87.73.216
120.79.243.112
110.87.75.220
110.87.75.220
27.154.218.161
110.87.12.156
00:25
27.154.218.161
12:06
117.25.162.227
08:50
110.87.12.156
22:28
117.25.162.227
117.25.162.227

boot
boot
117.25.162.227
117.25.162.227
117.25.162.227
27.154.161.209
117.25.162.227

boot
117.25.162.227
27.154.161.209
22:30
117.25.162.227
09:58
117.25.162.227
117.30.197.149
17:43
117.30.208.154
11:12
117.30.208.112
21:25
106.122.165.95
106.122.165.95
106.122.174.162
117.28.133.164

-
117.28.133.164

-
117.28.133.230
-
117.30.208.79
110.87.74.167

110.87.74.167
110.87.72.93

boot
119.123.50.141
110.87.72.93
110.87.72.93
110.87.72.93
110.87.72.93
110.87.72.93
110.87.13.50
23:00
110.87.13.50
22:47
110.87.13.50
59.57.195.29
117.30.204.139
120.41.145.233
117.30.197.18
23:25
110.87.71.225
23:40
117.30.197.18
23:44
110.87.71.225
23:45
110.87.71.225
23:09
110.87.12.61
11:11
120.41.165.224
120.41.165.224
120.41.165.224
121.204.57.163
-
117.30.196.157

-
117.30.196.157

-
110.84.205.33
121.204.56.187
117.30.197.3
117.30.197.3
59.57.175.218
59.57.175.218
117.30.196.102
13:08

[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:47 (182+23:42) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# history -c
[root@DreamWalker ~]# last | tac
wtmp begins Mon Nov  5 10:12:14 2018

root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        117.25.162.227   Wed Froot     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 15:48 (182+23:43) 
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
wtmp
begins
Mon
Nov
5
10:12:14
2018
root
pts/0
116.4.24.154
Mon
Nov
5
10:12
-
11:46
(01:34)
reboot
system
boot
3.10.0-862.14.4.
Wed
Jan
30
14:10
-
23:24
(4+09:14)
root
pts/0
113.77.123.139
Wed
Jan
30
14:11
-
14:22
(00:10)
root
pts/0
117.25.162.227
Wed
Jan
30
14:23
-
19:51
(05:28)
root
pts/0
117.25.162.227
Wed
Jan
30
19:58
-
21:05
(01:07)
root
pts/0
117.25.162.227
Thu
Jan
31
08:36
-
13:56
(05:20)
root
pts/0
117.25.162.227
Thu
Jan
31
14:26
-
21:02
(06:35)
root
pts/0
117.25.162.227
Fri
Feb
1
16:59
-
17:30
(00:30)
root
pts/0
27.154.161.107
Sun
Feb
3
23:23
-
down
(00:00)
reboot
system
boot
3.10.0-957.1.3.e
Sun
Feb
3
23:24
-
15:02
(1+15:37)
root
pts/0
27.154.161.107
Sun
Feb
3
23:25
-
01:39
(02:13)
root
pts/0
27.154.218.161
Mon
Feb
4
12:02
-
12:05
(00:03)
root
pts/0
27.154.218.161
Mon
Feb
4
12:10
-
16:34
(04:24)
root
pts/0
110.87.74.32
Tue
Feb
5
12:14
-
14:26
(02:11)
root
pts/1
110.87.74.32
Tue
Feb
5
12:20
-
13:27
(01:07)
peter
pts/1
110.87.74.32
Tue
Feb
5
13:28
-
14:26
(00:58)
root
pts/1
110.87.74.32
Tue
Feb
5
14:26
-
down
(00:36)
root
pts/0
110.87.74.32
Tue
Feb
5
14:35
-
down
(00:27)
reboot
system
boot
3.10.0-957.1.3.e
Tue
Feb
5
15:03
-
15:05
(00:02)
root
pts/0
110.87.74.32
Tue
Feb
5
15:03
-
15:04
(00:01)
root
pts/0
110.87.74.32
Tue
Feb
5
15:05
-
down
(00:00)
reboot
system
boot
3.10.0-957.1.3.e
Tue
Feb
5
15:05
-
21:35
(1+06:30)
root
pts/0
110.87.74.32
Tue
Feb
5
15:06
-
17:22
(02:15)
peter
pts/1
110.87.74.32
Tue
Feb
5
15:20
-
17:32
(02:12)
root
pts/2
110.87.74.32
Tue
Feb
5
15:30
-
16:56
(01:26)
root
pts/0
27.154.218.161
Wed
Feb
6
12:03
-
19:07
(07:03)
root
pts/0
110.87.12.156
Wed
Feb
6
21:09
-
down
(00:26)
reboot
system
boot
3.10.0-957.1.3.e
Wed
Feb
6
21:36
-
20:01
(6+22:24)
root
pts/0
110.87.12.156
Wed
Feb
6
23:19
-
23:49
(00:29)
root
pts/0
27.154.218.161
Thu
Feb
7
17:39
-
19:50
(02:11)
root
pts/1
110.87.12.156
Thu
Feb
7
18:09
-
19:37
(01:27)
root
tty1
Thu
Feb
7
19:58
-
20:00
(6+00:02)
root
pts/0
27.154.218.161
Thu
Feb
7
20:21
-
03:28
(07:07)
root
pts/0
110.87.73.216
Fri
Feb
8
11:52
-
11:55
(00:03)
root
pts/0
110.87.73.216
Fri
Feb
8
11:55
-
12:57
(01:02)
root
pts/1
120.79.243.112
Fri
Feb
8
12:09
-
14:32
(02:22)
root
pts/0
110.87.75.220
Fri
Feb
8
15:20
-
20:51
(05:30)
root
pts/1
110.87.75.220
Fri
Feb
8
19:19
-
22:56
(03:36)
root
pts/0
27.154.218.161
Sat
Feb
9
15:28
-
21:29
(06:00)
root
pts/0
110.87.12.156
Sun
Feb
10
00:25
-
04:25
(03:59)
root
pts/0
27.154.218.161
Sun
Feb
10
12:06
-
19:26
(07:19)
root
pts/0
117.25.162.227
Mon
Feb
11
08:50
-
23:03
(14:13)
root
pts/1
110.87.12.156
Mon
Feb
11
22:28
-
04:39
(06:10)
root
pts/0
117.25.162.227
Tue
Feb
12
16:55
-
21:46
(04:51)
root
pts/0
117.25.162.227
Wed
Feb
13
19:07
-
down
(00:53)
reboot
system
boot
3.10.0-957.1.3.e
Wed
Feb
13
20:01
-
17:47
(2+21:46)
reboot
system
boot
3.10.0-957.1.3.e
Wed
Feb
13
20:02
-
17:47
(2+21:44)
root
pts/0
117.25.162.227
Wed
Feb
13
20:03
-
20:27
(00:24)
root
pts/0
117.25.162.227
Wed
Feb
13
20:30
-
21:58
(01:27)
root
pts/0
117.25.162.227
Thu
Feb
14
20:10
-
23:22
(03:12)
root
pts/0
27.154.161.209
Fri
Feb
15
23:40
-
23:52
(00:11)
root
pts/0
117.25.162.227
Sat
Feb
16
15:08
-
down
(02:38)
reboot
system
boot
3.10.0-957.1.3.e
Sat
Feb
16
17:48
-
16:04
(195+22:15)
root
pts/0
117.25.162.227
Sat
Feb
16
17:48
-
19:56
(02:07)
root
pts/0
27.154.161.209
Sun
Feb
17
22:30
-
00:02
(01:31)
root
pts/0
117.25.162.227
Mon
Feb
18
09:58
-
21:42
(11:43)
root
pts/0
117.25.162.227
Wed
Feb
20
16:12
-
16:12
(00:00)
root
pts/0
117.30.197.149
Sun
Mar
31
17:43
-
18:50
(01:06)
root
pts/0
117.30.208.154
Sun
May
5
11:12
-
11:22
(00:10)
root
pts/0
117.30.208.112
Mon
May
6
21:25
-
21:47
(00:21)
root
pts/0
106.122.165.95
Wed
May
8
20:51
-
22:30
(01:38)
root
pts/0
106.122.165.95
Wed
May
8
22:34
-
22:34
(00:00)
root
pts/0
106.122.174.162
Thu
May
23
13:48
-
20:59
(07:10)
root
pts/0
117.28.133.164
Mon
Jun
3
14:12
-
20:19
(06:07)
root
pts/0
117.28.133.164
Mon
Jun
3
20:20
-
21:40
(01:20)
root
pts/0
117.28.133.230
Tue
Jun
4
09:28
-
23:40
(14:11)
root
pts/0
117.30.208.79
Thu
Jul
18
15:12
-
15:15
(00:02)
root
pts/0
110.87.74.167
Sat
Aug
31
13:59
-
down
(02:04)
root
pts/1
110.87.74.167
Sat
Aug
31
14:40
-
14:54
(00:13)
root
pts/1
110.87.72.93
Sat
Aug
31
15:57
-
down
(00:06)
reboot
system
boot
3.10.0-957.1.3.e
Sat
Aug
31
16:05
-
16:05
(183+00:00)
root
pts/0
119.123.50.141
Sat
Aug
31
16:50
-
18:04
(01:13)
root
pts/1
110.87.72.93
Sat
Aug
31
17:38
-
20:31
(02:53)
root
pts/0
110.87.72.93
Sat
Aug
31
18:22
-
18:23
(00:00)
root
pts/0
110.87.72.93
Sat
Aug
31
18:29
-
18:43
(00:14)
root
pts/0
110.87.72.93
Sat
Aug
31
18:43
-
21:08
(02:25)
root
pts/2
110.87.72.93
Sat
Aug
31
19:34
-
23:07
(03:33)
root
pts/0
110.87.13.50
Sun
Sep
1
23:00
-
02:42
(03:41)
root
pts/0
110.87.13.50
Mon
Sep
2
22:47
-
22:48
(00:01)
root
pts/0
110.87.13.50
Tue
Sep
3
23:08
-
02:31
(03:23)
root
pts/0
59.57.195.29
Wed
Sep
4
23:32
-
02:11
(02:39)
root
pts/0
117.30.204.139
Fri
Sep
13
11:23
-
14:54
(03:31)
root
pts/1
120.41.145.233
Fri
Sep
13
11:30
-
11:42
(00:12)
root
pts/0
117.30.197.18
Sun
Sep
15
23:25
-
23:42
(00:16)
root
pts/1
110.87.71.225
Sun
Sep
15
23:40
-
23:42
(00:02)
root
pts/0
117.30.197.18
Sun
Sep
15
23:44
-
23:45
(00:00)
root
pts/0
110.87.71.225
Sun
Sep
15
23:45
-
23:45
(00:00)
root
pts/0
110.87.71.225
Mon
Sep
16
23:09
-
23:09
(00:00)
root
pts/0
110.87.12.61
Sun
Sep
22
11:11
-
17:34
(06:22)
root
pts/0
120.41.165.224
Tue
Oct
1
15:08
-
17:43
(02:35)
root
pts/0
120.41.165.224
Tue
Oct
1
18:13
-
20:30
(02:17)
root
pts/1
120.41.165.224
Tue
Oct
1
18:38
-
21:07
(02:29)
root
pts/0
121.204.57.163
Sat
Jan
18
20:24
-
03:15
(06:50)
root
pts/0
117.30.196.157
Mon
Jan
20
12:05
-
10:03
(21:58)
root
pts/1
117.30.196.157
Mon
Jan
20
13:05
-
05:04
(15:58)
root
pts/0
110.84.205.33
Fri
Feb
14
21:54
-
21:54
(00:00)
root
pts/0
121.204.56.187
Thu
Feb
20
11:05
-
11:08
(00:03)
root
pts/0
117.30.197.3
Sat
Feb
29
15:17
-
17:43
(02:25)
root
pts/1
117.30.197.3
Sat
Feb
29
15:35
-
15:35
(00:00)
root
pts/0
59.57.175.218
Sat
Feb
29
18:22
-
23:31
(05:08)
root
pts/0
59.57.175.218
Sat
Feb
29
23:40
-
01:04
(01:23)
root
pts/0
117.30.196.102
Sun
Mar
1
13:08
still
logged
in
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "106.122.165.95", "country": "福建省厦门市", "city": "电信"}
{"ip": "106.122.165.95", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.145.233", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 16:07 (183+00:02) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
^C
[root@DreamWalker ~]# vim ip.sh
[root@DreamWalker ~]# sh ip.sh 
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
^C
[root@DreamWalker ~]# vim ip.sh
[root@DreamWalker ~]# sh ip.sh 
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
{"ip": "120.41.145.233", "country": "福建省厦门市", "city": "电信"}
{"ip": "106.122.165.95", "country": "福建省厦门市", "city": "电信"}
{"ip": "106.122.165.95", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
[root@DreamWalker ~]# curl https://ip.cn/index.php?ip=113.77.123.139
{"ip": "113.77.123.139", "country": "广东省东莞市", "city": "电信"}
[root@DreamWalker ~]# curl https://ip.cn/index.php?ip="113.77.123.139"
{"ip": "113.77.123.139", "country": "广东省东莞市", "city": "电信"}
[root@DreamWalker ~]# vim ip.sh
[root@DreamWalker ~]# sh ip.sh 
120.41.165.224
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
120.41.165.224
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
120.41.165.224
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
^C
[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 16:20 (183+00:15) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# last | tac
wtmp begins Mon Nov  5 10:12:14 2018

root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 16:20 (183+00:15) 
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
[root@DreamWalker ~]# last | tac | gwak '{print $3}'
-bash: gwak: 未找到命令
[root@DreamWalker ~]# last | tac | gawk '{print $3}'
Mon

116.4.24.154
boot
113.77.123.139
117.25.162.227
117.25.162.227
117.25.162.227
117.25.162.227
117.25.162.227
27.154.161.107
boot
27.154.161.107
27.154.218.161
27.154.218.161
110.87.74.32
110.87.74.32
110.87.74.32
110.87.74.32
110.87.74.32
boot
110.87.74.32
110.87.74.32
boot
110.87.74.32
110.87.74.32
110.87.74.32
27.154.218.161
110.87.12.156
boot
110.87.12.156
27.154.218.161
110.87.12.156
Thu
27.154.218.161
110.87.73.216
110.87.73.216
120.79.243.112
110.87.75.220
110.87.75.220
27.154.218.161
110.87.12.156
27.154.218.161
117.25.162.227
110.87.12.156
117.25.162.227
117.25.162.227
boot
boot
117.25.162.227
117.25.162.227
117.25.162.227
27.154.161.209
117.25.162.227
boot
117.25.162.227
27.154.161.209
117.25.162.227
117.25.162.227
117.30.197.149
117.30.208.154
117.30.208.112
106.122.165.95
106.122.165.95
106.122.174.162
117.28.133.164
117.28.133.164
117.28.133.230
117.30.208.79
110.87.74.167
110.87.74.167
110.87.72.93
boot
119.123.50.141
110.87.72.93
110.87.72.93
110.87.72.93
110.87.72.93
110.87.72.93
110.87.13.50
110.87.13.50
110.87.13.50
59.57.195.29
117.30.204.139
120.41.145.233
117.30.197.18
110.87.71.225
117.30.197.18
110.87.71.225
110.87.71.225
110.87.12.61
120.41.165.224
120.41.165.224
120.41.165.224
121.204.57.163
117.30.196.157
117.30.196.157
110.84.205.33
121.204.56.187
117.30.197.3
117.30.197.3
59.57.175.218
59.57.175.218
117.30.196.102
[root@DreamWalker ~]# vim ip.sh
[root@DreamWalker ~]# sh ip.sh 
遍历到Mon
遍历到116.4.24.154
遍历到boot
遍历到113.77.123.139
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到27.154.161.107
遍历到boot
遍历到27.154.161.107
遍历到27.154.218.161
遍历到27.154.218.161
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到27.154.218.161
遍历到110.87.12.156
遍历到boot
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.12.156
遍历到Thu
遍历到27.154.218.161
遍历到110.87.73.216
遍历到110.87.73.216
遍历到120.79.243.112
遍历到110.87.75.220
遍历到110.87.75.220
遍历到27.154.218.161
遍历到110.87.12.156
遍历到27.154.218.161
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到110.87.12.156
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到boot
遍历到boot
遍历到117.25.162.227
117.25.162.227
^C
[root@DreamWalker ~]# echo $_
ip.sh
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到Mon
遍历到116.4.24.154
遍历到boot
遍历到113.77.123.139
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到27.154.161.107
遍历到boot
遍历到27.154.161.107
遍历到27.154.218.161
遍历到27.154.218.161
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到27.154.218.161
遍历到110.87.12.156
遍历到boot
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.12.156
遍历到Thu
遍历到27.154.218.161
遍历到110.87.73.216
遍历到110.87.73.216
遍历到120.79.243.112
遍历到110.87.75.220
遍历到110.87.75.220
遍历到27.154.218.161
遍历到110.87.12.156
遍历到27.154.218.161
遍历到117.25.162.227
117.25.162.227
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到Mon
遍历到116.4.24.154
遍历到boot
遍历到113.77.123.139
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到Mon
遍历到116.4.24.154
遍历到boot
遍历到113.77.123.139
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到27.154.161.107
遍历到boot
遍历到27.154.161.107
遍历到27.154.218.161
遍历到27.154.218.161
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到27.154.218.161
遍历到110.87.12.156
遍历到boot
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.12.156
遍历到Thu
遍历到27.154.218.161
遍历到110.87.73.216
遍历到110.87.73.216
遍历到120.79.243.112
遍历到110.87.75.220
遍历到110.87.75.220
遍历到27.154.218.161
遍历到110.87.12.156
遍历到27.154.218.161
遍历到117.25.162.227
遍历到110.87.12.156
遍历到117.25.162.227
遍历到117.25.162.227
遍历到boot
遍历到boot
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到27.154.161.209
遍历到117.25.162.227
遍历到boot
遍历到117.25.162.227
遍历到27.154.161.209
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.30.197.149
遍历到117.30.208.154
遍历到117.30.208.112
遍历到106.122.165.95
遍历到106.122.165.95
遍历到106.122.174.162
遍历到117.28.133.164
遍历到117.28.133.164
遍历到117.28.133.230
遍历到117.30.208.79
遍历到110.87.74.167
遍历到110.87.74.167
遍历到110.87.72.93
遍历到boot
遍历到119.123.50.141
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.13.50
遍历到110.87.13.50
遍历到110.87.13.50
遍历到59.57.195.29
遍历到117.30.204.139
遍历到120.41.145.233
遍历到117.30.197.18
遍历到110.87.71.225
遍历到117.30.197.18
遍历到110.87.71.225
遍历到110.87.71.225
遍历到110.87.12.61
遍历到120.41.165.224
遍历到120.41.165.224
遍历到120.41.165.224
遍历到121.204.57.163
遍历到117.30.196.157
遍历到117.30.196.157
遍历到110.84.205.33
遍历到121.204.56.187
遍历到117.30.197.3
遍历到117.30.197.3
遍历到59.57.175.218
遍历到59.57.175.218
遍历到117.30.196.102
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到Mon
遍历到116.4.24.154
遍历到boot
遍历到113.77.123.139
遍历到117.25.162.227
117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
117.25.162.227
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到Mon
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
遍历到116.4.24.154
{"ip": "116.4.24.154", "country": "广东省东莞市", "city": "电信"}
遍历到boot
{"ip": "111.230.229.143", "country": "广东省广州市", "city": "腾讯"}
遍历到113.77.123.139
{"ip": "113.77.123.139", "country": "广东省东莞市", "city": "电信"}
遍历到117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
{"ip": "117.25.162.227", "country": "福建省厦门市", "city": "电信"}
遍历到117.25.162.227
^C
[root@DreamWalker ~]# last
root     pts/0        117.30.196.102   Sun Mar  1 13:08   still logged in   
root     pts/0        59.57.175.218    Sat Feb 29 23:40 - 01:04  (01:23)    
root     pts/0        59.57.175.218    Sat Feb 29 18:22 - 23:31  (05:08)    
root     pts/1        117.30.197.3     Sat Feb 29 15:35 - 15:35  (00:00)    
root     pts/0        117.30.197.3     Sat Feb 29 15:17 - 17:43  (02:25)    
root     pts/0        121.204.56.187   Thu Feb 20 11:05 - 11:08  (00:03)    
root     pts/0        110.84.205.33    Fri Feb 14 21:54 - 21:54  (00:00)    
root     pts/1        117.30.196.157   Mon Jan 20 13:05 - 05:04  (15:58)    
root     pts/0        117.30.196.157   Mon Jan 20 12:05 - 10:03  (21:58)    
root     pts/0        121.204.57.163   Sat Jan 18 20:24 - 03:15  (06:50)    
root     pts/1        120.41.165.224   Tue Oct  1 18:38 - 21:07  (02:29)    
root     pts/0        120.41.165.224   Tue Oct  1 18:13 - 20:30  (02:17)    
root     pts/0        120.41.165.224   Tue Oct  1 15:08 - 17:43  (02:35)    
root     pts/0        110.87.12.61     Sun Sep 22 11:11 - 17:34  (06:22)    
root     pts/0        110.87.71.225    Mon Sep 16 23:09 - 23:09  (00:00)    
root     pts/0        110.87.71.225    Sun Sep 15 23:45 - 23:45  (00:00)    
root     pts/0        117.30.197.18    Sun Sep 15 23:44 - 23:45  (00:00)    
root     pts/1        110.87.71.225    Sun Sep 15 23:40 - 23:42  (00:02)    
root     pts/0        117.30.197.18    Sun Sep 15 23:25 - 23:42  (00:16)    
root     pts/1        120.41.145.233   Fri Sep 13 11:30 - 11:42  (00:12)    
root     pts/0        117.30.204.139   Fri Sep 13 11:23 - 14:54  (03:31)    
root     pts/0        59.57.195.29     Wed Sep  4 23:32 - 02:11  (02:39)    
root     pts/0        110.87.13.50     Tue Sep  3 23:08 - 02:31  (03:23)    
root     pts/0        110.87.13.50     Mon Sep  2 22:47 - 22:48  (00:01)    
root     pts/0        110.87.13.50     Sun Sep  1 23:00 - 02:42  (03:41)    
root     pts/2        110.87.72.93     Sat Aug 31 19:34 - 23:07  (03:33)    
root     pts/0        110.87.72.93     Sat Aug 31 18:43 - 21:08  (02:25)    
root     pts/0        110.87.72.93     Sat Aug 31 18:29 - 18:43  (00:14)    
root     pts/0        110.87.72.93     Sat Aug 31 18:22 - 18:23  (00:00)    
root     pts/1        110.87.72.93     Sat Aug 31 17:38 - 20:31  (02:53)    
root     pts/0        119.123.50.141   Sat Aug 31 16:50 - 18:04  (01:13)    
reboot   system boot  3.10.0-957.1.3.e Sat Aug 31 16:05 - 16:43 (183+00:38) 
root     pts/1        110.87.72.93     Sat Aug 31 15:57 - down   (00:06)    
root     pts/1        110.87.74.167    Sat Aug 31 14:40 - 14:54  (00:13)    
root     pts/0        110.87.74.167    Sat Aug 31 13:59 - down   (02:04)    
root     pts/0        117.30.208.79    Thu Jul 18 15:12 - 15:15  (00:02)    
root     pts/0        117.28.133.230   Tue Jun  4 09:28 - 23:40  (14:11)    
root     pts/0        117.28.133.164   Mon Jun  3 20:20 - 21:40  (01:20)    
root     pts/0        117.28.133.164   Mon Jun  3 14:12 - 20:19  (06:07)    
root     pts/0        106.122.174.162  Thu May 23 13:48 - 20:59  (07:10)    
root     pts/0        106.122.165.95   Wed May  8 22:34 - 22:34  (00:00)    
root     pts/0        106.122.165.95   Wed May  8 20:51 - 22:30  (01:38)    
root     pts/0        117.30.208.112   Mon May  6 21:25 - 21:47  (00:21)    
root     pts/0        117.30.208.154   Sun May  5 11:12 - 11:22  (00:10)    
root     pts/0        117.30.197.149   Sun Mar 31 17:43 - 18:50  (01:06)    
root     pts/0        117.25.162.227   Wed Feb 20 16:12 - 16:12  (00:00)    
root     pts/0        117.25.162.227   Mon Feb 18 09:58 - 21:42  (11:43)    
root     pts/0        27.154.161.209   Sun Feb 17 22:30 - 00:02  (01:31)    
root     pts/0        117.25.162.227   Sat Feb 16 17:48 - 19:56  (02:07)    
reboot   system boot  3.10.0-957.1.3.e Sat Feb 16 17:48 - 16:04 (195+22:15) 
root     pts/0        117.25.162.227   Sat Feb 16 15:08 - down   (02:38)    
root     pts/0        27.154.161.209   Fri Feb 15 23:40 - 23:52  (00:11)    
root     pts/0        117.25.162.227   Thu Feb 14 20:10 - 23:22  (03:12)    
root     pts/0        117.25.162.227   Wed Feb 13 20:30 - 21:58  (01:27)    
root     pts/0        117.25.162.227   Wed Feb 13 20:03 - 20:27  (00:24)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:02 - 17:47 (2+21:44)   
reboot   system boot  3.10.0-957.1.3.e Wed Feb 13 20:01 - 17:47 (2+21:46)   
root     pts/0        117.25.162.227   Wed Feb 13 19:07 - down   (00:53)    
root     pts/0        117.25.162.227   Tue Feb 12 16:55 - 21:46  (04:51)    
root     pts/1        110.87.12.156    Mon Feb 11 22:28 - 04:39  (06:10)    
root     pts/0        117.25.162.227   Mon Feb 11 08:50 - 23:03  (14:13)    
root     pts/0        27.154.218.161   Sun Feb 10 12:06 - 19:26  (07:19)    
root     pts/0        110.87.12.156    Sun Feb 10 00:25 - 04:25  (03:59)    
root     pts/0        27.154.218.161   Sat Feb  9 15:28 - 21:29  (06:00)    
root     pts/1        110.87.75.220    Fri Feb  8 19:19 - 22:56  (03:36)    
root     pts/0        110.87.75.220    Fri Feb  8 15:20 - 20:51  (05:30)    
root     pts/1        120.79.243.112   Fri Feb  8 12:09 - 14:32  (02:22)    
root     pts/0        110.87.73.216    Fri Feb  8 11:55 - 12:57  (01:02)    
root     pts/0        110.87.73.216    Fri Feb  8 11:52 - 11:55  (00:03)    
root     pts/0        27.154.218.161   Thu Feb  7 20:21 - 03:28  (07:07)    
root     tty1                          Thu Feb  7 19:58 - 20:00 (6+00:02)   
root     pts/1        110.87.12.156    Thu Feb  7 18:09 - 19:37  (01:27)    
root     pts/0        27.154.218.161   Thu Feb  7 17:39 - 19:50  (02:11)    
root     pts/0        110.87.12.156    Wed Feb  6 23:19 - 23:49  (00:29)    
reboot   system boot  3.10.0-957.1.3.e Wed Feb  6 21:36 - 20:01 (6+22:24)   
root     pts/0        110.87.12.156    Wed Feb  6 21:09 - down   (00:26)    
root     pts/0        27.154.218.161   Wed Feb  6 12:03 - 19:07  (07:03)    
root     pts/2        110.87.74.32     Tue Feb  5 15:30 - 16:56  (01:26)    
peter    pts/1        110.87.74.32     Tue Feb  5 15:20 - 17:32  (02:12)    
root     pts/0        110.87.74.32     Tue Feb  5 15:06 - 17:22  (02:15)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:05 - 21:35 (1+06:30)   
root     pts/0        110.87.74.32     Tue Feb  5 15:05 - down   (00:00)    
root     pts/0        110.87.74.32     Tue Feb  5 15:03 - 15:04  (00:01)    
reboot   system boot  3.10.0-957.1.3.e Tue Feb  5 15:03 - 15:05  (00:02)    
root     pts/0        110.87.74.32     Tue Feb  5 14:35 - down   (00:27)    
root     pts/1        110.87.74.32     Tue Feb  5 14:26 - down   (00:36)    
peter    pts/1        110.87.74.32     Tue Feb  5 13:28 - 14:26  (00:58)    
root     pts/1        110.87.74.32     Tue Feb  5 12:20 - 13:27  (01:07)    
root     pts/0        110.87.74.32     Tue Feb  5 12:14 - 14:26  (02:11)    
root     pts/0        27.154.218.161   Mon Feb  4 12:10 - 16:34  (04:24)    
root     pts/0        27.154.218.161   Mon Feb  4 12:02 - 12:05  (00:03)    
root     pts/0        27.154.161.107   Sun Feb  3 23:25 - 01:39  (02:13)    
reboot   system boot  3.10.0-957.1.3.e Sun Feb  3 23:24 - 15:02 (1+15:37)   
root     pts/0        27.154.161.107   Sun Feb  3 23:23 - down   (00:00)    
root     pts/0        117.25.162.227   Fri Feb  1 16:59 - 17:30  (00:30)    
root     pts/0        117.25.162.227   Thu Jan 31 14:26 - 21:02  (06:35)    
root     pts/0        117.25.162.227   Thu Jan 31 08:36 - 13:56  (05:20)    
root     pts/0        117.25.162.227   Wed Jan 30 19:58 - 21:05  (01:07)    
root     pts/0        117.25.162.227   Wed Jan 30 14:23 - 19:51  (05:28)    
root     pts/0        113.77.123.139   Wed Jan 30 14:11 - 14:22  (00:10)    
reboot   system boot  3.10.0-862.14.4. Wed Jan 30 14:10 - 23:24 (4+09:14)   
root     pts/0        116.4.24.154     Mon Nov  5 10:12 - 11:46  (01:34)    

wtmp begins Mon Nov  5 10:12:14 2018
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到117.30.196.102
{"ip": "117.30.196.102", "country": "福建省厦门市", "city": "电信"}
遍历到59.57.175.218
{"ip": "59.57.175.218", "country": "福建省厦门市", "city": "电信"}
遍历到59.57.175.218
{"ip": "59.57.175.218", "country": "福建省厦门市", "city": "电信"}
遍历到117.30.197.3
{"ip": "117.30.197.3", "country": "福建省厦门市", "city": "电信"}
遍历到117.30.197.3
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到117.30.196.102
遍历到59.57.175.218
遍历到59.57.175.218
遍历到117.30.197.3
遍历到117.30.197.3
遍历到121.204.56.187
遍历到110.84.205.33
遍历到117.30.196.157
遍历到117.30.196.157
遍历到121.204.57.163
遍历到120.41.165.224
ip符合条件120.41.165.224
{"ip": "120.41.165.224", "country": "福建省厦门市", "city": "电信"}
遍历到120.41.165.224
ip符合条件120.41.165.224
^C
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到117.30.196.102
遍历到59.57.175.218
遍历到59.57.175.218
遍历到117.30.197.3
遍历到117.30.197.3
遍历到121.204.56.187
遍历到110.84.205.33
遍历到117.30.196.157
遍历到117.30.196.157
遍历到121.204.57.163
遍历到120.41.165.224
ip符合条件120.41.165.224
遍历到120.41.165.224
ip符合条件120.41.165.224
遍历到120.41.165.224
ip符合条件120.41.165.224
遍历到110.87.12.61
遍历到110.87.71.225
遍历到110.87.71.225
遍历到117.30.197.18
遍历到110.87.71.225
遍历到117.30.197.18
遍历到120.41.145.233
ip符合条件120.41.145.233
遍历到117.30.204.139
遍历到59.57.195.29
遍历到110.87.13.50
遍历到110.87.13.50
遍历到110.87.13.50
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到119.123.50.141
遍历到boot
遍历到110.87.72.93
遍历到110.87.74.167
遍历到110.87.74.167
遍历到117.30.208.79
遍历到117.28.133.230
遍历到117.28.133.164
遍历到117.28.133.164
遍历到106.122.174.162
遍历到106.122.165.95
ip符合条件106.122.165.95
遍历到106.122.165.95
ip符合条件106.122.165.95
遍历到117.30.208.112
遍历到117.30.208.154
遍历到117.30.197.149
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到27.154.161.209
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到boot
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到27.154.161.209
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到boot
遍历到boot
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到110.87.12.156
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到27.154.218.161
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.75.220
遍历到110.87.75.220
遍历到120.79.243.112
遍历到110.87.73.216
遍历到110.87.73.216
遍历到27.154.218.161
遍历到Thu
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.12.156
遍历到boot
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到27.154.218.161
遍历到27.154.218.161
遍历到27.154.161.107
遍历到boot
遍历到27.154.161.107
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到117.25.162.227
ip符合条件117.25.162.227
遍历到113.77.123.139
遍历到boot
遍历到116.4.24.154
遍历到Mon
[root@DreamWalker ~]# vim ip.sh 
[root@DreamWalker ~]# sh ip.sh 
遍历到117.30.196.102
遍历到59.57.175.218
遍历到59.57.175.218
遍历到117.30.197.3
遍历到117.30.197.3
遍历到121.204.56.187
遍历到110.84.205.33
遍历到117.30.196.157
遍历到117.30.196.157
遍历到121.204.57.163
遍历到120.41.165.224
遍历到120.41.165.224
遍历到120.41.165.224
遍历到110.87.12.61
遍历到110.87.71.225
遍历到110.87.71.225
遍历到117.30.197.18
遍历到110.87.71.225
遍历到117.30.197.18
遍历到120.41.145.233
遍历到117.30.204.139
遍历到59.57.195.29
遍历到110.87.13.50
遍历到110.87.13.50
遍历到110.87.13.50
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到110.87.72.93
遍历到119.123.50.141
遍历到boot
遍历到110.87.72.93
遍历到110.87.74.167
遍历到110.87.74.167
遍历到117.30.208.79
遍历到117.28.133.230
遍历到117.28.133.164
遍历到117.28.133.164
遍历到106.122.174.162
遍历到106.122.165.95
遍历到106.122.165.95
遍历到117.30.208.112
遍历到117.30.208.154
遍历到117.30.197.149
遍历到117.25.162.227
遍历到117.25.162.227
遍历到27.154.161.209
遍历到117.25.162.227
遍历到boot
遍历到117.25.162.227
遍历到27.154.161.209
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到boot
遍历到boot
遍历到117.25.162.227
遍历到117.25.162.227
遍历到110.87.12.156
遍历到117.25.162.227
遍历到27.154.218.161
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.75.220
遍历到110.87.75.220
遍历到120.79.243.112
遍历到110.87.73.216
遍历到110.87.73.216
遍历到27.154.218.161
遍历到Thu
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.12.156
遍历到boot
遍历到110.87.12.156
遍历到27.154.218.161
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到boot
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到110.87.74.32
遍历到27.154.218.161
遍历到27.154.218.161
遍历到27.154.161.107
遍历到boot
遍历到27.154.161.107
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到117.25.162.227
遍历到113.77.123.139
遍历到boot
遍历到116.4.24.154
遍历到Mon
[root@DreamWalker ~]# vim ip.sh 

#! /bin/bash
tmp=$(last | gawk '{print $3}')
#echo $tmp
   for tip in $tmp;do
        echo "遍历到$tip"
        if [[ "$tip" =~ [0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3} ]];then
        echo "ip符合条件$tip"
#       curl https://ip.cn/index.php?ip=$tip
#       sleep 0.05
        fi
#       weekday=$(echo $cha | gawk '{print $4}')
#       month=$(echo $cha | gawk '{print $5}')
#       day=$(echo $cha | gawk '{print $6}')
        #weekday=$(echo $weekday | sed 's/mon/周一/gi; s/tue/周二/gi; s/wed/周三/gi')
        #month=$(echo $month | sed 's/jen/一月/gi; s/feb/二月/gi; s/mar/三月/gi')
#       echo $weekday
  done
   # curl https://ip.cn/index.php?ip=$ip

~       [0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}                                                                                                                                                                                                    
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
~                                                                                                                                                                                                           
-- 插入 --                                                                                                                                                                                6,8-15       全部
