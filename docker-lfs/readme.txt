execute
=======
docker build .
docker run -it --privileged --device=/dev/sdb -e DEV_VOLUME=sdb bc045460bd69

working
=======
docker build .
docker run -it --privileged --device=/dev/sdb -e DEV_VOLUME=sdb bc045460bd69 bash

export LFS=/mnt/lfs
mkdir -pv $LFS
mount -v -t ext4 /dev/$DEV_VOLUME $LFS
mkdir -v $LFS/sources
ln -sv $LFS/tools /
umask 022
LFS=/mnt/lfs
LC_ALL=POSIX
LFS_TGT=$(uname -m)-lfs-linux-gnu
PATH=/tools/bin:/bin:/usr/bin
export LFS LC_ALL LFS_TGT PATH
export MAKEFLAGS='-j 2'
