for tmp in $(ls)
do
    if [ -d $tmp ];then
        cd ../tmp1;
        if [ ! -d $tmp ];then
        mkdir $tmp
            if [ $tmp = '2' ];then
                echo '2222';
                cp -r ../tmp1/$tmp/* $tmp
            fi
        fi
        cd ../tmp2;
    fi

    if [ -f $tmp ];then
        cd ../tmp1;
        if [ ! -f $tmp ];then
        cp ../tmp2/$tmp $tmp;
        fi
        cd ../tmp2;
    fi
done
# node -e 'fs.writeFileSync("./tmp.js",fs.readFileSync("./o.js").toString().replace(/((?=console).)*/gm,""))';
# webpack --entry ./tmp.js -p -o ./res.js;
# rm -f tmp.js;