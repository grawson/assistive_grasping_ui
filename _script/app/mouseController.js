define(['jquery', 'app/ros'], function ($, Ros) {

    // VAR *************************************************************************

    var button_classes = [".action-button", ".submenu-button"];

    var validMenuActions = ["menu1", "menu2", "menu3"];
    var validSubmenuActions = [
        ["submenu1", "submenu2", "back"],
        ["submenu3", "submenu4", "back"],
        ["submenu5", "submenu6", "back"]
    ];

    var validActionsData = {
        "validActions": validMenuActions,
        "parent": "",
        "menuType": "menu"
    };

    // ROS topics
    const executeAction = Ros.executeAction();
    const validActions = Ros.validActions();
    const selectedAction = Ros.selectedAction();

    // FUNC *************************************************************************

    // Sleep execution for given amount of time
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Return true if valid actions needs to be published over ROS, else false
    function updateValidActionsData(executedID) {
        var publish = false;
        validActionsData.parent = executedID;

        // Means we are clicking into the submenu
        if (validActionsData.menuType === "menu") {
            var submenuIndex = validMenuActions.indexOf(executedID);
            validActionsData.validActions = validSubmenuActions[submenuIndex];
            validActionsData.menuType = "submenu";
            publish = true;

        // In submenu and clicking back button
        } else if (executedID === "back") {
            validActionsData.validActions = validMenuActions;
            validActionsData.menuType = "menu";
            publish = true;
        }

        return publish;
    }


    async function main() {

        // Publish valid actions to initially load page
        var msg = new ROSLIB.Message({data: JSON.stringify(validActionsData)});
        await sleep(2000);
        validActions.publish(msg);

        // Set mouse click and hover callbacks
        $(document).ready(function () {
            for (var i in button_classes) {
                // click (attaching the event to #menu-injection will ensure it remains when menu page has changed)
                $("#menu-injection").on("click", button_classes[i], function () {
                    for (var j in validActionsData.validActions) {
                        if (validActionsData.validActions[j] === $(this).attr("id")) {
                            // publish execute
                            executeAction.publish(new ROSLIB.Message({data: $(this).attr("id")}));

                            // publish valid actions if necessary
                            if (updateValidActionsData($(this).attr("id"))) {
                                var msg = new ROSLIB.Message({data: JSON.stringify(validActionsData)});
                                validActions.publish(msg);
                            }
                        }
                    }

                // Hover in
                }).on("mouseenter", button_classes[i], function () {
                    selectedAction.publish(new ROSLIB.Message({data: $(this).attr("id")}));

                // Hover out
                }).on("mouseleave", button_classes[i], function () {
                    selectedAction.publish(new ROSLIB.Message({data: ""}));
                });
            }
        })
    }

    // MAIN *************************************************************************

    main();

});
