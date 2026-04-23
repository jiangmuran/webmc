#version 330
#define FSH

#moj_import <utils.glsl>
#moj_import <fog.glsl>

uniform mat4 ProjMat;
uniform sampler2D Sampler2;

uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in float vertexDistance;
flat in vec4 vertexColor;
in vec4 glpos;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    bool hand = is_hand(FogStart, FogEnd);
    if (!gui && !hand) discard_control_glpos(gl_FragCoord.xy, glpos);

    float RealFogEnd = fog_end_comp(FogColor, FogStart, FogEnd, get_far(ProjMat) / 8.0, get_dimension(Sampler2));
    fragColor = linear_fog(vertexColor, vertexDistance, FogStart, RealFogEnd, FogColor);
}