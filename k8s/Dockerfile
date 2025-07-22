FROM python:3.11.12-slim AS builder

WORKDIR /app

RUN python -m venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"

COPY lambda/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY lambda/app.py lambda/knowledge_base.py lambda/project_knowledge_base.json k8s/wsgi.py /app/

FROM python:3.11.12-slim AS build-image

ENV PATH="/opt/venv/bin:$PATH"

COPY --from=builder /opt/venv /opt/venv

WORKDIR /app

COPY --from=builder /app/ /app/

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set environment variables to replace SSM parameters
ENV ENVIRONMENT=dev
ENV ALLOWED_ORIGIN=https://www.jarredthomas.cloud
ENV AWS_REGION=us-east-1
ENV DYNAMODB_TABLE=cfx-chatbot-logs
ENV BEDROCK_MODEL=anthropic.claude-instant-v1

RUN addgroup --system --gid 1001 pygroup && \
    adduser --system --uid 1001 --gid 1001 pyuser && \
    chown -R pyuser:pygroup /app

USER pyuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8000/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]
