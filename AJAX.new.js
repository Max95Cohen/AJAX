function AJAX(method, URL, data, success, fail) {
    let temp = [];

    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            temp.push(`${i}=${data[i]}`);
        }
    }

    data = temp.join('&');

    if (method.toLowerCase() === 'get') {
        URL += '?' + data;
        data = null;
    }

    let x = new XMLHttpRequest();
    x.open(method, URL, true);

    if (method.toLowerCase() === 'post') {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    x.send(data);

    x.onreadystatechange = () => {
        x.onreadystatechange = function () {
            if (x.readyState === 4) {
                if (x.status === 200) {
                    if (success) {
                        success(JSON.parse(x.response));
                    }
                } else {
                    if (fail) {
                        fail(x);
                    }
                }
            }
        }
    };
}
