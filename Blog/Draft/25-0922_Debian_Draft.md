```
apt update
apt upgrade -y
apt install -y golang git nginx supervisor
```

```
go version
git --version
```

```
systemctl start nginx
systemctl enable nginx

# equivalent to:

systemctl enable --now nginx

systemctl status nginx

systemctl restart nginx
systemctl stop nginx
systemctl reload nginx

/etc/nginx/nginx.conf
```

```
systemctl enable --now supervisor

systemctl status supervisor
```
