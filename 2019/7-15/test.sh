for t in a b c d e
do
  echo $t
done
m=c
for w in $(cat $m)
do
  echo "$w"
done
tt=/ab/cd/bb.ef.txt
echo ${tt##*.} # txt
echo ${tt#*.} # ef.txt
echo ${tt%.*} # /ab/cd/bb.ef
echo ${tt%%.*} # /ab/cd/bb