let url = new URL('http://localhost:8080/stream')
let eventSource = new EventSource(url)
eventSource.onopen = function () {
    console.log("Sse connection opened");
    };

eventSource.onerror = function () {
    console.log("error occured");
};
eventSource.addEventListener('message',function (event) {
    console.log("received")
    
    });

    eventSource.onmessage = e => {
    console.log('onmessage');
    console.log(e);
    }
    eventSource.addEventListener('ping', e => {
    console.log(e);
    });
