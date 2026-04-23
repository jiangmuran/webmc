#version 330
#moj_import <core-toggles.glsl>

#define PI 3.1415926535897932
#define PHI 1.61803398875
#define NUMCONTROLS 33
#define FPRECISION 4000000.0
#define PROJNEAR 0.05

// Control Map:
#define CTL_SUNDIRX         0
#define CTL_SUNDIRY         1
#define CTL_SUNDIRZ         2
#define CTL_ATAN_PMAT00     3
#define CTL_ATAN_PMAT11     4
#define CTL_PMAT10          5
#define CTL_PMAT01          6
#define CTL_PMAT12          7
#define CTL_PMAT13          8
#define CTL_PMAT20          9
#define CTL_PMAT21          10
#define CTL_PMAT22          11
#define CTL_PMAT23          12
#define CTL_PMAT30          13
#define CTL_PMAT31          14
#define CTL_PMAT32          15
#define CTL_MVMAT00         16
#define CTL_MVMAT01         17
#define CTL_MVMAT02         18
#define CTL_MVMAT10         19
#define CTL_MVMAT11         20
#define CTL_MVMAT12         21
#define CTL_MVMAT20         22
#define CTL_MVMAT21         23
#define CTL_MVMAT22         24
#define CTL_FOGCOLOR        25
#define CTL_FOGSTART        26
#define CTL_FOGEND          27 // also FogLambda
#define CTL_DIM             28
#define CTL_RAINSTRENGTH    29
#define CTL_MISCFLAGS       30 // bit0:underwater
#define CTL_FARCLIP         31
#define CTL_SKYCOL          32

#define DIM_UNKNOWN 0
#define DIM_OVER    1
#define DIM_END     2
#define DIM_NETHER  3

#ifdef FSH
// returns control pixel index or -1 if not control
int in_control(vec2 screenCoord, float screenWidth) {
    float start = floor(screenWidth / 4.0) * 2.0;
    int index = int(screenCoord.x - start) / 2;
    if (screenCoord.y < 1.0 && screenCoord.x > start && int(screenCoord.x) % 2 == 0 && index < NUMCONTROLS) {
        return index;
    }
    return -1;
}

// discards the current pixel if it is control
void discard_control(vec2 screenCoord, float screenWidth) {
    if (in_control(screenCoord, screenWidth) >= 0) {
        discard;
    }
}

// discard but for when ScreenSize is not given
void discard_control_glpos(vec2 screenCoord, vec4 glpos) {
    float screenWidth = round(screenCoord.x * 2.0 / (glpos.x / glpos.w + 1.0));
    discard_control(screenCoord, screenWidth);
}
#endif

// get screen coordinates of a particular control index
vec2 get_control(int index, vec2 screenSize) {
    return vec2(floor(screenSize.x / 4.0) * 2.0 + float(index) * 2.0 + 0.5, 0.5) / screenSize;
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
    return encode_int(int(round(f * FPRECISION)));
}

float decode_float(vec3 vec) {
    return decode_int(vec) / FPRECISION;
}

// alpha map
#define ALPHA_EMISSIVE_H    252
#define ALPHA_EMISSIVE_L    251
#define ALPHA_LAVA          250
#define ALPHA_LANTERN       249
#define ALPHA_PORTAL        248
#define ALPHA_FOLIAGE       247
#define ALPHA_PLAYER_CTL    234
#define ALPHA_WATER         159
#define ALPHA_CUTOUT_CUTOFF 49.5
#define ALPHA_CUTOFF        21.5
#define ALPHA_FOLIAGE_T     21
#define ALPHA_0             0

// Does all the work for making things emissive.

#ifdef ENABLE_EMISSIVE
vec4 make_emissive(vec4 inputColor, vec4 vertexColor, vec4 lightColor, float vertexDistance, float inputAlpha) {
	
    // Vertex Distance > 800 generally means an object is in the UI, which we don't want to affect.
	// if (vertexDistance > 800) return inputColor * vertexColor * lightColor; 
	
    vec4 outColor = inputColor * vertexColor * lightColor;

    switch(int(round(inputAlpha)))
    {
        case ALPHA_EMISSIVE_H:
        case ALPHA_LAVA:
        case ALPHA_PORTAL:
            outColor = inputColor;
            break;
        case ALPHA_EMISSIVE_L:
            outColor = inputColor * vertexColor;
            break;
        default:
            break;
    }

	return outColor;

}
#else
vec4 make_emissive(vec4 inputColor, vec4 vertexColor, vec4 lightColor, float vertexDistance, float inputAlpha) {
    return inputColor * vertexColor * lightColor;
}
#endif


// Gets the dimension that an object is in, -1 for The Nether, 0 for The Overworld, 1 for The End.

int get_dimension(sampler2D lightmap) {
	vec4 minLightColor = texelFetch(lightmap, ivec2(0), 0);
	if (minLightColor.r == minLightColor.g && minLightColor.g == minLightColor.b) return DIM_OVER; // Shadows are grayscale in The Overworld
	else if (minLightColor.r > minLightColor.g) return DIM_NETHER; // Shadows are more red in The Nether
	else return DIM_END; // Shadows are slightly green in The End
	
}

// Makes sure transparent things don't become solid and vice versa.
#ifdef FSH
float remap_alpha(float inputAlpha) {
	
	float outFloat = inputAlpha;

    switch(int(round(inputAlpha)))
    {
        case ALPHA_EMISSIVE_H:
        case ALPHA_EMISSIVE_L:
        case ALPHA_LAVA:
        case ALPHA_LANTERN:
        case ALPHA_0:
        case ALPHA_FOLIAGE:
            outFloat = 255.0;
            break;
        case ALPHA_PORTAL:
        case ALPHA_WATER:
            outFloat = 200.0;
            break;
        case ALPHA_FOLIAGE_T:
            discard;
        default:
            break;
    }

	return outFloat;
	
}
#endif

vec4 quaternion_multiply(vec4 a, vec4 b) {
    return vec4(
        a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x,
        -a.x * b.z + a.y * b.w + a.z * b.x + a.w * b.y,
        a.x * b.y - a.y * b.x + a.z * b.w + a.w * b.z,
        -a.x * b.x - a.y * b.y - a.z * b.z + a.w * b.w
    );
}
vec3 quaternionRotate(vec3 pos, vec4 q) {
    vec4 qInv = vec4(-q.xyz, q.w);
    return quaternion_multiply(quaternion_multiply(q, vec4(pos, 0)), qInv).xyz;
}

bool is_hand(float fogs, float foge) { // also includes panorama
    return fogs > foge;
}

bool not_pickup(mat4 mvm) {
    return true;
    // return mvm[0][0] == 1.0 && mvm[1][1] == 1.0 && mvm[2][2] == 1.0 && mvm[3][3] == 1.0 && mvm[0][2] == 0.0 && mvm[2][0] == 0.0;
}

bool not_pickup2(mat4 mvm) {
    return true;
    // return mvm[0][1] == 0.0 && mvm[0][2] == 0.0 && mvm[0][3] == 0.0 && 
    //        mvm[1][0] == 0.0 && mvm[1][2] == 0.0 && mvm[1][3] == 0.0 && 
    //        mvm[2][0] == 0.0 && mvm[2][1] == 0.0 && mvm[2][3] == 0.0 && 
    //        mvm[3][0] == 0.0 && mvm[3][1] == 0.0 && mvm[3][2] == 0.0 && mvm[3][3] == 1.0;
}

float get_fov(mat4 ProjMat) {
    return atan(1.0, ProjMat[1][1]) * 360.0 / PI;
}

bool is_gui(mat4 ProjMat) {
    return ProjMat[2][3] == 0.0;
}

float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

vec3 hash13(float p)
{
   vec3 p3 = fract(vec3(p, p, p) * vec3(0.1031, 0.1030, 0.0973));
   p3 += dot(p3, p3.yzx + 33.33);
   return fract((p3.xxy + p3.yzz) * p3.zyx);
}

vec4 hash14(float p)
{
	vec4 p4 = fract(vec4(p, p, p, p) * vec4(0.1031, 0.1030, 0.0973, 0.1099));
    p4 += dot(p4, p4.wzxy + 33.33);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}


float hash21(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec3 hash33(vec3 p3) {
	p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float get_far(mat4 ProjMat) {
    vec4 probe = inverse(ProjMat) * vec4(0.0, 0.0, 1.0, 1.0);
    probe.xyz /= probe.w;
    return length(probe);
}