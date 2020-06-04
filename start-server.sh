echo $PWD
docker run --rm \
  -p 80:80 \
  --mount type=bind,src="$PWD/docs",dst="/usr/share/nginx/html" \
  -it nginx 