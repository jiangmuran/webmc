global.axolotl_anim = 0.001;
global.pufferfish_anim = 0.001;
global.salmon_anim = 0.001;
global.cod_anim = 0.001;
global.tadpole_anim = 0.001;
global.liquid_anim = 0.001;
global.tropical_fish_anim = 0.001;

local lb = (context.bl and 1) or -1
local player = context.player
local item = context.item
local matrices = context.matrices
local mainHand = context.mainHand

global.yawAngle = 0;
global.yawAngleO = 0;
global.pitchAngle = 0;
global.pitchAngleO = 0;

local ptAngle = (mainHand and pitchAngle) or pitchAngleO
local ywAngle = (mainHand and yawAngle) or yawAngleO

local buckets = {
    "minecraft:bucket",
    "minecraft:water_bucket",
    "minecraft:lava_bucket",
    "minecraft:powder_snow_bucket",
    "minecraft:cod_bucket",
    "minecraft:salmon_bucket",
    "minecraft:tropical_fish_bucket",
    "minecraft:tadpole_bucket",
    "minecraft:axolotl_bucket",
    "minecraft:pufferfish_bucket"

}

for _, feesh in ipairs(buckets) do
    if I:isOf(item, Items:get(feesh))
then
        M:moveY(matrices, 0.15)
        M:rotateY(matrices, 0)
        M:moveZ(matrices, -0.25)
        M:moveX(matrices, -0.06 *lb)
        M:rotateZ(matrices, 20 * lb)
        M:rotateX(matrices, 20)
        M:rotateX(matrices, M:clamp(P:getPitch(context.player) / -2.5, -20, 90) - ptAngle + ywAngle * 0.5, 0, -0.05, 0)
        return
    end
end

if I:isOf(item, Items:get("minecraft:milk_bucket")) then
    if P:isUsingItem(player) then
        -- Quando ESTIVER usando (Beber)
        M:rotateY(matrices, 10 * lb)
        M:rotateX(matrices, 0)
        M:rotateZ(matrices, 180)
        M:moveZ(matrices, -0.1)
        M:moveY(matrices, -0.3)
    else
        -- Quando NÃO estiver usando (Mesma posição dos outros baldes)
        M:moveY(matrices, 0.15)
        M:rotateY(matrices, 0)
        M:moveZ(matrices, -0.25)
        M:moveX(matrices, -0.06 * lb)
        M:rotateZ(matrices, 20 * lb)
        M:rotateX(matrices, 20)
        M:rotateX(matrices, M:clamp(P:getPitch(context.player) / -2.5, -20, 90) - ptAngle + ywAngle * 0.5, 0, -0.05, 0)
    end
    return
end