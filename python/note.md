# py

## 2020/4/28

### 字符串

    非转义 r'abc\n'，"ifs".join([1,2,3]),js: [1,2,3].join("ifs")

### 重复运算 'abc'*2 [1,2]*2

### 数组

    步长截取 a[1,2,3,4][1:3:2] 第三个参数(正)表示步长读取，（负）表示逆向(每第几个取),第二个参数表示终止下标，如果第一个参数为正，则包含此下标，为负，不包含此下标

### 元组

    turple 和数组 List 比较元素无法修改

## 2020/4/30

### 集合

    set 和js的 Set 概念一样(不包含相同元素的集合)，都无法直接取下标，和数组互转：js互转 Array.from(new Set([1,2,2])),py: set[],py: list(new Set([1,2,3]))

### 编程语言类型

-   编译型和解释型
    编译过后的 exe 直接运行效率高，解释需要解释器，先翻译，再运行
-   动态和静态
    动态由上到下执行，过程中检测类型，出入栈等，
-   强类型和弱类型
    是否可以隐式转换（作为一方面），精准定义是不可能出现缓冲区溢出，jump 错误内存地址的语言（这些隐式转换都可能导致出现）都是强类型，c 语言也是弱类型，int 可以变成 double。
-   举例
    无类型： 汇编
    　　弱类型、静态类型 ： C/C++
    　　弱类型、动态类型检查： Perl/PHP
    　　强类型、静态类型检查 ：Java/C#
    　　强类型、动态类型检查 ：Python， Scheme
    　　静态显式类型 ：Java/C
    　　静态隐式类型 ：Ocaml， Haskell

### 和 js 区别

    js弱类型允许隐式类型转化（php），比如 1+'2' => '12',而 py：str(1)+'2' => '12' 属于强类型特征（java）。强类型的效率更高，因为不存在隐式转换，所有内存预分配，也不需要做隐式操作

### 转换函数

    chr(num)整数转字符，相当于js的String.fromCharCode(num)
    ord(str)字符转整数，相当于js的str.charCodeAt(index)

### 函数

    注释 # ‘’‘ “”“ ,print f.__doc__可打印函数内部的 注释块（不包括单行注释）
    函数在命令行模式下也需要缩进

## 2020/05/07

### 表达式

```python
    # 先右边计算完成，再赋值左边
    a,b=1,1
    a,b=a+b,b+10
    print a,b
    # 2 11
```

### 数组(补充)

    def test(*args);类似js的 const test = (...args); 但是前者 args为元组，后者为数组

### 循环

    for else和while else的组合，相当于提供一个循环终止的钩子;这方面js就需要自己判断比如 index ===  arr[arr.length - 1]
    pass:空语句，类似js的；表明结构,同时防止语法报错

### 解释器,帮助

    #!/usr/bin/env python 这种去找安装路径
    help(max) 了解函数参数类型及返回值 或 print max.__doc__

### 字典

    类似js中 存取器中的 enumerable，键值对中的键可遍历，（enumerable就是为for循环而存在）

```python
    # js中数组其实也是对象，以 {0:arr0,1:arr1,length:2}的键值对来存储,因此 for in 得到 0,1,2...
    # python中数组不是字典（js中的对象），因此 for in 得到 ['a','b','c'] => a,b,c
    # 使用字典.items()得到可遍历的键值对,或 字典.values()，类似js的 Object.values(obj)
    for x in ['x','y']: print x # x,y
    for x,y in {"x":1,"y":2}.items(): print x,y # 2,y 1,x，注意从后往前遍历
    dict([("a",1),("b",2)]) # 二维数元，二维元元，二维元数,二维数数 都可以生成字典
```

    字典可以通过.clear()直接清空引用
    字典推导式，类似于typescript中的 映射类型，但是这里不再是泛型推导生成泛型，而是可以直接生成字典

```python
    print {x:str(x) for x in (1,2,3)} # {1: '1', 2: '2', 3: '3'}
    print {i:j for i,j in {"x":1,"y":2}.items()} # {'y': 2, 'x': 1}
```

## 比较

    == 注意比js中浅比较的概念更广泛,更类似于js中的 JSON.stringify(var1) === JSON.stringify(var2)
    is 比较符和js中 === 作用基本一致，判断内存地址，可用id函数获取实际内存地址

```python
    a,b = 1,1
    print a == b # True
    print a is b # True python同一个栈类型用同一个值，js应该也是一样，节约内存
    id(a) == id(b) # True
    id(a) is id(b) # False 地址一样但是没有在栈内
    print {i:j for i,j in {"x":1,"y":2}.items()} # {'y': 2, 'x': 1}
```

    神奇的 is

```python
    # 脚本模式和交互模式内存地址的异常
    # 交互模式下：
    a = 256
    b = 256
    a is b # True   257情况下为 False,说明 > 1 字节，会分配新的地址,实际上 【-5，256】都不会新分配内存
    # 同样是交互模式下
    a,b = 257,257
    a is b # True , 说明交互模式下，这种一行表达式预知相同值，分配同一地址
    # 脚本模式下,以上所有情况均返回 True，python 是门伪动态语言吗？
    # 计算和非计算两种模式下
    a = 'a'*10
    b = 'a'*10
    print(a is b) # True
    a = 'a'*30
    b = 'a'*30
    print(a is b) # False
    a = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    b = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    print(a is b) # True
    # 编不下去了。。
```

## 2020/05/10

### 字符串（补充）

    '''和"""既可以当注释块符号，也可以当转义字符串用，例如js中的 `[]&[,]]/`
    类比js中的模版字符串 `${epr}`,python为 f'{epr}'
    采用utf16,两字节存字符，chr(2**16) 共 65536 个字符

### 列表（补充）

    python特色：推导式，字典和列表等都可以推导,可带判断(多个)
    已学：可用for循环生成 for 左边的值
    复制列表

```python
    # 推导式
    print [ i for i in range(5) if i < 4 if i > 1] # [0,1,2,3]
    # 复制列表
    a = [1,2]
    b = a[:] # 带冒号类似于 js 中的 arr.slice(from,end)
    # 创建空列表
    c = [None]*10
```

### 元组（补充）

    ()即可是运算符也可以是元组，因此用 a = (1,) 来表示包含1的元组而不是 a = (1)

### 字典（补充）

    字典的键只要是不可变类型都可以，函数，元组，js的Map的键则无任何要求
    a = {(1,2):1},a = {function:1}
    .copy()包含了浅复制
    obj.items()包含可遍历的(key,val),类似js的 Object.entries(obj),都是 (val,key) 的形式
    obj.values()类似js的 Object.values(obj)
    obj.keys() 类似js的 Object.keys(obj)
    !!! 注意以上三个返回的

```python
    # 反转字典
    a = {"x":1}
    b = {i:j for j,i in a.items()} # {1:"x"}
```

## 2020/05/11

### 规范（补充）

    使用 \ 符号来接续代码，一般保持和上一行一样的缩进来使结构清晰
    elif和linux内的elif一样
    可以使用 if <condition> : do sth,写到同一行来简化行数，类比js中的 if(condi)do sth;

```python
    # 接续
    def test(x,y):
        if x < 1 and \
        y > 1 and \
        y is not 2:
            print x+y
        else:
            print "no"
    def test():
        if input("input") > 1: print "yes"
        else: print "no"
```

### 迭代器

    iter可以用来生成可迭代对象，这个和js里的迭代器概念几乎一样
    使用 next 来遍历迭代器
    这意味着同样的for循环可以用while来实现
    js中的迭代器：
    本质上，遍历器是一种线性处理，对于任何非线性的数据结构，部署遍历器接口，就等于部署一种线性转换。不过，严格地说，对象部署遍历器接口并不是很必要，因为这时对象实际上被当作 Map 结构使用，ES5 没有 Map 结构，而 ES6 原生提供了。
    js需要实现一个 next 方法，返回 {value,done} 对象，done的值来确定是否结束

    python 则需要实现 __iter__ 和 __next__ 方法，
    意思就是 后面 next(obj) 可以调你调 __next__ 方法， iter 可以调你的 __iter__  方法，简单粗暴

```python
    # 接续
    for x in [1,2,3]:print x # 123
    y = iter([1,2,3])
    while True:
        try:
            print next(y)
        except StopIteration:
            sys.exit()
```

## 2020/05/12

### 迭代器（补充）

    迭代器2.7版本和3的区别, next 变为了 __next__

```python
    class M:
    def __iter__(self):
        self.x = 1
        return self
    def next(self): # 2.7用
        self.x += 1
        return self.x
    n = M()
    y = iter(n)
    print next(y)
    print next(y)
```

### 函数（补充）

    参数可当对象用，可赋默认值
    也可以用*args，收集参数，类似js的 ...args，但是这里收集为元组
    特性：可以收集为字典，使用 **args
    使用*占位，后面的参数必须具名传入,即必须是关键字参数（怎么方便怎么来，感觉有点鸡肋的设计）
    def f(a, b, /, c, d, *, e, f): 表示 a,b 必须不能用关键字，cd可用可不用，ef必须用

```python
    def test(a,b,**args):
        print args # {c:3,d:4}
        print a+b
    test(b = 1,a = 0,c=3,d = 4)
```

    匿名函数，lambda
    类似于js中的箭头函数，f = lambda a,b:a+b    const f = (a,b) => a+b (每次都要写lambda，差的设计)

## 2020/05/13

### 函数（补充）

    作用域,完全符合javascript的遍历搜寻方式
    不同之处，重要的一点，是无法直接更改全局作用域内变量的值，这个在js中如果全局用 const 声明符合相关情况，\
    但是也可以通过声明为 let,在函数内改变全局作用域，这方面 js 是比 python 灵活的,
    python 要改变全局变量，需要实现在局部函数中声明
    可以发现 python 之所以实现不了，只是因为所有变量前面都没有关键字声明，因为比如字典，python 是可以通过局部函数更改全局变量的

```python
    a = {"x":1}
    def test():
        a["x"] = 2
    test()
    print a # {"x":2}

    x = 1
    def test():
        global x
        x = 2
    test()
    print x # 2
```

    函数式编程，js 和 python 都支持，编程福音
    原生支持装饰器，这个在 js 中需要 es6 语法实现

```python
    a = {"x":1}
    def test():
        a["x"] = 2
    test()
    print a # {"x":2}

    x = 1
    def test():
        global x
        x = 2
    test()
    print x # 2
```

## 2020/05/14

### 函数（补充）

    函数可以显示的定函数的参数类型和返回值，能够让智能补全组件提前获知标识符的数据类型
    这种类似于 ts，也可以是函数式编程中的一种函数推导

```python
def function_demo(param_A: int, param_B: float, param_C: list, param_D: tuple) -> dict:
    pass
```

    装饰器的实现，类比js中也可以用 @xxx 来实现

```python
def log(f):#将被装饰函数传入
    def wrapper():
        return f()
    return wrapper
@log
def pr():
    print("test")
pr()
```

    nonlocal 声明的变量(3.0)，介于 global 变量和默认的本级作用域之间，跟 / * 在参数中作为中间分隔一样
    感觉这种设计哲学婆妈而有趣，准确地说是鸡肋，看后面用不用得到

```python
x = 0
def outer():
    global x
    x = 1
    def inner():
        nonlocal x
        x = 2
        print(x)
    inner()

outer()
print(x)
```

## 2020/05/15

### 函数闭包（补充）

    其概念和js中的闭包基本一样，还是要注意多出来的 nonlocal，注意这个是 python3 新增的关键词
    实现一个类似 js 中重载闭包的功能
    获取入参个数 f.__code__.co_argcount ，js 中直接写 f.length
    或者 func_code.co_argcount 2.x 版本，上面是3版本

    下面实现一个闭包重载的功能

```python
    def flen(f):
        return f.__code__.co_argcount
    def test(obj,f):
        obj[flen(f)] = lambda *args:f(*args)
        return lambda *args:obj[len(args)](*args)
    def f1(x):
        print 'one param'
    def f2(x,y):
        print 'two param'
    z = {}
    test(z,f1)
    k = test(z,f2)
    k('test')
    k('test','test')
```

## 2020/05/16

### 列表（补充）

    即数组，需要知道的常用api
    插入：a.insert(index,val) // 类比 js a.splice(index,0,val)
    a.extend(arr) // 类比 js a.concat(arr)
    a.append(ele) => a.push(ele)
    a.remove(ele) 优于js，js 需要 a.splice(a.indexOf(ele),1) 来实现，且两者都要判断ele是否存在先
    a.index(ele) => a.indexOf(ele) , a.pop() => a.pop() , a.pop(i) => a.pop(i) // 弹出下标元素
    a.reverse() => a.reverse()

    矩阵变换(for推导式的应用):
    ！！！ 注意推导式在元组内会生成遍历器对象,猜测是因为 元组 每个元素都没法赋值，而 for in 推导的实现需要用到赋值
    ！！！ 因此

```python
    b = [
        [1,2,3],
        [11,22,33],
        [111,222,333],
    ]
    a = [[row[i] for row in b] for i in range(3)]
    print a
    c = (1,2,3)
    d = (i for i in c)
    print type(d) # <type 'generator'>
```

    zip的使用，可以组合多个遍历类型

```python
    a = (1,2,3)
    b = {'x','y','z'}
    c = {x:y for x,y in zip(a,b)} # {1: 'y', 2: 'x', 3: 'z'},注意这里集合是无序的，因此xyz可以任意顺序被遍历
```

## 2020/05/17

### 模块(文件)

    python 里 文件即模块，语法和 js 的es模块语法几乎一样,from moudule import method => import method from module
    文件内定义的所有方法自动挂载到模块上,模块自带 __name__ 属性，值为 '__main__'表示当前模块允许时是作为主模块，如果其他表示是被引入,一般显示模块的名字
    可以放到 __main__ 的判断内使仅被引入时执行
    通过 sys.path 可以看到模块的默认查找路径，一般当前路径优先级最高，类比 js 会自动往上层级寻找 node_modules 内的包，
    ！！！因此如果需要引入默认检索目录，在要引入模块的文件内写：sys.path.append("dirpath") 这样dirpath作为默认路径
    引入其他模块的模块中，通过 dir(module) 可以看到其他模块内所有定义的属性和方法

### 包(文件夹)

    包的概念，需要文件夹下面有 __init__.py 这个文件，类似 js 中的需要有 index.js 这个概念
    引入包的概念下可以使用 import A.B.C 注意最后结尾的一定是模块，不能是函数或属性
    from 包 import * 会引入包下所有模块，但是并不保险，因为 windows 大小写命名文件的关系
    因此最好的办法是在 __init__.py 里定一个变量 __all__ = ["file1","file2"]
    这样可以只导入  __all__ 里面定义的模块

```python
    # test.py
    if __name__ is '__main__':
        testpm = 'test'
    # main.py
    import test
    print dir(test) # 不包含 testpm， if __name__ is not "__main__" 则包含 mm
```

### 输入输出

    repr(dict || turple ..) 类似于 js 中的 JSON.stringify
    format 字符串的format方法，用来格式化输出，{0:2d} 表示长度为2
    {}内带数字表示位置，带字母表示形参
    {!a}表使用 ascii 码，{!s} 使用 str 转换， {!r} 使用 repr 转换

```python
    print repr((1,2))+'3'
    print '{0} is head,{a} is a,{b} is b'.format("head",b="first",a="seconde") # head is head,seconde is a,first is b
    print '{0} {0}'.format('a','b')
```

## 2020/05/18

### 文件系统

    使用open函数用于打开文件，类似  node 的 fs.open ,个人觉得是写入缓存的意思，可以同时判断是否有权限
    会生成 file 对象，此时可以用于读写等
    和 node 的功能类比： os.path.join => fs.path.join, os.listdir(path) => fs.readdir[Sync](path)
    os.path.isdir(path) => fs.dirent.isDirectory() ,node 不常用的比如 fs.fstat(fd) 来用 fs.Stats.isDirectory()
    区别：python 的 path 包可以判断是否文件夹或文件，node 是 fs 包，path 只用于判断路径格式，相比下 node 更合理

    简易读写

```python
    f = open('./1.txt','w')
    num = f.write('lin1\n\line2\n') # 返回写入字符个数
    f.close()
    f = open('./1.txt','r')
    # pring f.read() # 读取整个文本
    print f.readline() # line1 \n
    print f.tell() # 5  已读个数
    # f.seek(span,pos)  seek 用来定位 ，pos 为0表从头开始，1表从当前位置开始，2表结尾往前移
    print f.readline() # line2 \n
    f.close()
```

    练习读取文件夹下所有目录是 py 的文件

```python
    import os
    from os import *
    arr = []
    def findPy(p):
        if path.isdir(p) is False:
            return
        dlist = os.listdir(p)
        for dirent in dlist:
            tmp = path.join(p,dirent)
            if path.isdir(tmp) is True:
                findPy(tmp)
                return
            elif path.isfile(tmp) is True:
                if path.splitext(tmp)[1]=='.py': #  坑，这里不能用 is ？
                    print 'here'
                    arr.append(path.realpath(tmp))
            else:
                return
    findPy('./')
    print arr
```

## 2020/05/19

### 文件系统（补充）

    使用 with 关键字 可以不用手动去关闭文件描述符号
    使用  try exception else 捕捉错误，类比js的 try catch
    两者都有 finally 等

```python
    with open('1.txt','r',encoding = 'utf-8') as f:
        f.write('测试测试') # 有问题

    f = None
    try:
        f = open('./no.txt','r')
    except:
        print 'wrong' # 捕捉错误
    else:
        print 'ok'
```

### 字符串（补充）

    str.rfind() 类比 js 的str.indexOf()

```python
    'abc.jpg'.rfind('.') # 3
```

## 2020/05/20

### 字符串（补充）

    str.replace('x','y') 类比 js 的 replace 方法，但是具有第三个参数，表示替换个数，不像 js 可以直接用正则 /g，全部替换
    python 的正则替换,先引入 re 模块
    re.compile(str) 类比 js 的 new RegExp(str)

```python
    import re
    c1 = 'hello world'
    # 第一种写法
    d1 = re.compile('world').sub('python', c1)
    print 'origin:{}'.format(c1)
    print 'now:{}'.format(d1)
    # 第二种写法 re.sub(pattern, repl, string, count=0, flags=0) flag 为 re.I | re.M ,i和js 含义一样不区分大小写，M表多行,multiline ,.S 使.匹配所有字符
    print re.sub('world','python',c1,0) # hello python,hello python
    # 上面相当于 re.compile('world').sub('python',c1,0)
```

    上面 的sub是替换，.match 则是匹配，因为不需要替换，所以是 res.sub(pattern,string,count =0,flags=0) 的形式，很好理解
    match 匹配成功返回一个对象，失败返回 None

## 2020/05/21

### 正则（补充）

    是否贪婪匹配和 js 中的规则一样, 正则写法一样
    re.search 类似于 js 中的 str.match 方法
    通用的不同之处是 python 的正则 flag 作为第三个参数，js 的直接写在正则后 str.match(/exmp/gi)

    re.match(reg,str) 类似于 js 中的 reg.test(str) 方法，判断整个字符串是否符合正则表达式
    注意到 python 使用正则就需要引入 re 这个模块

    re.compile(str,re.I) 类似 js 中的 new RegExp(str,'i') 使用字符串生成正则对象
    re.split(reg,str) 类似 js 中的 str.split(reg)

    复习替换： re.sub(reg,strToReplace,str,count,flat) # 这里多出来count，用作替换多少此，0为全替换,而 js 中用 g 来表示全局

```python
    import re
    str = '__c__ctest'
    obj1 = re.search(r'(.*)c(.*)',str)
    print obj.group(1) #__c__
    obj2 = re.search(r'(.*?)c(.*)',str)
    print obj.group(1) #__
```

    和 js 中的正则一样，用 \数字 来匹配已匹配到的括号内的相同匹配

```python
    str = 'x0x111y0y'
    print re.sub(r'(\w)0\1','1',str,0) # 1111
```

## 2020/05/22

### try（异常捕获，补充）

    try,exception,类似 js 的 try catch,
    python 还有 else 和 finally ，设计出来纯属蛋疼

    有 raise 语句，类比 js 的 throw
    raise Exception(xxx), 类比 js 的 throw Error(xxx),都会中断程序执行
    raise 和 trow 都可以抛出一个类的实例，鸡肋
    python 的 raise 可以单独使用，用来打断执行，鸡肋，没有错误提示光打断？

```python
    try:
        print x
    except:
        print 'catch error'
    else: # 鸡肋，这里其实没必要用else，把 else 的 部分放到try里面是一个效果
        print 'all fine'
    finally: # 鸡肋，只要try语句外的语句都会执行，这里没有必要用finally
        print 'whatever'
```

### 类

    注意python中对象和字典是两个完全不一样的东西，后续可能要深化（内存如何存储方面的问题），才能理解，应该是 字典 的存储方式 跟 对象 是完全不同的
    而在 js 中，面向对象，哪怕 1 + '2' 也是 变成  Number(1) + String("2") 这种方式来运算的
    因此 字典 必须用 a["x"]，而 python 中对象用 a.x  ,在js 中两种引用方式没有区别

    python 中 类 和 js 的类定义方式和使用方式暂未发现明显区别：
    主要区别是 指向实例 的引用在 python 中 需要传入，而在 js 中 this 不需要，（是否是为了防止引用查询过慢？，而在js中 this 是很灵活的,python 中的 this 一直是第一个参数
    __init__ 类比 contructor

```python
    class M:
    i = 1
    def __init__(this,i): #
        this.i = i
    def test(this):
        print this.i
    print M(8).i # 8
    M(9).test() # 9
```

```javascript
class M {
    i = 1;
    constructor(i) {
        this.i = i;
    }
    test() {
        console.log(this.i);
    }
}
console.log(new M(8).i); // 8
new M(9).test(); // 9
```

## 2020/05/23

### 类（补充）

    python 中所有双下划线开头的属性（方法）作为私有属性（方法）,js 中使用闭包实现 私有属性
    关键字 static private protected 用得不多，凡是继承的都可以用组合实现，可能写游戏类的用得多

    js 的运算比如 {} + 1 会调用 {}.valueOf，沿着原型链一直调用，没有此方法调用 toString
    pythont 中也有类似的私有方法，可以赋予生成的对象任何运算或使用的能力，也可以像 js 一样重写点运算符等(使用 __getitem__ )

```python
 class M:
    i = 1
    def __len__(self):
        return 3
    def __call__(self):
        print 'haha'
        return 'result'
    def __add__(self,i):
        return 100
    def __getitem__(self,prop):
        return prop
    def __init__(this,i):
        this.i = i
    def __iter__(this):
        return this
    def next(this):
        return 2
    print M(1) + 1
    print M(1)['abc'] # 'abc'
    print M(1)()
    tmp = iter(M(1))
    print next(tmp)
    print next(tmp)
```

    js 中 es6 提供了 11 个内置 Symbol 实现上述类似的功能，任何方法都可被重写

```javascript
class M {
    [Symbol.hasInstance](sth) {
        return true;
    }
    [Symbol.match](sth) {
        return true;
    }
    [Symbol.replace](sth) {
        return true;
    }
    /** */
}
console.log({} instanceof new M()); // true
```

## 2020/05/24

### 类（再补充）

    类的静态方法，显然不需要传入 this（self），但是在 js 中实例是无法调用类的静态方法的，但是 python 中实例可以调用
    可能因为 js 走的是原型，而 python 实现继承根本没有原型链的概念
    python 中还有一个叫类方法的东西，就是需要传入 类 的方法（和静态方法的区别）鸡肋。。
    ps: __init__ 方法要求无返回值，这个可能是因为定义了 __call__ 方法了，在 python 中对象是可以像函数一样执行的，一脸懵逼，可能只是改写 obj() 这种，防止报错？毕竟的话在 js 中函数也是对象，虽然对象不是函数。可以理解成 python 里对象和函数已经没有区别了，更强了
    无返回值的原因是 构造函数 就是构造函数，js 中可以理解成如果有this，默认返回 this，没 this 就当普通函数用

```python
    class A:
    @staticmethod
    def test():
        print 'static'
    @classmethod
    def tt(self):
        return self
    A.test()
    A().test()
    A().tt() is A # True
```

    我总结的一些很有意思的共性：
    js 中的打印转换 : console.log({}) 等价于 console.log(JSON.stringify({}))
    python 中的打印转换：console.log(A()) 等价于 console.log(A().__repr__()) 因此 __repr__ 相当于 JSON.stringify
    当然这里能想到 如果不是对象而是字符串，就没必要用 __repr__ 或 JSON.stringify 了吧，那怎么认为这个对象是一个字符串呢，如果定义了 __str__ 方法，那不就是字符串吗？自然不需要去调 __repr__
    这里 python 还有更优秀的一点是，所有内置 obj.__method__ 方法，都有对应的 method(obj) 的调用方式，这是函数式编程的必要条件之一

```python
    class A:
    def __repr__(self):
        return 'test'
    print repr(A())
    print A()
```

    补充作为 加数和 被加数，减数 和 被减数 这种概念：
    python 中也有严格定义,即 __method__ 和 __rmethod__ 的关系,猜想 作者设计 r 作为前缀，就是说当 这个对象 在 right 右边的时候执行的方法。。
    这时候可以展望下，如果真写函数式编程，简直行云流水，毕竟都不需要调整位置，之所以设计这么多看似多余的方法也有了意义

```python
    class A:
    def __repr__(self):
        return 'test'
    def __add__(self,i):
        return 1 + i
    def __radd__(self,i):
        return 2+i

class B:
    def __add__(self,i):
        return 1 + i
    def __radd__(self,i):
        return 2+i
    print A() + B() # 3
```

### 作用域

    和 js 的查找规则等基本一样
    查找 nonlocal 报错, python3 才引入，需要python3调用

```python
    t0 = 'global'
    def t():
        t1 = 'nonlocal'
        def tt():
            nonlocal t1
            t2 = 'local'
            t1 = 'changeNnlocal'
        return tt
    t()()
    print(t1)
```

## 2020/05/25

### sqlite3

    sqlite 为一般 linux 自带的都有
    sqlite3 test.db # 创建db
    attach database 'test.db' as test; # 附加db
    注意点：
        自增，mysql 为 auto_increment，sqlite 为 autoincrement(且放在 primary key 后面)
    sqlite3 test.db  为创建和读取共用命令，一般用模块读取
    读取database，由于sqlite一文件一数据库，因此可以>sqlite: attach database 'test.db' as test(并无大用)
    >sqlite: .header on   用来 格式化输出
    可以使用 sqlite3 test.db .dump > abc.sql 来导出sql语句（简直好用，意味着可以无缝对接其他任何关系型数据库）
    group 不能作为属性名

```sql
    CREATE TABLE test(pid integer primary key autoincrement,pname varchar(20));
    INSERT INTO test VALUES(1,'peter');
```

## 2020/05/26

### sqlite3（补充）

    在使用 webpack 打包 sqlite3 模块时遇到的问题：
    webpack 打包成 umd 模块时，因为除了兼容 commonjs 和 amd ，还可以兼容挂载在对象或 window 上的情况。

    如果存在 __dirname ,兼容三种情形的情况下，webpack 默认会采用 '/' 的值，由于不管是 ems 还是 cjs ，最后都会解析成 __webpack_require__ ,和 __webpack_exports__ 的情况，其实现原理也比较简单干脆，比如开发模式下，直接用 eval 将所有文件内容集合到一起放到全局环境执行，同时做了模块化对应的缓存，当然生产环境是不可能用eval的，毕竟还可以用 Function

    令人费解的是，webpack 打包 cjs 模块的做法是直接使用 require 后面括号里面的字符串，变量引用都会导致无法正确解析，如果有 __dirname 默认当作 '/' 使用，即便在 webpack.config.js 内设置 node:{ __dirname: true | false },其最终也无法引用正确的字符串 + eval

    比如下面的文件是可以正确引用的：

                    const module = require('./1.js')；

                    生成： { './1.js': function(){ eval(xxx) } }

    而下面的文件则不会被引入对应的 webpackModule：

                    const url = './1.js';

                    const module = require( url )；

                    生成 webpackModule 里面不存在 { './1.js': function(){ eval(xxx) } }

    这个时候，突然感觉 webpack 确实很需要魔法字符串，比如 / * webpackPrefetch true * / 等，不是因为酷，而是这样确实很方便，大大减少了解析难度。

    如果用 ems 模块的话就不会存在这个问题，已经从语法层面避免了上面的问题。

    几经测试，webpack 其实是可以解析 require 括号内动态内容的，但是最后就是无法生成在最终的 webpackModule 里面。

    最后将 sqlite3 放到 webpack 的 externals 内解决了打包问题

## 2020/05/27

## 使用 pip 安装模块

    国内源安装,(豆瓣源)
        pip install -i https://pypi.douban.com/simple/  package
        easy_install -i  https://pypi.douban.com/simple/  package
    使用 pip3 安装 python3-xlib
        sudo -H pip3 install -i https://pypi.douban.com/simple/ python3-xlib
    安装 pyautogui
        sudo -H pip3 install -i https://pypi.douban.com/simple/ pyautogui

```python
    import pyautogui as gui
    gui.PAUSE = 1
    gui.FAILSAFE = True
    w,h = gui.size()
    gui.moveTo(500,500,duration=1) # 自动
    print(w,h)  # 1440 900
```

## 2020/05/28

## pyautogui

### time.sleep

    time.sleep(t) // t为秒数，可直接推迟线程运行，后台语言的亮点来了
    js里面竟然没有直接实现类似功能的方法，天生异步吗？如果不能用最新的 async await 的话
    只能通过 while 循环实现类似的功能，毕竟也可以用 while 实现 async await

```javascript
const t = Date.now();
const dr = 2000;
while (Date.now() < t + dr) {}
console.log("test");
```

    js 不实现 sleep 是有理由的，我勒个去，你让浏览器空白2秒？都发明了异步来最大化压榨线程了，这两秒浏览器能干多少事？
    弄出个 sleep 的话，简直有违异步之道，但是，异步之道牛逼支不住回调套娃
    就为了异步之间的顺序执行弄成里三层，外三层，你受得了？回调地狱了解一下？
    于是 async await 来了，我勒个擦，这不还是 sleep 吗？利用 sleep 的时间等待回调返回？
    一开始发明个可等待回调的 sleep 不就行了，到 es6 才实现这个东西，还不是浏览器统一实现的标准，js 果然一夜写出来的语言

### autogui_1

```python
    gui.click(600,600,button="right") # 模拟鼠标右键点击
    gui.write('hello wo`rld',interval=0.24)
    gui.press('esc')
    gui.keyDown('shi`f') # 按住 shift
    gui.press(['a','a','a']) # 键盘按住 a 键四次，相当于写 aaa
```

## 2020/05/29

## pyautogui(补充)

```python
    gui.keyUp("shift") # 松开shift
    gui.hotkey("ctrl","c") # 键位组合
```

    gui只能运行在 windows,macOS,linux

## PIL

    属于python2的专属模块，在python3 叫 pillow
    引入还是按 import PIL 使用

```python
    from PIL import Image as img
    im = img.open('./ancient.jpg')
    w,h = im.size
    im.thumbnail((w//2,h//2)) # 边界变为一般缩放
    im.save("./test.jpg","jpeg")
```

```bash
    ls -l ancient.jpg | awk '{print $5/1024,"kb"}' # 41.3066kb
    ls -l test.jpg | awk '{print $5/1024,"kb"}' # 9.1416kb
    #  413 X 100 开根号，60几，缩一般变 30几，相乘刚好
```

## 2020/05/30

## pillow(PIL 补充)

    python 生成验证码图片
    前置：

```python
    from PIL import Image,ImageDraw,ImageFont,ImageFilter
    img = Image.new("RGB",(240,60),(255,255,255)) # 生成图像（画布），初始化像素值
    draw = ImageDraw.Draw(img) # 类似浏览器里面的getContext('2d'),要在这块像素板上画东西
    font = ImageFont.truetype('Arial.ttf',36) # 字体对象
    draw.text((x坐标，y坐标),字母,字体,填充颜色) # 写字
    draow.point((x,y),color) # 填充像素点
    img.filter(ImageFilter.BLUR ) # 模糊，滤镜
```

    代码:

```python
    from PIL import Image,ImageDraw,ImageFont,ImageFilter
    import random
    def genColor():
        return (random.randint(65,255),random.randint(65,255),random.randint(65,255))
    img = Image.new("RGB",(180,60),(255,255,255))
    draw = ImageDraw.Draw(img)
    w,h = 180,60
    font = ImageFont.truetype('Arial.ttf',36)
    for x in range(w):
        for y in range(h):
            draw.point((x,y),(random.randint(65,255),)*3)
    for s in range(3):
        draw.text((60*s+10,10),chr(random.randint(65,90)),font=font,fill=genColor())
    img = img.filter(ImageFilter.BLUR)
    img.save('./test.jpg','jpeg')

```

## 2020/05/31

## request 模块

    类似node的http模块等

```python
    import requests as req
    r = req.get("http://www.baidu.com")
    print(r.encoding) # 默认编码，一般不是 utf-8
    print(r.headers) # 获取相应头
    print(r.content) # 二进制，不认识等用 16进制表示
    print(r.headers) # 相应头
```

## 2020/06/01

## chardet

    用于编码检测，这个厉害了

```python
    import chardet as dt
    print(dt.detect(b'test')) # {encoding:'ascii'}
    a = '汉字'
    print(dt.detect(a.encode('utf-8'))) # 都一样，都是bytes 或者  byteArray 才能用于检测
```

## 2020/06/02

## PIL (pillow) Image

    拼接图片的功能

```python
def concatImg(imgdir):
    imgs = os.listdir(imgdir)
    imgNum = len(imgs)
    board = Image.new("RGB",(600,600),(255,255,255))
    for i in range(imgNum):
        with Image.open(imgdir + imgFlodName + "/" + imgs[i]) as img:
            board.paste(img,(i*66,0))
    board.save("./test.png")
    board.show()

concatImg("./pics")
```

## 2020/06/03

## psutil

    个人感想：虽然win10有了powershell，很多命令向linux看齐，微软开始不再任性，拥抱开源
    但是毕竟各种命令的差异不可能同时消失，好在 python 是跨平台，且属于系统语言，拿来到 windows 代替各种windows命令还是可以的

```python
    import psutil as ps
    psutil.pids() # 获取所有进程id
    p = ps.Process(0)
    print(type(p)) # <class 'psutil.Process'>
    p.name() # 进程名称
    p.cwd() # 进程目录
    p.pid() #
    p.ppid() # 父进程id
    p.children() # 子进程
    p.status() # 状态 running 等
    p.username() # 进程名字
    p.create_time() # 创建时间
    p.terminal() # 进程终端
    p.connections() #网络连接
    p.terminate() # 结束进程 ，比较通用等方法

    ps.test() # 出现 ps 的列表
```

## 2020/06/04

### 基础知识回顾

    python遍历字典，for key,val in dict.items():print(key,val)
    遍历类实例：
        通过 vars 内置函数将类实例变为 字典，这个太实用了，毕竟 js 里类的实例就是对象，很好操作
        这里猜测 vars 会转变存储结构

```python
    class M:
        def __init__(this,i):
            this.i = i
    for x in vars(M):
        print(x)
```

    遍历器回顾：
        神奇的遍历，所有for循环都是访问遍历器，关键字 yield ，跟 js 内关键字为同一个
    
```python
    class M:
    def test(this):
        yield 1
        yield 2
    for key in M().test():
        print(key) # 1,2
```

    个人感悟：其实 for in 操作只是把线程交给了 一个 遍历器 函数(同步），函数会不断迭代执行，比如 js 中 为 value 为 "done" 停止
    这里是不是 只要 有 yield 实际也是返回一个遍历器？js 中数组自带遍历器接口，for in 找到其接口并执行它（语法层面实现一个功能而已）
