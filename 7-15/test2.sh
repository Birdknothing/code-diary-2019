t=11.text
IFS=\;
for val in `cat $t`
do
  for val2 in $val
    IFS=[,] || []
  do
    for val3 in $val2
  do
    IFS=\n
    echo $val3
  done
  done
done
