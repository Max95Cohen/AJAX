function AJAX(method, URL, data, cb) {
    let temp = [];

    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            temp.push(`${i}=${data[i]}`);
        }
    }

    data = temp;

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

    x.onreadystatechange = function () {
        if (x.readyState === 4 && x.status === 200 && cb) {
            cb(JSON.parse(x.response));
        }
    };
}
