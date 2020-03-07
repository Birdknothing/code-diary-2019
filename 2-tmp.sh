EXP="[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}"
test1=120.204.165.224
test2=120.41.165.224
test(){
  if [ $# -eq 0 ];then
    echo 'no param'
  elif [[ "$1" =~ [0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3} ]];then
    echo $1' match pattern'
  else
    echo $1' no match pattern'
  fi
 
}
test $test1
test $test2