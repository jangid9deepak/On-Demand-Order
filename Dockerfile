FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV SECRET_KEY="dummy-key-for-build-only"
ENV DJANGO_SETTINGS_MODULE=On_Demand_Order.settings

RUN mkdir -p /app/staticfiles
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "On_Demand_Order.wsgi:application", "--bind", "0.0.0.0:8000"]