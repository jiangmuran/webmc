#version 330

#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:dynamictransforms.glsl>

uniform sampler2D Sampler0;

in float sphericalVertexDistance;
in float cylindricalVertexDistance;
#ifdef PER_FACE_LIGHTING
in vec4 vertexPerFaceColorBack;
in vec4 vertexPerFaceColorFront;
#else
in vec4 vertexColor;
#endif
in vec4 unshadedColor;
in vec4 lightMapColor;
in vec4 overlayColor;
in vec2 texCoord0;

out vec4 fragColor;

vec4 computeColor() {
    vec4 color = texture(Sampler0, texCoord0);

#ifdef PER_FACE_LIGHTING
    vec4 faceVertexColor = (gl_FrontFacing ? vertexPerFaceColorFront : vertexPerFaceColorBack);
#else
    vec4 faceVertexColor = vertexColor;
#endif

    ivec2 texSize = textureSize(Sampler0, 0);
    ivec2 texelCoord = ivec2(texCoord0 * vec2(texSize));

    ivec4 pixel = ivec4(
        round(texelFetch(Sampler0, texelCoord, 0) * 255.0)
    );

    bool isLit = (
        pixel.a == 252
    );

    if (isLit) {
        return vec4(1);
    }

    color *= faceVertexColor;
    color *= ColorModulator;

#ifndef NO_OVERLAY
    color.rgb = mix(overlayColor.rgb, color.rgb, overlayColor.a);
#endif

#ifndef EMISSIVE
    color *= lightMapColor;
#endif

    return color;
}

void main() {
    vec4 baseColor = texture(Sampler0, texCoord0);

#ifdef ALPHA_CUTOUT
    if (baseColor.a < ALPHA_CUTOUT) {
        discard;
    }
#else
    if (baseColor.a < 0.1) {
        discard;
    }
#endif

    vec4 color = computeColor();

    fragColor = apply_fog(
        color,
        sphericalVertexDistance,
        cylindricalVertexDistance,
        FogEnvironmentalStart,
        FogEnvironmentalEnd,
        FogRenderDistanceStart,
        FogRenderDistanceEnd,
        FogColor
    );
}