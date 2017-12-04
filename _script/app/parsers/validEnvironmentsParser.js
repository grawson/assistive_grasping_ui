define(function () {

    // MODULE ***********************************************************************

    return {

        // Parse valid inputs into mustache formatted data
        parse: function (data) {
            var parsed = {"buttons": []};

            for (var i in data.environments) {
                parsed.buttons.push( {"title": data.environments[i], "status": "off" } );
            }
            return parsed;
        }
    };
});