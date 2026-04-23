//#moj_import <fog.glsl>
//#moj_import <dynamictransforms.glsl>
//#moj_import <globals.glsl>
//#moj_import <projection.glsl>
//======================================================================================================================================
struct Data 
{
   vec3 position;
   vec2 uv0;
   vec4 color;
};


vec2[] corners = vec2[](vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0));
float margin = 0;

Data null = Data(vec3(0),vec2(0),vec4(0));


bool posCheckX(vec3 position,vec2 screen, float offset,float size) {
    return ( abs( (round(screen.x/2)+offset+(size*corners[gl_VertexID % 4].x)) - position.x )<= margin );
}
bool posChecky(vec3 position,vec2 screen, float offset,float size) {
    return ( abs( (round(screen.y/2)+offset+(size*corners[gl_VertexID % 4].y)) - position.y )<= margin );
}
bool posCheck(vec3 position,vec2 screen, vec2 offset,vec2 size) {
    return ( abs( (round(screen.x/2)+offset.x+(size.x*corners[gl_VertexID % 4].x)) - position.x )<= margin )&&
           ( abs( (round(screen.y/2)+offset.y+(size.y*corners[gl_VertexID % 4].y)) - position.y )<= margin );
}
bool posCheck(vec3 position,vec2 screen, vec2 offset,float size) {
    return posCheck(position,screen, offset,vec2(size));
}

Data reimagined_text(mat4 ProjMat, float GameTime, sampler2D Sampler0, vec3 Position, vec2 texCoord0,vec4 Color) {
    
    vec3 pos = Position;

    vec4 textColor = Color;

    int vertID = gl_VertexID % 4;
    vec2 corner = corners[vertID];
    vec4 color = round(texture(Sampler0, texCoord0-(0.001*corner))*255);

    vec2 texture = textureSize(Sampler0,0);

    if(color.a == 0 || color.a== 255) return Data(pos,texCoord0,textColor); 


    if(color.a == 1){

        int anim_speed = 2;

        if(color.r == 1){// Villager maine

            float  v_animationtime = anim_speed * 22;

            texCoord0 -= vec2(128.0,234.0)/textureSize(Sampler0,0)*corner;
            pos.xy -= vec2(128.0,234.0)*corner;

                 if(mod((GameTime*24000),v_animationtime/2) <   v_animationtime/22) texCoord0.y += 0;
            else if(mod((GameTime*24000),v_animationtime/2) < 2*v_animationtime/22) texCoord0.y += 1*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 3*v_animationtime/22) texCoord0.y += 2*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 4*v_animationtime/22) texCoord0.y += 3*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 5*v_animationtime/22) texCoord0.y += 4*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 6*v_animationtime/22) texCoord0.y += 5*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 7*v_animationtime/22) texCoord0.y += 6*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 8*v_animationtime/22) texCoord0.y += 7*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) < 9*v_animationtime/22) texCoord0.y += 8*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) <10*v_animationtime/22) texCoord0.y += 9*22.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime/2) <11*v_animationtime/22) texCoord0.y +=10*22.0/texture.y;

                 if(mod((GameTime*24000),v_animationtime) <   v_animationtime/2) texCoord0.x += 0;
            else if(mod((GameTime*24000),v_animationtime) <   v_animationtime  ) texCoord0.x += 128.0/texture.x; 
        }

        if(color.r == 2){// Villager eyes

            float  v_animationtime = anim_speed * 88;

            texCoord0 -= vec2(224.0,240.0)/textureSize(Sampler0,0)*corner;
            pos.xy -= vec2(224.0,240.0)*corner;

                 if(mod((GameTime*24000),v_animationtime/11) <   v_animationtime/88) texCoord0.y += 0;
            else if(mod((GameTime*24000),v_animationtime/11) < 2*v_animationtime/88) texCoord0.x += 1*32.0/texture.x;
            else if(mod((GameTime*24000),v_animationtime/11) < 3*v_animationtime/88) texCoord0.x += 2*32.0/texture.x;
            else if(mod((GameTime*24000),v_animationtime/11) < 4*v_animationtime/88) texCoord0.x += 3*32.0/texture.x;
            else if(mod((GameTime*24000),v_animationtime/11) < 5*v_animationtime/88) texCoord0.x += 4*32.0/texture.x;
            else if(mod((GameTime*24000),v_animationtime/11) < 6*v_animationtime/88) texCoord0.x += 5*32.0/texture.x;
            else if(mod((GameTime*24000),v_animationtime/11) < 7*v_animationtime/88) texCoord0.x += 6*32.0/texture.x;
            else if(mod((GameTime*24000),v_animationtime/11) < 8*v_animationtime/88) texCoord0.x += 7*32.0/texture.x;

                 if(mod((GameTime*24000),v_animationtime) <   v_animationtime/11) texCoord0.y += 0;
            else if(mod((GameTime*24000),v_animationtime) < 2*v_animationtime/11) texCoord0.y += 1*16.0/texture.y;
            else if(mod((GameTime*24000),v_animationtime) < 3*v_animationtime/11) texCoord0.y += 2*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) < 4*v_animationtime/11) texCoord0.y += 3*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) < 5*v_animationtime/11) texCoord0.y += 4*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) < 6*v_animationtime/11) texCoord0.y += 5*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) < 7*v_animationtime/11) texCoord0.y += 6*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) < 8*v_animationtime/11) texCoord0.y += 7*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) < 9*v_animationtime/11) texCoord0.y += 8*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) <10*v_animationtime/11) texCoord0.y += 9*16.0/texture.y; 
            else if(mod((GameTime*24000),v_animationtime) <11*v_animationtime/11) texCoord0.y +=10*16.0/texture.y; 
        }
    }
    
    return Data(pos,texCoord0,textColor);


}
