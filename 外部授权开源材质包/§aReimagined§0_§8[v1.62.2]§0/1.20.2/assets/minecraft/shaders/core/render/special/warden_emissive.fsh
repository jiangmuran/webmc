#version 330
#define FSH

#moj_import <utils.glsl>
#moj_import <fog.glsl>

uniform mat4 ProjMat;
uniform sampler2D Sampler0;

uniform vec4 ColorModulator;
uniform float FogStart;
uniform float FogEnd;

in float vertexDistance;
in vec4 vertexColor;
in vec4 tintColor;
in vec4 overlayColor;
in vec2 texCoord0;
in vec4 glpos;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    bool hand = is_hand(FogStart, FogEnd);
    if (!gui && !hand) discard_control_glpos(gl_FragCoord.xy, glpos);

    vec4 color = texture(Sampler0, texCoord0);
    if (color.a < 0.1) discard;
    color *= vertexColor * tintColor * ColorModulator;
    color.rgb = mix(overlayColor.rgb, color.rgb, overlayColor.a);
    fragColor = color * linear_fog_fade(vertexDistance, FogStart, FogEnd);
}
