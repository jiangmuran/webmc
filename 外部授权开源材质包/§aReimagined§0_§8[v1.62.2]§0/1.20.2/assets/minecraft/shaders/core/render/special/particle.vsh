#version 330

#moj_import <light.glsl>
#moj_import <fog.glsl>

in vec3 Position;
in vec2 UV0;
in vec4 Color;
in ivec2 UV2;

uniform sampler2D Sampler2;

uniform mat4 ModelViewMat;
uniform mat4 ProjMat;
uniform int FogShape;

out float vertexDistance;
out vec4 vertexColor;
out vec4 tintColor;
out vec4 lightColor;
out vec2 texCoord0;

void main() {
    gl_Position = ProjMat * ModelViewMat * vec4(Position, 1.0);
    vertexDistance = fog_distance(ModelViewMat, Position, FogShape);
    texCoord0 = UV0;
    if (Color.r == Color.g && Color.g == Color.b) {
        vertexColor = Color;
        tintColor = vec4(1.0);
    }
    else {
        vertexColor = vec4(1.0);
        tintColor = Color;
    }
    lightColor = minecraft_sample_lightmap_of(Sampler2, UV2);
}