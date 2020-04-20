datenow=$(date +%s)000
node -e "console.log(Date.now()-'${datenow}')"
node -e "console.log(Date.now())"