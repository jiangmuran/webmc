#version 330
#define FSH

#moj_import <utils.glsl>

uniform mat4 ProjMat;
uniform sampler2D Sampler0;

uniform vec4 ColorModulator;

in vec4 vertexColor;
in vec4 lightColor;
in vec2 texCoord0;
in vec4 glpos;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    if (!gui) discard_control_glpos(gl_FragCoord.xy, glpos);

    fragColor = texture(Sampler0, texCoord0) * vertexColor * lightColor * ColorModulator;
}