class test:
    __slots__ = "x"  # 只允许 x 属性被绑定和赋值

    def __init__(self, x):
        self.x = x


print(test(1).x)
class stest:
    def __init__(self, z):
        self.z = z

class test2(test):
    def __init__(self, y):
        super().__init__(y) # 关键字也和js中的相同

class Any(object):
    def __init__(self):
        pass
print(object) # 任何类默认继承 object 类


