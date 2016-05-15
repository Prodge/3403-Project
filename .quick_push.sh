# Usage sh quick_push {folder} {name}
#
# Example Usage:
#   Push routes folder contents
#       sh quick_push routes/ tim
#   Push everything:
#       sh quick_push ./ tim

scp -r $1* root@188.166.233.19:/home/mean/$2/$1
