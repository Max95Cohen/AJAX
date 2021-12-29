function AJAX_(method_, URL_, data_, success_, fail_) {
    let temp = [],
        x = new XMLHttpRequest(),
        isFile_ = false;

    if (data_ instanceof FormData) {
        isFile_ = true;
    } else {
        for (let i in data_) {
            if (data_.hasOwnProperty(i)) {
                temp.push(`${i}=${data_[i]}`);
            }
        }

        data_ = temp.join('&');
    }

    if (data_ && method_.toLowerCase() === 'get') {
        URL_ += '?' + data_;
        data_ = null;
    }

    x.open(method_, URL_, true);

    if (method_.toLowerCase() === 'post') {
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (!isFile_) {
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        let csrf_ = document.querySelector('meta[name="csrf-token"]');

        if (csrf_) {
            x.setRequestHeader('X-CSRF-TOKEN', csrf_.content);
        }
    }

    x.send(data_);

    x.onreadystatechange = () => {
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
    };
}
