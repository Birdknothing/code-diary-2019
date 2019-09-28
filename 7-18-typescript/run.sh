for file in $(ls)
do
  echo $file
  if [[ $file == *.ts ]]
  then
    tsc  $file
    node ${file%.*}.js
  fi
done