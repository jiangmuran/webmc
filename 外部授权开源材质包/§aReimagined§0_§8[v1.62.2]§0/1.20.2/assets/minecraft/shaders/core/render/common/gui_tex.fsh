#version 330
#define FSH

#define POSITION_TEX
#define EXPECTED_TEXSIZE vec2(80)

#moj_import <utils.glsl>

uniform sampler2D Sampler0;

uniform vec4 ColorModulator;
uniform vec2 ScreenSize;
uniform mat4 ModelViewMat;
uniform mat4 ProjMat;
uniform mat3 IViewRotMat;
uniform vec4 FogColor;
uniform float FogStart;
uniform float FogEnd;
uniform float GameTime;

in vec4 vertexColor;
in mat4 ProjInv;
in vec2 texCoord0;
in vec2 progress;
in float isNeg;
in vec2 ScrSize;
in float isSun;
in vec4 pos1;
in vec4 pos2;
in vec4 pos3;
in vec3 position;

out vec4 fragColor;

#define PRECISIONSCALE 1000.0
#define MAGICSUNSIZE 3.0

#define END_COL_STAR vec3(1.0, 0.4, 0.9) * 4.0
#define END_COL_FOG vec3(1.0, 0.0, 0.9) * 0.075
#define END_COL_FOG2 vec3(0.5, 0.4, 1.0) * 0.15

// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
int hash(int x) {
    x += ( x << 10 );
    x ^= ( x >>  6 );
    x += ( x <<  3 );
    x ^= ( x >> 11 );
    x += ( x << 15 );
    return x;
}

int noise(ivec2 v, int seed) {
    return hash(v.x ^ hash(v.y + seed) ^ seed);
}

float valNoise( vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( hash21( i + vec2(0.0,0.0) ), 
                     hash21( i + vec2(1.0,0.0) ), u.x),
                mix( hash21( i + vec2(0.0,1.0) ), 
                     hash21( i + vec2(1.0,1.0) ), u.x), u.y);
}

float gNoise( vec3 p ) {
    vec3 i = floor( p );
    vec3 f = fract( p );

    // cubic interpolant
    vec3 u = f*f*(3.0-2.0*f);   

    return mix( mix( mix( dot( hash33( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash33( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash33( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash33( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash33( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash33( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash33( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash33( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

vec3 starField(vec3 pos)
{
    vec3 col = 1.0 - vec3(valNoise(15.0 * (pos.xy + 0.05)), valNoise(20.0 * pos.yz), valNoise(25.0 * (pos.xz - 0.06)));
    col *= vec3(0.4, 0.8, 1.0);
    col = mix(col, vec3(1.0), 0.5);
    return col * smoothstep(0.5, 0.6, 1.5 * gNoise(128.0 * pos));
}

float cloudMask(vec2 uv, float time)
{
    uv += sin(time*.001)*20.;
    float shapeMask = smoothstep(.4,.2, valNoise(8.*uv));
    float cloudDetail = (1.-shapeMask) * valNoise(20.*uv) * .5;
    return shapeMask + cloudDetail;
}

void main() {
    bool gui = is_gui(ProjMat);
    bool hand = is_hand(FogStart, FogEnd);
    vec4 color = texture(Sampler0, texCoord0);

    if (!gui && !hand) {
        int index = in_control(gl_FragCoord.xy, ScreenSize.x);
        
        // currently in a control/message pixel
        if(index != -1) {
            
            if (isSun > 0.75) {
                // store the sun position in eye space indices [0,2]
                if (index >= CTL_SUNDIRX && index <= CTL_SUNDIRZ) {
                    vec3 p1 = pos1.rgb / pos1.a;
                    vec3 p2 = pos2.rgb / pos2.a;
                    vec3 p3 = pos3.rgb / pos3.a;
                    vec4 sunDir = mat4(IViewRotMat) * vec4(normalize(p1 + p3 + normalize(p2 - p1)), 0.0);
                    color = vec4(encode_float(sunDir[index]), 1.0);
                }
                // store sun alpha (RainStrength)
                else if (index == CTL_RAINSTRENGTH) {
                    color = vec4(1.0 - color.a, 0.0, 0.0, 1.0);
                } 
                else {
                    discard;
                }
            }
            else if (isSun < 0.25) {
                //store fake sun pos
                if (index >= CTL_SUNDIRX && index <= CTL_SUNDIRZ) {
                    vec4 sunDir = vec4(0.0, -1.0, 0.0, 0.0);
                    color = vec4(encode_float(sunDir[index]), 1.0);
                }
                // store ProjMat in control pixels
                else if (index >= CTL_PMAT10 && index <= CTL_PMAT32) {
                    int c = (index - 5) / 4;
                    int r = (index - 5) - c * 4;
                    c = (c == 0 && r == 1) ? c : c + 1;
                    color = vec4(encode_float(ProjMat[c][r]), 1.0);
                }

                // store ModelViewMat in control pixels
                else if (index >= CTL_MVMAT00 && index <= CTL_MVMAT22) {
                    int c = (index - 16) / 3;
                    int r = (index - 16) - c * 3;
                    color = vec4(encode_float(ModelViewMat[c][r]), 1.0);
                }

                // store ProjMat[0][0] and ProjMat[1][1] in control pixels
                else if (index == CTL_ATAN_PMAT00 || index == CTL_ATAN_PMAT11) {
                    color = vec4(encode_float(atan(ProjMat[index - 3][index - 3])), 1.0);
                } 

                // store FogColor in control pixels
                else if (index == CTL_FOGCOLOR) {
                    vec4 fc = FogColor;
                    color = vec4(fc.rgb, 1.0);
                } 

                // store FogColor in control pixels as sky
                else if (index == CTL_SKYCOL) {
                    vec4 fc = FogColor;
                    color = vec4(fc.rgb, 1.0);
                } 

                // store FogStart
                else if (index == CTL_FOGSTART) {
                    color = vec4(encode_int(int(round(FogStart))), 1.0);
                }

                // store FogEnd
                else if (index == CTL_FOGEND) {
                    color = vec4(encode_int(int(round(FogEnd))), 1.0);
                } 

                // store Dimension
                else if (index == CTL_DIM) {
                    color = vec4(vec3(float(DIM_END) / 255.0), 1.0);
                }

                // store FarClip
                else if (index == CTL_FARCLIP) {
                    color = vec4(encode_int(int(round(get_far(ProjMat)))), 1.0);
                }

                // blackout remaining control pixels so other shaders can write to them (by default, all pixels are FogColor)
                else {
                    color = vec4(0.0, 0.0, 0.0, 1.0);
                }
            }
            else {
                discard;
            }
        }
        
        // calculate screen space UV of the sun since it was transformed to cover the entire screen in vsh so texCoord0 no longer works
        else if(isSun > 0.75) {
            vec3 p1 = pos1.rgb / pos1.a;
            vec3 p2 = pos2.rgb / pos2.a;
            vec3 p3 = pos3.rgb / pos3.a;
            vec3 center = (p1 + p3 + normalize(p2 - p1)) / (2 * PRECISIONSCALE); // scale down vector to reduce fp issues

            vec4 tmp = (ProjInv * vec4(2.0 * (gl_FragCoord.xy / ScreenSize - 0.5), 1.0, 1.0));
            vec3 planepos = tmp.xyz / tmp.w;
            float lookingat = dot(planepos, center);
            planepos = planepos / lookingat;
            vec2 uv = vec2(dot(p2 - p1, planepos - center), dot(p3 - p2, planepos - center));
            uv = uv / PRECISIONSCALE * MAGICSUNSIZE + vec2(0.5);

            // only draw one sun lol
            if (lookingat > 0.0 && all(greaterThanEqual(uv, vec2(0.0))) && all(lessThanEqual(uv, vec2(1.0)))) {
                color = texture(Sampler0, uv) * ColorModulator * vertexColor;
            } 
            else {
                discard;
            }
        } 

        else if (isSun > 0.25) { // moon
            color *= ColorModulator * vertexColor;
        }

        else { // end sky
            color *= ColorModulator * vertexColor;
            vec3 adjustedpos = normalize(round(position * 2.0) / 2.0);
            float anim1 = GameTime * PI * 80.0;
            float anim2 = GameTime * PI * 10.0;
            vec3 starcol = starField(adjustedpos) * END_COL_STAR;
            float horizon = (1.0 - abs(dot(normalize(position), vec3(0.0, 1.0, 0.0))));
            color.rgb *= 0.5;
            color.rgb += starcol * mix(vec3(valNoise(adjustedpos.xy * 5.0 + sin(anim1) * 2.0) * valNoise(adjustedpos.yz * 5.0 + sin(anim1) * 2.0)), vec3(1.0), 0.05);
            color.rgb += vec3(valNoise(adjustedpos.xy * 2.0 + sin(anim2) * 2.0) * valNoise(adjustedpos.yz * 2.0 + sin(anim2) * 2.0)) * END_COL_FOG2 * horizon;
            color.rgb += vec3(valNoise(adjustedpos.xy + sin(anim2) * 4.0) * valNoise(adjustedpos.yz+ sin(anim2) * 4.0)) * END_COL_FOG * horizon;
        }
    }
    else {
        vec2 uv = texCoord0;
        int fuel = int(round(progress.x/progress.y));
        vec2 atlassize = textureSize(Sampler0, 0);
        if (atlassize.y == 1335 && fuel == clamp(fuel, 0, 14) && ivec2(uv*atlassize).y > 170) {
            uv.y += fuel*83./atlassize.y;
            color = texture(Sampler0, uv);
        }
        if(atlassize == EXPECTED_TEXSIZE) {
            #moj_import <menus-enchanted.glsl>
        }
        color *= ColorModulator * vertexColor;
    }
    
    if (color.a == 0.0) discard;

    fragColor = color;
}