# Run with name as argument
# Pulls the coverage report from the server

mkdir coverage
scp -r root@188.166.233.19:/home/mean/$1/root/coverage/* coverage/
