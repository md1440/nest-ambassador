# call with make

build:
	docker compose build
 
run:
	docker compose up
 
stop:
	docker compose down

service:
	docker compose exec backend sh
