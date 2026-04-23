#version 330
#define FSH

#moj_import <utils.glsl>
#moj_import <fog.glsl>

uniform mat4 ProjMat;
uniform sampler2D Sampler0;
uniform sampler2D Sampler2;

uniform vec4 ColorModulator;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in float vertexDistance;
in vec4 vertexColor;
in vec4 lightColor;
in vec2 texCoord0;
in vec4 glpos;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    bool hand = is_hand(FogStart, FogEnd);
    if (!gui && !hand) discard_control_glpos(gl_FragCoord.xy, glpos);

    vec4 color = texture(Sampler0, texCoord0) * vertexColor * lightColor * ColorModulator;
    if (color.a < 0.1) discard;
    float RealFogEnd = fog_end_comp(FogColor, FogStart, FogEnd, get_far(ProjMat) / 8.0, get_dimension(Sampler2));
    fragColor = linear_fog(color, vertexDistance, FogStart, RealFogEnd, FogColor);
}