local QBCore = exports['qb-core']:GetCoreObject()

function GetOffsetFromCoordsAndHeading(coords, heading, offsetX, offsetY, offsetZ)
    local headingRad = math.rad(heading)
    local x = offsetX * math.cos(headingRad) - offsetY * math.sin(headingRad)
    local y = offsetX * math.sin(headingRad) + offsetY * math.cos(headingRad)
    local z = offsetZ
    local worldCoords = vector4(
        coords.x + x,
        coords.y + y,
        coords.z + z,
        heading
    )
    return worldCoords
end

function CamCreate(npc)
    cam = CreateCam('DEFAULT_SCRIPTED_CAMERA')
    local coordsCam = GetOffsetFromCoordsAndHeading(npc, npc.w, 0.0, 0.9, 1.60)
    local coordsPly = npc
    SetCamCoord(cam, coordsCam)
    PointCamAtCoord(cam, coordsPly['x'], coordsPly['y'], coordsPly['z'] + 1.60)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 500, true, true)
end

function DestroyCamera()
    RenderScriptCams(false, true, 500, 1, 0)
    DestroyCam(cam, false)
    SendNUIMessage({
        action = "close",
    })
end

local function loaded(hash)
    RequestModel(hash)
    while not HasModelLoaded(hash) do
        Wait(0)
    end
end

Citizen.CreateThread(function()
    local coord = vector4(-116.74, 6453.34, 30.39, 229.2)
    local hash = 's_m_y_dealer_01'
    loaded(hash)
    ped = CreatePed(4, hash, coord.x, coord.y, coord.z, coord.w, false, false)
    FreezeEntityPosition(ped, true)
    TaskWanderStandard(ped, 10, 10)
    SetEntityInvincible(ped, true)
    SetBlockingOfNonTemporaryEvents(ped, true)
    TaskStartScenarioInPlace(ped, "WORLD_HUMAN_COP_IDLES", 0, 1)

    exports['qb-target']:AddTargetEntity(ped, {
        options = {
            {
                type = "server",
                event = "CA-BigDavid-V2:big:davidv2",
                icon = "fas fa-building",
                label = "Big David",
                job = "all",
            },
        },
        distance = 2.5
    })

    exports.interact:AddInteraction({
    coords = vector3(-116.74, 6453.34, 30.39),
    distance = 10.0, 
    interactDst = 3.0, 
    id = 'Big David', 
    name = 'Big David', 
    options = {
         {
            label = '[E] Big David',
            action = function()
                TriggerServerEvent("CA-BigDavid-V2:big:davidv2")
            end,
        },
    }
})
end)

RegisterNetEvent("big:davidv2:openUI", function(cashRollCount)
    print("big:davidv2 event triggered.") 
    SendNUIMessage({
        action = "open",
        cashRollCount = cashRollCount
    })
    SetNuiFocus(true, true)
    CamCreate(vector4(-116.74, 6453.34, 30.39, 229.2))
end)

RegisterNUICallback("buyItem", function(data, cb)
    local itemName = data.itemName
    local total = data.totalPrice or data.price or 0
    local amount = data.amount or 1
    local unit = data.unitPrice or (amount > 0 and math.floor(total / amount) or total)

    TriggerServerEvent("big:buyItem", itemName, total, amount, unit)
    TriggerEvent("exitbigdavidv2")
    if cb then cb({ ok = true }) end
end)

RegisterNUICallback("sellItem", function(data, cb)
    local itemId = data.itemId
    local itemName = data.itemName
    local unitPrice = data.unitPrice or data.unitOffer or 0
    local amount = data.amount or 1
    local total = data.totalPrice or (unitPrice * amount)
    local giveItem = data.giveItem or 'cash_roll'
    local giveAmount = data.giveAmount or total

    TriggerServerEvent("big:sellItem", itemId, itemName, unitPrice, amount, total, giveItem, giveAmount)
    TriggerEvent("exitbigdavidv2")
    if cb then cb({ ok = true }) end
end)

RegisterNUICallback("cancel", function(data, cb)
    TriggerEvent("exitbigdavidv2")
    if cb then cb({ ok = true }) end
end)

RegisterKeyMapping('exitbigdavidv2', 'Exit Big David', 'keyboard', 'Escape')

RegisterNetEvent("exitbigdavidv2", function()
    SetNuiFocus(false, false)
    DestroyCamera()
end)