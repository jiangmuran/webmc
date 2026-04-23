#version 330

in vec4 Position;

uniform mat4 ProjMat;
uniform vec2 OutSize;

out vec2 texCoord;
out vec2 oneTexel;

// moj_import doesn't work in post-process shaders ;_; Felix pls fix
#define FPRECISION 4000000.0
#define FPRECISION_L 400000.0
#define PROJNEAR 0.05
#define PROJFAR 1024.0
#define PI 3.1415926535897932
#define FUDGE 32.0

vec2 get_control(int index, vec2 screenSize) {
    return vec2(float(index) + 0.5, 0.5) / screenSize;
}

vec3 encode_int(int i) {
    int s = int(i < 0) * 128;
    i = abs(i);
    int r = i % 256;
    i = i / 256;
    int g = i % 256;
    i = i / 256;
    int b = i % 128;
    return vec3(float(r) / 255.0, float(g) / 255.0, float(b + s) / 255.0);
}

int decode_int(vec3 ivec) {
    ivec *= 255.0;
    int s = ivec.b >= 128.0 ? -1 : 1;
    return s * (int(ivec.r) + int(ivec.g) * 256 + (int(ivec.b) - 64 + s * 64) * 256 * 256);
}

vec3 encode_float(float f) {
    return encode_int(int(f * FPRECISION));
}

float decode_float(vec3 vec) {
    return decode_int(vec) / FPRECISION;
}

float luma(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main(){
    vec4 outPos = ProjMat * vec4(Position.xy, 0.0, 1.0);
    gl_Position = vec4(outPos.xy, 0.2, 1.0);
    texCoord = outPos.xy * 0.5 + 0.5;
    oneTexel = 1.0 / OutSize;
}
