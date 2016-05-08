# Run with name as argument
# Pushes all core files to server

scp -r views/* root@188.166.233.19:/home/mean/$1/root/views/
scp -r app/* root@188.166.233.19:/home/mean/$1/root/app/
scp -r routes/* root@188.166.233.19:/home/mean/$1/root/routes/
scp -r static/js/* root@188.166.233.19:/home/mean/$1/root/static/js/
scp -r server.js root@188.166.233.19:/home/mean/$1/root/
scp -r package.json root@188.166.233.19:/home/mean/$1/root/
