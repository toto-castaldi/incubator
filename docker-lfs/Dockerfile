FROM ubuntu:16.04

RUN apt-get update
RUN apt-get update
RUN apt-get install -y bison++
RUN apt-get install -y bzip2
RUN apt-get install -y gawk
RUN apt-get install -y build-essential
RUN apt-get install -y m4
RUN apt-get install -y texinfo
RUN apt-get install -y wget

ADD http://www.linuxfromscratch.org/lfs/view/stable/wget-list /
COPY version-check.sh /
COPY library-check.sh /
COPY docker-entrypoint.sh /

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["build"]
