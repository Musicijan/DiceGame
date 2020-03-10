
const colors = [
    "blue",
    "green",
    "red",
    "purple",
    "orange",
    "pink",
    "yellow",
    "turquoise"
]

let selectedColor = 'blue';
// let ws;
function initalizeChat(websocket) {
    console.log(ws);
    // ws = websocket;
    $('#chat-form').on('submit', function (e) {
        e.preventDefault();
        submitMessage(e);
    });

    $('#color-submit').on('click', function (e) {
        // console.log(e)
        let colorInput = $('input#color-input');
        console.log(colorInput.val());
        $.post("http://web-who:3069/setColor", function (data) {
            // $.post("http://localhost:3000/setColor", function (data) {
            console.log(data);
        });

        $.ajax({
            url: "http://web-who:3069/setColor",
            type: 'post',
            data: {
                color: colorInput.val()
            },
            // headers: {
            //     'Acess': 'Header Value One',   //If your header name has spaces or any other char not appropriate
            //     "Header Name Two": 'Header Value Two'  //for object property name, use quoted notation shown in second
            // },
            crossDomain: true,
            dataType: 'json',
            success: function (data) {
                console.log(data);
            }
        });
    });


    generateColorPicker();
    // generate colorpicker
    function generateColorPicker() {
        for (let i = 0; i < colors.length; i++) {
            let color = colors[i];
            $('#color-picker').append(`<div class='color-swatch ${color}' id="swatch-${color}" style='background: ${color}' onclick='setColor("${color}")'></div>`)
        }
    }
}

function setColor(color) {
    selectedColor = color;
    for (let i = 0; i < colors.length; i++) {
        let c = colors[i];
        $(`#swatch-${c}`).removeClass("selected");
    }
    $(`#swatch-${color}`).addClass("selected");

    ws.send(JSON.stringify({
        command: "set_color",
        color
    }));
}

function submitMessage(event) {
    // check name
    if (username !== '') {
    // if ($('#userName').val() !== '') {
        let string = event.target[0].value;
        ws.send(JSON.stringify({
            command: "chat_message",
            message: string
        }));
        event.target[0].value = "";
    } else {
        alert("Please input a name.");
    }
}