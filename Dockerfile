# The marketing site on Fly.io: the repo's files served by Caddy with the rules in Caddyfile. Deployed by
# .github/workflows/fly-deploy.yml on every push to main.
FROM public.ecr.aws/docker/library/caddy:2.10-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv
EXPOSE 8080
