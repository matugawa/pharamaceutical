FROM python:3.9

RUN apt update && apt install -y tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# playwright
RUN apt install -y \
    wget \
    curl \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1 \
    libxss1 \
    libgtk-3-0


RUN mkdir /server

WORKDIR /server

COPY requirements.txt /server

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

RUN playwright install --with-deps