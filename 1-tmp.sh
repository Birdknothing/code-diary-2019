# 时间戳长度限制
datenow=$(date +%s)
# arr=('const dateNow = ${datenow}' 'if(Date.now() > +`timeAfter(\"2m\")+Date.now()`){console.log(\"fuck\")}')
node -e "
const timeAfter = str => {
    const {
        groups: { day = 0, hour = 0, minute = 0,second = 0 }
    } = str.match(/^(?<day>\d*)d?(?<hour>\d*)h?(?<minute>\d*)m?(?<second>\d*)s?$/) || { groups: {} };
    return day*24*3600000+hour*3600000+minute*60000+second*1000
};
const tmp = fs.readFileSync('$1').toString();
const mkTestline = str => {
 return '\n// testline--\n'+str+'\n// --testline'
}
const insertTestline = (str,arr) => {
 return arr.reduce((acc,ele,i)=>{
   return acc.replace(new RegExp('// insert-testline-'+i,'gm'),mkTestline(ele))
 },str)
}
console.log(insertTestline(tmp,['const mm = ${datenow}000','if(Date.now\(\) - mm > '+timeAfter(\"10m\")+'){console.log(\"fuck\")}','withExt = this.judge1']))
" > tmp-tmp.ts
tsc tmp-tmp.ts --outFile $2
rm -f tmp-tmp.ts