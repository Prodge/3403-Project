# Run as: sh push {username} {branch_name}
# This script will push the local branch to github, pull the changes on the server and restart the node instance

USER=$1
BRANCH=$2

PORT=3000

if [ "$USER" == "tim" ]
then
    PORT=3002
fi
if [ "$USER" == "wimo" ]
then
    PORT=3001
fi


git push origin $BRANCH

ssh root@188.166.233.19 << EOF
    # Kill current node process
    fuser -k -n tcp $PORT

    # Pull any updates
    su mean
    cd ~/$USER
    if [ "$BRANCH" != "master" ]
    then
        git checkout master
        git pull origin master
        git branch -D $BRANCH
        git checkout -b $BRANCH
    fi
    git pull origin $BRANCH

    # Run node sever in background
    rm stdout.txt stderr.txt
    PORT=$PORT npm start > stdout.txt 2> stderr.txt &

    # End Session
    exit

EOF
