watch:
	./node_modules/.bin/webpack --progress --colors --watch

clean:
	rm static/bundle.js
	rm static/bundle.js.map

js:
	./node_modules/.bin/webpack --progress --colors

install:
	npm install
	rsync  -var node_modules/material-design-icons/iconfont/ ./static/css/material-design-icons/
	rsync  -var node_modules/roboto-fontface/css/ ./static/css/
	rsync  -var node_modules/roboto-fontface/fonts/ ./static/fonts/

