all: build-js build-css
build-js: src/js/tpmgps-connect.js
	curl --data-urlencode js_code@src/js/tpmgps-connect.js  --data compilation_level=SIMPLE_OPTIMIZATIONS --data output_info=compiled_code --data output_format=text http://closure-compiler.appspot.com/compile > build/js/tpmgps-connect.min.js

build-css: src/css/tpmgps-base.css
	curl -L -F compressfile[]=@src/css/reset.css -F type=CSS -F redirect=on http://refresh-sf.com/yui/ > build/css/reset.min.css
	curl -L -F compressfile[]=@src/css/tpmgps-base.css -F type=CSS -F redirect=on http://refresh-sf.com/yui/ > build/css/tpmgps-base.min.css