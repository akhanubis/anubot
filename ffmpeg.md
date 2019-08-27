sudo su -
cd /usr/local/bin
mkdir ffmpeg
cd ffmpeg
wget https://www.johnvansickle.com/ffmpeg/old-releases/ffmpeg-4.0.3-64bit-static.tar.xz
tar -xvf ffmpeg-4.0.3-64bit-static.tar.xz
ln -s /usr/local/bin/ffmpeg/ffmpeg-4.0.3-64bit-static/ffmpeg /usr/bin/ffmpeg
ln -s /usr/local/bin/ffmpeg/ffmpeg-4.0.3-64bit-static/ffprobe /usr/bin/ffprobe
exit