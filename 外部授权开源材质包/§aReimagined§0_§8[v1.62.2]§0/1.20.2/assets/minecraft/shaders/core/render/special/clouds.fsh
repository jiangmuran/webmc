#version 330
#define FSH

#moj_import <fog.glsl>

uniform sampler2D Sampler0;

uniform vec4 ColorModulator;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in vec2 texCoord0;
in float vertexDistance;
in vec4 vertexColor;
in vec3 normal;
in float yval;
in float far;

out vec4 fragColor;

void main() {
    vec4 color = texture(Sampler0, texCoord0);
    color *= vertexColor * ColorModulator;
    color.rgb = mix(color.rgb, FogColor.rgb * FogColor.rgb, 0.5 * (1.0 - yval));
    if (color.a < 0.1) {
        discard;
    }
    fragColor = linear_fog_translucent(color, vertexDistance, FogStart, FogStart < -7.9 ? far / 4.0 : FogEnd, FogColor);
}