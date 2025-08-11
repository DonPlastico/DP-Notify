RegisterCommand('testnotify', function()
    TriggerEvent('DP-Notify', 'Notificar prueba exitosa.', 'success', 10000)
    Wait(2500)
    TriggerEvent('DP-Notify', 'Prueba Notificar error.', 'error', 10000)
    Wait(2500)
    TriggerEvent('DP-Notify', 'Prueba Notificar información.', 10000)
    Wait(2500)
    TriggerEvent('DP-Notify', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus nibh nec augue pulvinar, eget cursus arcu gravida. Nulla facilisi. In ut urna eu dui condimentum lobortis id et leo. Suspendisse sed varius mauris. Etiam sit amet elit non libero gravida tempus placerat a purus. In interdum felis eleifend ligula varius molestie. Sed interdum nulla at eros rhoncus, in venenatis lorem ultricies. Mauris vitae libero non risus imperdiet sollicitudin. Fusce pulvinar, tortor et accumsan aliquam, justo erat dignissim odio, sit amet consequat neque arcu eu diam. Integer felis ligula, egestas sed sodales at, varius in eros. Suspendisse mollis ante nec nisl sodales euismod. Etiam non tellus dignissim, fermentum odio quis, tincidunt ipsum. Fusce cursus, leo eget laoreet mattis, dui orci commodo justo, vitae ullamcorper tortor enim nec metus. Cras fringilla, leo ac interdum ornare, nunc erat vehicula neque, non eleifend tellus nisl eget lectus. Etiam iaculis magna nulla, eu pellentesque sem venenatis a. Aliquam in laoreet ex, eu convallis tortor. Maecenas nec lorem nec odio vulputate accumsan. Sed et venenatis dolor. Nullam eu mauris nulla. Pellentesque porta tellus magna, ut elementum risus viverra et. Duis consectetur, nisl sit amet suscipit sollicitudin, nisl leo consectetur nisi, vel eleifend arcu purus in ligula.', 10000)
    
end)

RegisterCommand('notifysettings', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'ShowSettings'
    })
end)

RegisterNetEvent('DP-Notify', function(text, type, timeout)
    if timeout == nil then
        timeout = 10000
    end
    ShowNotify(text, type, timeout)
end)

function ShowNotify(text, type, timeout)
    SendNUIMessage({
        action = 'ShowNotify',
        text = ConvertMessage(text),
        type = type,
        timeout = timeout
    })
end

function ConvertMessage(text)
    text = text:gsub("~r~", "<span style=Color:red;>")
    text = text:gsub("~b~", "<span style='Color:rgb(0, 213, 255);'>")
    text = text:gsub("~f~", "<span style='Color:rgb(4, 69, 155);'>")
    text = text:gsub("~g~", "<span style='Color:rgb(0, 255, 68);'>")
    text = text:gsub("~y~", "<span style=Color:yellow;>")
    text = text:gsub("~p~", "<span style='Color:rgb(220, 0, 255);'>")
    text = text:gsub("~c~", "<span style=Color:grey;>")
    text = text:gsub("~m~", "<span style=Color:darkgrey;>")
    text = text:gsub("~u~", "<span style=Color:black;>")
    text = text:gsub("~o~", "<span style=Color:gold;>")
    text = text:gsub("~s~", "</span>")
    text = text:gsub("~w~", "</span>")
    text = text:gsub("~b~", "<b>")
    text = text:gsub("~n~", "<br>")
    text = "<span style=Color:white;>" .. text .. "</span>"

    return text
end

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsControlJustReleased(0, 322) then
            SendNUIMessage({
                action = "HideSettings"
            })
            SetNuiFocus(false, false)
        end
    end
end)

RegisterNUICallback('CloseSettings', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Nuevo callback para el botón de prueba
RegisterNUICallback('TriggerTestNotify', function(data, cb)
    ExecuteCommand('testnotify')
    cb('ok')
end)
