function AJAX_(method_, URL_, data_, success_, fail_) {
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
    }

    data_ = temp.join('&');

    if (data_ && method_.toLowerCase() === 'get') {
        URL_ += '?' + data_;
        data_ = null;
    }

    x.open(method_, URL_, true);

    if (method_.toLowerCase() === 'post') {
        if (!isFile_) {
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        var csrf_ = d.querySelector('meta[name="csrf-token"]');

        if (csrf_) {
            x.setRequestHeader('X-CSRF-TOKEN', csrf_.content);
        }
    }

    x.send(data_);

    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            if (x.status === 200) {
                if (success_) {
                    success_(JSON.parse(x.response));
                }
            } else {
                if (fail_) {
                    fail_(x);
                }
            }
        }
    }
}
