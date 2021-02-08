from PIL import  Image
img = Image.open("./test1.png")
w,h = img.size
print(w,h)