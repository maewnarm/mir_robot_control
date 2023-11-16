FROM python:3.10.6

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONWARNINGS ignore

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -yq vim tzdata
RUN  ln -fs /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

COPY . /code
WORKDIR /code

RUN pip install -r requirements.txt
EXPOSE 8888
ENV PYTHONPATH "${PYTHONPATH}:/code"
CMD ["python", "app/main.py"]
