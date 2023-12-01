.PHONY: build
build: clean build-image
	docker run --rm -it -u "$$(id -u):$$(id -g)" -v "$$(pwd):/workdir" "keybrl/keybrl-mines:latest" cp -r /dist /workdir/dist

.PHONY: build-image
build-image:
	docker build -t "keybrl/keybrl-mines:latest" .

.PHONY: clean
clean:
	rm -rf dist
