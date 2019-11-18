for tmp in $(ls)
do
    if [ -d $tmp ];then
        cd ../dist;
        if [ ! -d $tmp ];then
        mkdir $tmp
            # 图片全复制
            if [ $tmp = 'img' ];then
                cp -r ../source/$tmp/* $tmp;
            fi
        fi
        cd ../source;
    fi

    if [ -f $tmp ];then
        cd ../dist;
        if [ ! -f $tmp ];then
            if [ $(basename $tmp) != 'compress.sh' ];then
                # 二级目录下文件都复制
                cp ../source/$tmp $tmp;
            fi
        fi
        cd ../source;
    fi
done

cd ./css;
node-sass main.scss --output-style=compressed -o ../../dist/css;
cd ../js;

for tmp in $(ls)
do
    if [ -f $tmp ];then
        node -e 'fs.writeFileSync("./tmp.js",fs.readFileSync("./"+process.argv[1]).toString().replace(/((?=console).)*/gm,""))' $tmp;
        webpack --entry ./tmp.js -p -o ../../dist/js/$tmp;
        rm -f tmp.js;
    fi
done