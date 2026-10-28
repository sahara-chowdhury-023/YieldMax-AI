
# Use Python 3.12 as the backend environment
FROM python:3.12-slim

# All commands will run inside /app
WORKDIR /app

# Copy Django's dependency list
COPY requirements.txt .

# Install Django and required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the existing backend source code
COPY . .

# Django uses port 8000
EXPOSE 8000

# Start Django and allow access from outside the container
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
