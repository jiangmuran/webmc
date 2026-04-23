#ifndef CORE_TOGGLES
#define CORE_TOGGLES

//HOW TO DISABLE FEATURES:
// To disable add a double slash "//" infront of a "#define x" line to completely disable the feature, that or remove the line entirely.
// Example would be instead of "#define ENABLE_WAVING" you'd make the line "//#define ENABLE_WAVING" which disables the feature.

// ENABLE_EMISSIVE: enable vanilla emissive textures
#define ENABLE_EMISSIVE

// ENABLE_WAVING: enable waving on blocks (water, portal, foliage)
#define ENABLE_WAVING
#define ENABLE_WAVING_FLUID
#define ENABLE_WAVING_PORTAL
#define ENABLE_WAVING_FOLIAGE
#define ENABLE_WAVING_LANTERN

#endif
