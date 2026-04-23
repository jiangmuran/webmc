#version 150
#define FSH

#moj_import <utils.glsl>
#moj_import <fog.glsl>

uniform mat4 ProjMat;
uniform vec4 ColorModulator;
uniform vec2 ScreenSize;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in vec4 vertexColor;
in float vertexDistance;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    if (!gui) {
        discard_control(gl_FragCoord.xy, ScreenSize.x);
    }

    vec4 color = vertexColor;
    if (color.a == 0.0) discard;
    color = color * ColorModulator;
    fragColor = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);
}