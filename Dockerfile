FROM kpavlovsky/python3.7

################################

# RUN apt-get update && apt-get install -y

# Install gcc
RUN apt-get update \
    && apt-get install gcc -y \
    && apt-get install tk -y \
    && apt-get clean
## required for pyodbc in ubuntu image
RUN apt-get install unixodbc-dev -y

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

RUN python manage.py makemigrations && python manage.py migrate

EXPOSE 8000

CMD [ "python" , "manage.py", "runserver", "0.0.0.0:8000"]
