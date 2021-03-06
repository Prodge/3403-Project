# Run as: sh reboot_node {username}

USER=$1

PORT=3000

if [ "$USER" == "tim" ]
then
    PORT=3002
fi
if [ "$USER" == "wimo" ]
then
    PORT=3001
fi

ssh root@188.166.233.19 << EOF
    # Kill current node process
    fuser -k -n tcp $PORT

    # Run node sever in background
    su mean
    cd ~/$USER
    PORT=$PORT npm start > stdout.txt 2> stderr.txt &

    # End Session
    exit

EOF
