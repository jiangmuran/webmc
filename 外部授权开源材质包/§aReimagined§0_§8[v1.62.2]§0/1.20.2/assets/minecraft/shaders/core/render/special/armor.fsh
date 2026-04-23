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
in vec4 tintColor;
in vec4 lightColor;
in vec4 overlayColor;
in vec2 texCoord0;
in vec4 normal;
in vec4 glpos;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    bool hand = is_hand(FogStart, FogEnd);
    if (!gui && !hand) discard_control_glpos(gl_FragCoord.xy, glpos);

    vec4 color = texture(Sampler0, texCoord0);
    if (color.a < ALPHA_CUTOFF / 255.0) discard;
    float alpha = textureLod(Sampler0, texCoord0, -4).a * 255.0;
    color.rgb *= ColorModulator.rgb * tintColor.rgb;
    color.rgb = mix(overlayColor.rgb, color.rgb, overlayColor.a);
    color = make_emissive(color, vertexColor, lightColor, vertexDistance, alpha);
    color.a = remap_alpha(alpha) / 255.0 * ColorModulator.a * tintColor.a;
    float RealFogEnd = fog_end_comp(FogColor, FogStart, FogEnd, get_far(ProjMat) / 8.0, get_dimension(Sampler2));
    fragColor = linear_fog(color, vertexDistance, FogStart, RealFogEnd, FogColor);
}