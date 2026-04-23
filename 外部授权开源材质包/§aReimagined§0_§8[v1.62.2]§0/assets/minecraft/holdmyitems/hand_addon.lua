local l = (context.bl and 1) or -1
local player = context.player
local item = context.item
local matrices = context.matrices
local mainhand = context.mainHand

global.pitchAngle = 0.0;
global.pitchAngleO = 0.0;
global.yawAngle = 0.0;
global.yawAngleO = 0.0;

local ptAngle = (mainHand and pitchAngle) or pitchAngleO
local ywAngle = (mainHand and yawAngle) or yawAngleO

local buckets = {
    "minecraft:bucket",
    "minecraft:water_bucket",
    "minecraft:lava_bucket",
    "minecraft:milk_bucket",
    "minecraft:powder_snow_bucket",
    "minecraft:axolotl_bucket",
    "minecraft:cod_bucket",
    "minecraft:pufferfish_bucket",
    "minecraft:salmon_bucket",
    "minecraft:tropical_fish_bucket",
    "minecraft:tadpole_bucket"
    
    
}

for _, id in ipairs(buckets) do
    if I:isOf(item, Items:get(id))
    and not (P:isUsingItem(player) and I:isOf(item, Items:get("minecraft:milk_bucket"))) then
        M:moveY(matrices, 0.4)
        M:moveZ(matrices, -0.05)
    end
end
