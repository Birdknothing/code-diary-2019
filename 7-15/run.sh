for b in ./*
do
  if [[ $b == *.ts ]]
  then
    tsc -t es5 $b
    node ${b%.*}.js
  fi
done
# tsc a.ts
# node a.js
# variable=$(bc << EOF
# options
# statements
# expressions
# EOF
# )
# echo variable