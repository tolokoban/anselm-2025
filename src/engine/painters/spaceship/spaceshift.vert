#version 300 es
precision mediump float;

uniform vec2 uniScale;
uniform vec3 uniCenter;

in vec2 attPos;
in vec2 attUV;
out vec2 varUV;

void main() {
    varUV = attUV;
    vec3 p = vec3(attPos * uniScale, 0.0) + uniCenter;
    gl_Position = vec4(p, 1.0);
}