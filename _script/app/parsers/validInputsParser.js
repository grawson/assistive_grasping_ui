define(function () {

    // MODULE ***********************************************************************

    return {

        // Parse valid inputs into mustache formatted data
        parse: function (data) {
            var parsed = {"buttons": []};

            for (var i in data.inputs) {
                var status = (data.inputs[i] === "mouse") ? "on" : "off";
                parsed.buttons.push( {"title": data.inputs[i], "status": status } );
            }
            return parsed;
        }
    };
});