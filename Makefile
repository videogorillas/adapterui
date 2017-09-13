watch:
	./node_modules/.bin/webpack --progress --colors --watch

clean:
	rm static/bundle.js
	rm static/bundle.js.map

js:
	./node_modules/.bin/webpack --progress --colors

install:
	npm install
	./node_modules/.bin/bower install

