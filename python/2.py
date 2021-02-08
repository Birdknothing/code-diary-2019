<<<<<<< HEAD
import tkinter

def main():

    # 窗口
    box = tkinter.Tk()
    box.geometry('600x400')
    box.title('test')


    # 给窗口打标签,label显示文本位图
    label1 = tkinter.Toplevel()
    # 直接放类似flex布局的左边，肯定还有其他选项
    # label1.pack(side='left')

    # pack类似于放置的意思，将此对象放到canvas上，tkinter.Tk类似生成一个画布，mainloop 类似于开始到屏幕上画图并开启监听
    tkinter.Message(text="test2").pack(side="bottom")

    # 可生成的对象很多
    # Canvas，Button,Label,Checkbutton(checkbox),Entry(类似input),Frame(类似div)，Listbox(类似 ul>li),Menu(类似select标签)，Message(就是Label),Radiobutton(类似input radio),Scale（类似css3的input scale),Scrollbar(类似 overflow:scroll),Text(类似 textarea),Toplevel(类似 alert，再弄一个框)
    

    # 事件监听
    box.mainloop()
if __name__ == '__main__':
    main()
=======
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


>>>>>>> 206d198897a22b742b3adbd477cda8213a08e870
