FROM ubuntu:16.04
USER root
# create ubuntu user since some of the modules expect the ubuntu user to exist
RUN useradd --create-home --shell /bin/bash ubuntu
RUN echo 'ubuntu:password' | chpasswd
RUN usermod -a -G sudo ubuntu
RUN apt-get clean
RUN apt update
RUN apt-get install -y build-essential
RUN apt-get install -y checkinstall
RUN apt-get install -y libreadline-gplv2-dev
RUN apt-get install -y libncursesw5-dev
RUN apt-get install -y libssl-dev
RUN apt-get install -y tk-dev
RUN apt-get install -y libgdbm-dev
RUN apt-get install -y libc6-dev
RUN apt-get install -y libbz2-dev
RUN apt-get install -y zlib1g-dev
RUN apt-get install -y openssl
RUN apt-get install -y libffi-dev
RUN apt-get install -y python3-dev
RUN apt-get install -y python3-setuptools
RUN apt-get install -y python3-pip
RUN apt-get install -y wget
RUN apt-get install -y git
RUN apt-get install -y python-dev
RUN apt-get install -y vim
RUN apt-get install -y curl
RUN apt-get install -y unzip
# Prepare to build
RUN mkdir -p /tmp/Python37
WORKDIR /tmp/Python37
# Pull down Python 3.7, build, and install
RUN wget https://www.python.org/ftp/python/3.7.1/Python-3.7.1.tar.xz
RUN tar xvf Python-3.7.1.tar.xz
WORKDIR /tmp/Python37/Python-3.7.1
RUN ./configure --enable-optimizations
RUN make altinstall
RUN python3.7 --version
# Clone repo
RUN mkdir -p /home/ubuntu/iclicker_remote_reg
WORKDIR /home/ubuntu/iclicker_remote_reg
COPY . ./iclicker_remote_reg
COPY requirements.txt .
RUN pip3.7 install --upgrade pip setuptools wheel
RUN pip3.7 install --no-cache-dir -r requirements.txt
RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh
WORKDIR /home/ubuntu/iclicker_remote_reg/iclicker_remote_reg/iclicker_remote_reg_fe/iclicker-remote-reg
RUN npm install
RUN npm run build
# Cloning repo would require repository access, it would be easier to clone the
# repo via jenkins and copy the source from jenkins instance to docker.
# RUN git clone https://github.com/macmillanhighered/inst-dash360-core-api.git
# Serverdock
WORKDIR /home/ubuntu/iclicker_remote_reg/iclicker_remote_reg/iclicker_remote_reg/uwsgi
EXPOSE 8000
CMD ["uwsgi", "--ini=prod.ini"]
