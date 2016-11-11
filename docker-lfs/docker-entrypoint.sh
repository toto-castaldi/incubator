#!/bin/bash
set -e


if [ "$1" = 'build' ]; then
  yes | mkfs -v -t ext4 /dev/$DEV_VOLUME
  export LFS=/mnt/lfs
  mkdir -pv $LFS
  mount -v -t ext4 /dev/$DEV_VOLUME $LFS
  mkdir -v $LFS/sources
  chmod -v a+wt $LFS/sources
  wget --input-file=wget-list --continue --directory-prefix=$LFS/sources
  mkdir -v $LFS/tools
  ln -sv $LFS/tools /
  LFS=/mnt/lfs
  LC_ALL=POSIX
  LFS_TGT=$(uname -m)-lfs-linux-gnu
  PATH=/tools/bin:/bin:/usr/bin
  export LFS LC_ALL LFS_TGT PATH
  export MAKEFLAGS='-j 2'

  #binutils
  cd /tools
  find $LFS/sources -iname "binutils-*" -exec tar xvjf {} \;
  cd binutils-*
  mkdir -v build
  cd       build
  ../configure --prefix=/tools            \
             --with-sysroot=$LFS          \
             --with-lib-path=/tools/lib   \
             --target=$LFS_TGT            \
             --disable-nls                \
             --disable-werror
  make
  case $(uname -m) in
    x86_64) mkdir -v /tools/lib && ln -sv lib /tools/lib64 ;;
  esac
  make install

  #Cross GCC
  cd $LFS/sources
  find . -iname "gcc-*" -exec tar xvjf {} \;
  cd gcc*
  tar -xf ../mpfr-*
  mv -v mpfr-* mpfr
  tar -xf ../gmp-*
  mv -v gmp-* gmp
  tar -xf ../mpc-*
  mv -v mpc-* mpc
  for file in \
 $(find gcc/config -name linux64.h -o -name linux.h -o -name sysv4.h)
  do
    cp -uv $file{,.orig}
    sed -e 's@/lib\(64\)\?\(32\)\?/ld@/tools&@g' \
        -e 's@/usr@/tools@g' $file.orig > $file
    echo '
  #undef STANDARD_STARTFILE_PREFIX_1
  #undef STANDARD_STARTFILE_PREFIX_2
  #define STANDARD_STARTFILE_PREFIX_1 "/tools/lib/"
  #define STANDARD_STARTFILE_PREFIX_2 ""' >> $file
    touch $file.orig
  done
  mkdir -v build
  cd       build
  ../configure                                     \
    --target=$LFS_TGT                              \
    --prefix=/tools                                \
    --with-glibc-version=2.11                      \
    --with-sysroot=$LFS                            \
    --with-newlib                                  \
    --without-headers                              \
    --with-local-prefix=/tools                     \
    --with-native-system-header-dir=/tools/include \
    --disable-nls                                  \
    --disable-shared                               \
    --disable-multilib                             \
    --disable-decimal-float                        \
    --disable-threads                              \
    --disable-libatomic                            \
    --disable-libgomp                              \
    --disable-libmpx                               \
    --disable-libquadmath                          \
    --disable-libssp                               \
    --disable-libvtv                               \
    --disable-libstdcxx                            \
    --enable-languages=c,c++
  make
  make install

  #Linux Headers xz extension -> xvJf
  cd $LFS/sources
  find . -iname "linux-*" -exec tar xvJf {} \;
  cd linux-*
  make mrproper
  make INSTALL_HDR_PATH=dest headers_install
  cp -rv dest/include/* /tools/include

  #glibc
  cd $LFS/sources
  find . -iname "glibc-*.xz" -exec tar xvJf {} \;
  cd glibc-*
  mkdir -v build
  cd       build
  ../configure                           \
      --prefix=/tools                    \
      --host=$LFS_TGT                    \
      --build=$(../scripts/config.guess) \
      --enable-kernel=2.6.32             \
      --with-headers=/tools/include      \
      libc_cv_forced_unwind=yes          \
      libc_cv_c_cleanup=yes
  make
  make install

  #5.8. Libstdc++-6.2.0
  cd $LFS/sources
  cd gcc-*
  mkdir -v build-libstdc
  cd build-libstdc
  ../libstdc++-v3/configure         \
    --host=$LFS_TGT                 \
    --prefix=/tools                 \
    --disable-multilib              \
    --disable-nls                   \
    --disable-libstdcxx-threads     \
    --disable-libstdcxx-pch         \
    --with-gxx-include-dir=/tools/$LFS_TGT/include/c++/6.2.0
  make
  make install

  #5.9. Binutils-2.27 - Pass 2
  cd /tools
  cd binutils-*
  cd build
  CC=$LFS_TGT-gcc              \
  AR=$LFS_TGT-ar                 \
  RANLIB=$LFS_TGT-ranlib         \
  ../configure                   \
    --prefix=/tools            \
    --disable-nls              \
    --disable-werror           \
    --with-lib-path=/tools/lib \
    --with-sysroot
  make
  make install

  echo "end"


  exit 0
fi

exec "$@"
