var PushNotifications = (function () {
    function PushNotifications(push) {
        this.pushNotification = push;
        this.setup();
    }
    PushNotifications.prototype.setup = function () {
        if (device.platform == 'android' || device.platform == 'Android') {
            console.log(device);
            this.pushNotification.register(this.successHandler, this.errorHandler, {
                "senderID": "750800674534",
                "ecb": "onNotificationGcm"
            });
        } else {
            this.pushNotification.register(this.tokenHandler, this.errorHandler, {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationApn"
            });
        }
    };

    PushNotifications.prototype.successHandler = function (result) {
        console.log(result);
        alert('result = ' + result);
    };

    PushNotifications.prototype.errorHandler = function (error) {
        alert('error = ' + error);
    };

    PushNotifications.prototype.tokenHandler = function (result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        alert('device token = ' + result);
    };

    // iOS
    PushNotifications.prototype.onNotificationApn = function (event) {
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }

        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }

        if (event.badge) {
            this.pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
        }
    };

    return PushNotifications;
})();


function onNotificationGcm(e) {
    console.log('onNotificationGcm: ' + JSON.stringify(e));

    console.log('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch (e.event) {
        case 'registered':
            if (e.regid.length > 0) {
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log('regID = ' + e.regid);
                $.get( 'http://10.50.52.72:3001/u/register/' + e.regid, function( data ) {
                    console.log( 'Register was performed.' );
                });
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground) {
                // if the notification contains a soundname, play it.
                alert(e.payload.message);
            } else {
                if (e.coldstart) {
                    console.log('<li>--COLDSTART NOTIFICATION--' + '</li>');
                } else {
                    console.log('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            console.log('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            console.log('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            break;

        case 'error':
            console.log('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            console.log('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}