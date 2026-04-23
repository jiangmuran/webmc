#version 330
#define FSH

#moj_import <utils.glsl>

uniform mat4 ProjMat;
uniform vec4 ColorModulator;

in vec4 vertexColor;
in vec4 glpos;

out vec4 fragColor;

void main() {
    bool gui = is_gui(ProjMat);
    if (!gui) discard_control_glpos(gl_FragCoord.xy, glpos);

    vec4 color = vertexColor;
    if (color.a < 0.1) discard;
    fragColor = color * ColorModulator;
}
