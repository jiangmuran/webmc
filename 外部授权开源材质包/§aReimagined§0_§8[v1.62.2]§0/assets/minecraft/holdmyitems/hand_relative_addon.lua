local l = (context.bl and 1) or -1
local player = context.player
local item = context.item
local matrices = context.matrices
local mainHand = context.mainHand


if P:isUsingItem(player) and I:isOf(item, Items:get("minecraft:milk_bucket")) then
M:moveX(matrices, 0.0 * l)
M:moveZ(matrices, 0.2)
M:moveY(matrices, -0.185)
M:rotateX(matrices, 0.5)
    return
end

--I hate sapling 
--I hate sapling
--I hate sapling
--I hate sapling
--/jk but I hate what you made me do aaaaaaaaa
global.axolotl_anim = 0.001;
global.pufferfish_anim = 0.001;
global.salmon_anim = 0.001;
global.cod_anim = 0.001;
global.tadpole_anim = 0.001;
global.liquid_anim = 0.001;
global.tropical_fish_anim = 0.001;