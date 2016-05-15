# Run with name as argument
# Pushes all core files to server

scp -r views/* root@188.166.233.19:/home/mean/$1/views/
scp -r app/* root@188.166.233.19:/home/mean/$1/app/
scp -r routes/* root@188.166.233.19:/home/mean/$1/routes/
scp -r static/js/* root@188.166.233.19:/home/mean/$1/static/js/
scp -r start.js root@188.166.233.19:/home/mean/$1/
scp -r package.json root@188.166.233.19:/home/mean/$1/
