var JppolIdentity = /** @class */ (function () {
    function JppolIdentity() {
        this.hosts = ["http://dev.medielogin.dk/services/jppolid/",
            "http://webmastermedieloginudv.jppol.dk/services/jppolid/",
            "http://udv.medielogin.dk/services/jppolid/"];
    }
    JppolIdentity.prototype.apply = function (callback) {
        console.log("this is the current script", document.currentScript);
        this.storeCurrentSrc();
        this.readBestGuessId();
        this.callback = callback;
    };
    JppolIdentity.prototype.distributeId = function () {
        var userid = this.id;
        this.hosts.forEach(function (url) {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url + userid, true);
            xhttp.send();
        });
        this.callback(this.id);
    };
    JppolIdentity.prototype.readBestGuessId = function () {
        this.id = JppolIdentity.getIdFromCookie();
        console.log("Found id ", id);
        if (this.id != null && this.id != "") {
            this.distributeId();
        }
        else {
            this.retrieveFromHosts();
        }
    };
    JppolIdentity.prototype.retrieveFromHosts = function () {
        if (this.currentHostNumber >= this.hosts.length) {
            this.id = JppolIdentity.createRandomId();
            this.storeCurrentId();
        }
        var host = this.hosts[this.currentHostNumber];
        this.currentHostNumber++;
        var xhr = new XMLHttpRequest();
        var me = this;
        xhr.open("GET", host, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) {
                console.log("state transition in request for " + host);
            }
            else if (xhr.status === 200) {
                console.log("received id from url ", host, xhr.responseText);
                me.id = JSON.parse(xhr.responseText);
                me.distributeId();
            }
            else {
                console.log("No id received from ", host);
                me.retrieveFromHosts();
            }
        };
        xhr.send();
    };
    JppolIdentity.createRandomId = function () {
        var alphabet = "0123456789abcdef";
        var length = 32;
        var randomid = "";
        for (var i = 0; i < length; i++) {
            if (i == 8 || i == 12 || i == 16 || i == 20) {
                randomid += "-";
            }
            randomid += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        console.log("Created random id", randomid);
        return randomid;
    };
    JppolIdentity.getIdFromCookie = function () {
        var name = JppolIdentity.cookieId + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    JppolIdentity.prototype.storeCurrentId = function () {
        document.cookie = JppolIdentity.cookieId + "=" + this.id + "; " + JppolIdentity.cookieExpiry();
    };
    JppolIdentity.prototype.storeCurrentSrc = function () {
        document.cookie = "jppolidsrc=" + document.location.href + "; " + JppolIdentity.cookieExpiry();
    };
    JppolIdentity.cookieExpiry = function () {
        return new Date((new Date()).getTime() + (365 * 24 * 60 * 60 * 1000));
    };
    JppolIdentity.cookieId = "jppolid";
    return JppolIdentity;
}());
var id = new JppolIdentity();
id.apply(function (id) { return console.log("RECEIVED ID", id); });
