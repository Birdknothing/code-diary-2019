# sed -n '{h
# :start
# $q
# p
# N
# b start
# }' $1

sed -n '{
N
s/\n/ /
p
}' $1