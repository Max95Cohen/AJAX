function AJAX_(method_, URL_, data_, success_, fail_, JSONP_) {
    if (JSONP_) {
        var callbackName_ = 'a' + String(Math.random()).slice(-6);

        window[callbackName_] = function (data) {
            if (success_) {
                success_(data);
            }

            setTimeout(function () {
                script_.parentNode.removeChild(script_);
            }, 1);
        };

        URL_ += ~URL_.indexOf('?') ? '&' : '?';
        URL_ += 'callback=' + callbackName_;

        var script_ = document.createElement('script');
        script_.src = URL_;

        document.body.appendChild(script_);

        return true;
    }

    var temp = [],
        x = new XMLHttpRequest(),
        isFile_ = false;

    if (data_ instanceof FormData) {
        isFile_ = true;
    } else {
        for (var i in data_) {
            if (data_.hasOwnProperty(i)) {
                temp.push(i + '=' + data_[i]);
            }
        }

        data_ = temp.join('&');
    }

    if (data_ && method_.toLowerCase() === 'get') {
        if (URL_.indexOf('?') > 0) {
            URL_ += '&';
        } else {
            URL_ += '?';
        }

        URL_ += '?' + data_;
        data_ = null;
    }

    x.open(method_, URL_, true);

    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if (method_.toLowerCase() === 'post') {
        if (!isFile_) {
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        var csrf_ = document.querySelector('meta[name="csrf-token"]');

        if (csrf_) {
            x.setRequestHeader('X-CSRF-TOKEN', csrf_.content);
        }
    }

    x.send(data_);

    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            if (x.status === 200) {
                if (success_) {
                    success_(process_(x.response));
                }
            } else {
                if (fail_) {
                    fail_(process_(x.response));
                }
            }
        }
    }

    function process_(response) {
        if (x.getResponseHeader('Content-Type') === 'application/json') {
            return JSON.parse(response);
        } else {
            return response;
        }
    }
}
