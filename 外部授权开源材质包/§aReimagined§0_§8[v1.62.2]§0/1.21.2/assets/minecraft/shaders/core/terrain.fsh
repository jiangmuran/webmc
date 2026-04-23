#version 150

#moj_import <minecraft:fog.glsl>

uniform sampler2D Sampler0;

uniform vec4 ColorModulator;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in float vertexDistance;
in vec4 vertexColor;
in vec4 lightColor;
in vec2 texCoord0;

out vec4 fragColor;

void main() {
    vec4 color = texture(Sampler0, texCoord0);
    ivec4 icol = ivec4(round(texelFetch(Sampler0, ivec2(texCoord0 * textureSize(Sampler0, 0)), 0) * 255));

    switch (icol.a) {
        case 252: break;
        case 253: color *= vertexColor; break;
        default: color *= lightColor * vertexColor; break;
    }
    color *= ColorModulator;

#ifdef ALPHA_CUTOUT
    if (color.a < ALPHA_CUTOUT) discard;
#endif
    fragColor = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);
}
