local QBCore = exports['qb-core']:GetCoreObject()

RegisterServerEvent("big:buyItem", function(itemName, totalPrice, amount, unitPrice)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player then return end

    local qty = tonumber(amount) or 1
    local price = tonumber(totalPrice) or (tonumber(unitPrice) and tonumber(unitPrice) * qty) or 0

    if price > 0 and Player.Functions.RemoveItem("cash_roll", price) then
        Player.Functions.AddItem(itemName, qty)
        TriggerClientEvent("QBCore:Notify", src, "تم شراء " .. itemName .. " x" .. qty .. " بنجاح!", "success")
    else
        TriggerClientEvent("QBCore:Notify", src, "لا تملك ما يكفي من النقود!", "error")
    end
end)

RegisterServerEvent("big:sellItem", function(itemId, itemName, unitPrice, amount, totalPrice, giveItem, giveAmount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player then return end

    local qty = tonumber(amount) or 1
    local total = tonumber(totalPrice) or (tonumber(unitPrice) and tonumber(unitPrice) * qty) or 0
    local invItem = Player.Functions.GetItemByName(itemId)
    local have = invItem and invItem.amount or 0

    if have >= qty then
        if Player.Functions.RemoveItem(itemId, qty) then
            local give = tonumber(giveAmount) or total
            if give > 0 then
                Player.Functions.AddItem(giveItem or 'cash_roll', give)
            end
            TriggerClientEvent("QBCore:Notify", src, "تم بيع " .. itemName .. " x" .. qty .. " مقابل " .. give .. "!", "success")
        else
            TriggerClientEvent("QBCore:Notify", src, "فشل في إزالة العناصر من الحقيبة", "error")
        end
    else
        TriggerClientEvent("QBCore:Notify", src, "ليس لديك الكمية المطلوبة للبيع.", "error")
    end
end)

RegisterNetEvent("CA-BigDavid-V2:big:davidv2", function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    if not Player then
        print("Player not found!")
        return
    end

    local cashRollCount = Player.Functions.GetItemByName("cash_roll")
    local count = cashRollCount ~= nil and cashRollCount.amount or 0

    TriggerClientEvent("big:davidv2:openUI", src, count)
end)