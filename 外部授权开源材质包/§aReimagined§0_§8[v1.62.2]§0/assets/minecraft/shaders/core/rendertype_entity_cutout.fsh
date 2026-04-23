#version 150
#moj_import <fog.glsl>

uniform sampler2D Sampler0;

uniform vec4 ColorModulator;
uniform float FogStart;
uniform float FogEnd;
uniform vec4 FogColor;

in float vertexDistance;
in vec4 vertexColor;
in vec4 lightMapColor;
in vec4 overlayColor;
in vec2 texCoord0;

out vec4 fragColor;

void main() {
    vec4 tex = texture(Sampler0, texCoord0);
    if (tex.a < 0.1) discard;

    int a = int(round(tex.a * 255.0));

    if (a== 252 || a== 253) {
        fragColor = tex;
        return;
    }

    vec4 color = tex * vertexColor * ColorModulator;
    color.rgb = mix(overlayColor.rgb, color.rgb, overlayColor.a);

    if (a == 250) {
        vec3 lifted = mix(lightMapColor.rgb, vec3(1.0), 1.0);
        color.rgb *= lifted;
        color.a   *= lightMapColor.a;
        fragColor  = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);
        return;
    }

    color *= lightMapColor;
    fragColor = linear_fog(color, vertexDistance, FogStart, FogEnd, FogColor);
}
