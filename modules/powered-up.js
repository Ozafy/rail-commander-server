const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();

const HubColors = [PoweredUP.Consts.Color.PURPLE, PoweredUP.Consts.Color.RED, PoweredUP.Consts.Color.GREEN, PoweredUP.Consts.Color.BLUE, PoweredUP.Consts.Color.YELLOW];
var CurrentHubColor = 0;

exports.disconnectHubs = function () {
    console.log("Disconnecting all hubs...");
    var hubs = poweredUP.getHubs();
    for (var hubId in hubs) {
        hubs[hubId].disconnect();
    }
}

exports.scan = function () {
    console.log("Scanning for powered up devices...");
    poweredUP.scan();
}

exports.enableDiscovery = function () {
    poweredUP.on("discover", async (hub) => {
        console.log("Found hub " + hub.name + ' (id: ' + hub.uuid + ')');
        await hub.connect();
        hub.on("attach", (device) => {
            if (device.type == PoweredUP.Consts.DeviceType.HUB_LED) {
                device.setColor(HubColors[CurrentHubColor++]);
                if (CurrentHubColor >= HubColors.length) {
                    CurrentHubColor = 0;
                }
            }
            if (device.type == PoweredUP.Consts.DeviceType.TRAIN_MOTOR) {
                console.log(hub.name + '(id: ' + hub.uuid + ') has a trainmotor on port: ' + device.portName);
            }
        });
    });
}

exports.stopscan = function () {
    console.log("Stopped scanning for powered up devices...");
    poweredUP.stop();
}

exports.brake = function (hubId, portName) {
    try {
        console.log("Braking motor (" + hubId + ":" + portName + ")");
        var hub = poweredUP.getHubByUUID(hubId);
        var motor = hub.getDeviceAtPort(portName);
        //write own brake code 
        motor.brake();
    } catch (err) {

    }
}

exports.stop = function (hubId, portName) {
    try {
        console.log("Stopping motor (" + hubId + ":" + portName + ")");
        var hub = poweredUP.getHubByUUID(hubId);
        var motor = hub.getDeviceAtPort(portName);
        motor.stop();
    } catch (err) {

    }
}

exports.setPower = function (hubId, portName, power) {
    try {
        console.log("Setting motor (" + hubId + ":" + portName + ") power to " + power);
        var hub = poweredUP.getHubByUUID(hubId);
        var motor = hub.getDeviceAtPort(portName);
        motor.setPower(power);
    } catch (err) {

    }
}

exports.rampPower = function (hubId, portName, fromPower, toPower, time) {
    try {
        console.log("Ramping motor (" + hubId + ":" + portName + ") power from " + fromPower + " to " + toPower + " over " + time + "ms");
        var hub = poweredUP.getHubByUUID(hubId);
        var motor = hub.getDeviceAtPort(portName);
        //fix ramping for non 0 starts?
        motor.rampPower(fromPower, toPower, time);
    } catch (err) {

    }
}