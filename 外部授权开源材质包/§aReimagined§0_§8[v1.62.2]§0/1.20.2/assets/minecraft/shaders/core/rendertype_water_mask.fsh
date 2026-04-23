#version 330
#define FSH

#moj_import <utils.glsl>

uniform vec4 ColorModulator;

in vec4 glpos;

out vec4 fragColor;

void main() {
    discard_control_glpos(gl_FragCoord.xy, glpos);
    fragColor = ColorModulator;
}
