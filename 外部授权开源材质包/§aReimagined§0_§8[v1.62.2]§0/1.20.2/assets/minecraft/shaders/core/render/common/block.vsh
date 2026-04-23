#version 330

#moj_import <utils.glsl>
#moj_import <light.glsl>
#moj_import <fog.glsl>

in vec3 Position;
in vec4 Color;
in vec2 UV0;
in ivec2 UV2;
in vec3 Normal;

uniform sampler2D Sampler0;
uniform sampler2D Sampler2;
uniform float GameTime;

uniform mat4 ModelViewMat;
uniform mat4 ProjMat;
uniform vec3 ChunkOffset;
uniform int FogShape;
uniform float FogStart;
uniform float FogEnd;

out float vertexDistance;
out vec4 vertexColor;
out vec4 tintColor;
out vec4 lightColor;
out vec2 texCoord0;
out vec2 texCoord2;
out vec4 normal;
out vec4 glpos;

void main() {
    vec3 pos = Position + ChunkOffset;
    vertexDistance = fog_distance(ModelViewMat, pos, FogShape);
    texCoord0 = UV0;
    texCoord2 = vec2(UV2);
    if (Color.r == Color.g && Color.g == Color.b) {
        vertexColor = Color;
        tintColor = vec4(1.0);
    }
    else {
        vertexColor = vec4(1.0);
        tintColor = Color;
    }
    lightColor = vec4(1.0);
    normal = ProjMat * ModelViewMat * vec4(Normal, 0.0);

    if (!is_gui(ProjMat)) {
#ifdef ENABLE_WAVING
        if (!is_hand(FogStart, FogEnd)) {
            vec3 offset = vec3(0.0,0.0,0.0);
            float animation = GameTime * 2048.0;
            float animation2 = GameTime * PI;
            float xx = Position.x / 2 * PI;
            float yy = Position.y / 2 * PI;
            float zz = Position.z / 2 * PI;
            vec4 probe = inverse(ProjMat) * vec4(0.0, 0.0, 1.0, 1.0);
            probe.xyz /= probe.w;
            float far = length(probe.xyz);
            int alpha = int(round(texture(Sampler0, UV0).a * 255.0));
            float cave = smoothstep(222.0, 128.0, float(texCoord2.y));
            switch (alpha) {

#ifdef ENABLE_WAVING_FOLIAGE
                //waving foliage
                case ALPHA_FOLIAGE:
                case ALPHA_FOLIAGE_T:
                    if (get_dimension(Sampler2) == DIM_OVER) {
                        float magnitude = sin(animation2 * 136 + Position.z * PI / 4.0 + Position.y * PI / 4.0) * 0.04 + 0.04;
                        float d0 = sin(animation2 * 636);
                        float d1 = sin(animation2 * 446);
                        float d2 = sin(animation2 * 570);
                        vec3 wave;
                        wave.x = sin(animation2 * 316 + d0 + d1 - Position.x * PI / 4.0 + Position.z * PI / 4.0 + Position.y * PI / 4.0) * magnitude;
                        wave.z = sin(animation2 * 1120 + d1 + d2 + Position.x * PI / 4.0 - Position.z * PI / 4.0 + Position.y * PI / 4.0) * magnitude;
                        wave.y = sin(animation2 * 70 + d2 + d0 + Position.z * PI / 4.0 + Position.y * PI / 4.0 - Position.y * PI / 4.0) * magnitude;
                        offset.x += wave.x * 2.0 + wave.y * 1.0;
                        offset.z += wave.z * 0.75;
                        offset *= (1.0 - cave) * 0.4;
                    } 
                    break;
#endif

#ifdef ENABLE_WAVING_FLUID
                //waving liquid
                case ALPHA_WATER: //water
                    animation = GameTime * 512;
                    if (!(mod(Position.y + 0.001, 1.0) < 0.002)) {
                        offset.y += 1.0 / 96.0 * sin((Position.z * PI / 4.0 + animation2 * 700)) * 1.0 * (1.0 - smoothstep(0.0, 1.0, vertexDistance / far));
                        offset.y += 1.0 / 96.0 * cos((Position.z * PI / 8.0 + Position.x * PI / 4.0 + animation2 * 400) + PI / 13.0) * 1.2 * (1.0 - smoothstep(0.1, 1.0, vertexDistance / far));
                        offset.y += 1.0 / 96.0 * sin(sin(animation2 * 216 + Position.z * PI / 8.0 - Position.x * PI / 4.0) * 6.0 - PI / 7.0) * 0.75 * (1.0 - smoothstep(0.0, 0.3, vertexDistance / far));
                        offset.y += 1.0 / 96.0 * cos(sin(animation2 * 176 + Position.z * PI / 4.0 + Position.x * PI / 8.0) * 5.0 + PI / 5.0) * 0.75 * (1.0 - smoothstep(0.0, 0.9, vertexDistance / far));
                    }
                    break;

                case ALPHA_LAVA: //lava
                    animation = GameTime * 128;
                    if (!(mod(Position.y + 0.001, 1.0) < 0.002)) {
                        offset.y += 0.02 * sin((Position.z * PI / 4.0 + animation2 * 700)) * 1.0 * (1.0 - smoothstep(0.0, 1.0, vertexDistance / far));
                        offset.y += 0.02 * cos((Position.z * PI / 8.0 + Position.x * PI / 4.0 + animation2 * 400) + PI / 13.0) * 1.2 * (1.0 - smoothstep(0.1, 1.0, vertexDistance / far));
                        offset.y += 0.02 * sin((Position.z * PI / 8.0 - Position.x * PI / 2.0 - animation2 * 900) - PI / 7.0) * 0.75 * (1.0 - smoothstep(0.0, 0.3, vertexDistance / far));
                        offset.y += 0.02 * cos((Position.z * PI * 7.0 + Position.x * PI / 2.0 - animation2 * 870) + PI / 5.0) * 0.75 * (1.0 - smoothstep(0.0, 0.9, vertexDistance / far));
                    }
                    break;
#endif

#ifdef ENABLE_WAVING_LANTERN
                case ALPHA_LANTERN: //hanging lanterns
                {
                    vec3 relativePos = fract(Position);
                    if (relativePos.y > 0.001) {
                        animation = GameTime * 1000.0 + dot(floor(Position), vec3(1.0)) * 1234.0;
                        vec3 newDown = normalize(vec3(
                            sin(animation * PHI) * 0.015,
                            -1.0,
                            sin(animation) * 0.015
                        ));
                        vec3 axis = normalize(cross(vec3(0, 1, 0), newDown));
                        float cosAngle = newDown.y;
                        vec4 quat = vec4(sqrt(1 - cosAngle * cosAngle) * axis, cosAngle);
                        vec3 newPos = quaternionRotate(relativePos - vec3(0.5, 1.0, 0.5), quat) + vec3(0.5, 1.0, 0.5);
                        offset = newPos - relativePos;
                    }
                    break;
                }
#endif

#ifdef ENABLE_WAVING_PORTAL
                case ALPHA_PORTAL: // portal
                {
                    animation = GameTime * 4000.0;
                    float m0 = distance(Position.xz, vec2(8.0, 8.0)) * 10.0;
                    vec3 absNormal = abs(Normal);
                    if (absNormal.z > absNormal.x && absNormal.z > absNormal.y) offset.z = (sin(Position.x * PI / 2.0 + animation) + cos(m0 + animation) * 0.65) / 24.0; // North/South wobble
                    if (absNormal.x > absNormal.z && absNormal.x > absNormal.y) offset.x = (cos(Position.z * PI / 2.0 + animation) + sin(m0 + animation) * 0.65) / 24.0; // East / West wobble
                    break;
                }
#endif

                default:
                    break;
            }
            pos += offset;
        }
#endif
        lightColor = minecraft_sample_lightmap_of(Sampler2, UV2);
    }

    gl_Position = ProjMat * ModelViewMat * vec4(pos, 1.0);
    glpos = gl_Position;
    vertexDistance = fog_distance(ModelViewMat, pos, FogShape);
}