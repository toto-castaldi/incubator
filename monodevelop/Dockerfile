FROM ubuntu:16.04

RUN DEBIAN_FRONTEND=noninteractive apt-get update --fix-missing
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y software-properties-common
RUN DEBIAN_FRONTEND=noninteractive add-apt-repository ppa:alexlarsson/flatpak
RUN DEBIAN_FRONTEND=noninteractive apt update
RUN DEBIAN_FRONTEND=noninteractive apt install -y flatpak
RUN DEBIAN_FRONTEND=noninteractive apt install -y wget

#ADD https://download.mono-project.com/monodevelop/monodevelop-6.1.2.44-1.flatpak .
ADD monodevelop-6.1.2.44-1.flatpak .

RUN wget https://sdk.gnome.org/keys/gnome-sdk.gpg
RUN flatpak remote-add --gpg-import=gnome-sdk.gpg gnome https://sdk.gnome.org/repo/
RUN flatpak install gnome org.freedesktop.Platform 1.4

ADD start.sh .

RUN mkdir -p /app/projects

CMD /start.sh
