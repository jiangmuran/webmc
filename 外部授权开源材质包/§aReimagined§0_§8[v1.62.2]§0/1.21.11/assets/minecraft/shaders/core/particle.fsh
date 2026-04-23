#version 150

#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:dynamictransforms.glsl>

uniform sampler2D Sampler0;

in float sphericalVertexDistance;
in float cylindricalVertexDistance;
in vec2 texCoord0;
in vec4 vertexColor;
in vec4 lightColor;

out vec4 fragColor;

void main() {
    vec4 color = texture(Sampler0, texCoord0);
    switch (int(round(color.a * 255))) {
        case 252: break;
        case 253: color *= vertexColor; break;
        default: color *= lightColor * vertexColor; break;
    }
    color *= ColorModulator;
    if (color.a < 0.1) discard;
    fragColor = apply_fog(color, sphericalVertexDistance, cylindricalVertexDistance, FogEnvironmentalStart, FogEnvironmentalEnd, FogRenderDistanceStart, FogRenderDistanceEnd, FogColor);
}
