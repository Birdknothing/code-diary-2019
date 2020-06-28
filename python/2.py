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