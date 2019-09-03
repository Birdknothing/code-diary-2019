for file in $(ls)
do
  if [[ $file == *.ts ]]
  then
    tsc $file
    node ${file%.*}.js
  fi
done