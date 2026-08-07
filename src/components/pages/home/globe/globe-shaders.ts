export const LAND_VERTEX_SHADER = /* glsl */ `
  uniform float uPointScale;

  attribute vec3 aCenter;
  attribute float aSeed;

  varying float vFacing;
  varying float vHorizontal;
  varying float vSeed;
  varying vec2 vUv;

  void main() {
    vec3 center = aCenter;
    vec3 objectNormal = normalize(center);
    vec3 tangent = normalize(vec3(objectNormal.z, 0.0, -objectNormal.x));
    vec3 bitangent = normalize(cross(objectNormal, tangent));
    float latitudeScale = sqrt(max(0.0, 1.0 - objectNormal.y * objectNormal.y));
    float polarScale = mix(0.62, 1.0, smoothstep(0.24, 0.82, latitudeScale));
    float squareSize = mix(0.024, 0.029, aSeed) * polarScale * uPointScale;
    vec3 surfacePosition = center
      + tangent * position.x * squareSize
      + bitangent * position.y * squareSize;
    vec4 viewPosition = modelViewMatrix * vec4(surfacePosition, 1.0);
    vec3 viewNormal = normalize(normalMatrix * objectNormal);

    vFacing = smoothstep(-0.08, 0.32, viewNormal.z);
    vHorizontal = clamp(viewPosition.x / 4.8 + 0.5, 0.0, 1.0);
    vSeed = aSeed;
    vUv = uv;

    gl_Position = projectionMatrix * viewPosition;
  }
`

export const LAND_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying float vFacing;
  varying float vHorizontal;
  varying float vSeed;
  varying vec2 vUv;

  void main() {
    vec2 edgeDistance = vec2(0.5) - abs(vUv - vec2(0.5));
    vec2 pixelWidth = fwidth(vUv);
    vec2 coverage = smoothstep(vec2(0.0), pixelWidth, edgeDistance);
    float pointMask = coverage.x * coverage.y;
    float edgeColor = smoothstep(0.12, 0.9, abs(vHorizontal - 0.5) * 2.0);
    vec3 blue = vec3(0.32, 0.45, 1.0);
    vec3 pink = vec3(0.94, 0.63, 1.0);
    vec3 color = mix(blue, pink, clamp(edgeColor + vSeed * 0.08, 0.0, 1.0));
    float alpha = pointMask;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

export const ROUTE_VERTEX_SHADER = /* glsl */ `
  varying float vFacing;
  varying float vHorizontal;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normalize(position));

    vFacing = smoothstep(-0.08, 0.2, viewNormal.z);
    vHorizontal = clamp(viewPosition.x / 4.8 + 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const ROUTE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  uniform float uScreenStrength;

  varying float vFacing;
  varying float vHorizontal;

  void main() {
    vec3 blue = vec3(0.32, 0.45, 1.0);
    vec3 pink = vec3(0.94, 0.63, 1.0);
    vec3 baseColor = mix(blue, pink, smoothstep(0.12, 0.88, vHorizontal));
    vec3 screenColor = 1.0 - (1.0 - baseColor) * (1.0 - baseColor);
    vec3 color = mix(baseColor, screenColor, uScreenStrength);
    float alpha = uOpacity * vFacing;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

export const MARKER_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aCenter;
  attribute float aOpacity;
  attribute float aScale;
  attribute float aSeed;
  attribute float aSize;

  varying float vOpacity;
  varying float vFacing;
  varying float vHorizontal;
  varying float vSeed;
  varying vec2 vUv;

  void main() {
    vec3 objectNormal = normalize(aCenter);
    vec3 tangent = normalize(vec3(objectNormal.z, 0.0, -objectNormal.x));
    vec3 bitangent = normalize(cross(objectNormal, tangent));
    vec3 surfacePosition = aCenter
      + tangent * position.x * aSize * aScale
      + bitangent * position.y * aSize * aScale;
    vec4 viewPosition = modelViewMatrix * vec4(surfacePosition, 1.0);
    vec3 viewNormal = normalize(normalMatrix * objectNormal);

    vOpacity = aOpacity;
    vFacing = smoothstep(-0.08, 0.22, viewNormal.z);
    vHorizontal = clamp(viewPosition.x / 4.8 + 0.5, 0.0, 1.0);
    vSeed = aSeed;
    vUv = uv;
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const MARKER_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying float vOpacity;
  varying float vFacing;
  varying float vHorizontal;
  varying float vSeed;
  varying vec2 vUv;

  void main() {
    vec2 centeredCoord = abs(vUv - vec2(0.5));
    float distanceFromCenter = max(centeredCoord.x, centeredCoord.y);
    float core = 1.0 - smoothstep(0.37, 0.43, distanceFromCenter);
    float glow = 1.0 - smoothstep(0.32, 0.51, distanceFromCenter);
    float edgeColor = smoothstep(0.12, 0.9, abs(vHorizontal - 0.5) * 2.0);
    vec3 blue = vec3(0.32, 0.45, 1.0);
    vec3 pink = vec3(0.94, 0.63, 1.0);
    vec3 baseColor = mix(
      blue,
      pink,
      clamp(edgeColor + vSeed * 0.08, 0.0, 1.0)
    );
    vec3 screenColor = 1.0 - (1.0 - baseColor) * (1.0 - baseColor);
    vec3 brightColor = mix(screenColor, vec3(1.0), 0.44);
    vec3 color = mix(brightColor, vec3(1.0), core * 0.18);
    float alpha = (core + glow * 0.36) * vOpacity * vFacing;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

export const SURFACE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying float vScreenHeight;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 viewCenter = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

    vViewNormal = normalize(normalMatrix * normalize(position));
    vViewPosition = viewPosition.xyz;
    vScreenHeight = clamp(
      (viewPosition.y - viewCenter.y) / (length(position) * 2.0) + 0.5,
      0.0,
      1.0
    );
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const SURFACE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying float vScreenHeight;

  void main() {
    // Figma: radial-gradient(56.41% 56.41% at 50% 50%,
    // transparent 76.3015%, white 100%), overlay. The source opacity of 0.7
    // is reduced here to match the approved, subtler ocean treatment.
    // The gradient radius is 56.41% of the layer bounds while the sphere
    // itself occupies 50%, so its silhouette reaches only ~88.64% of the
    // exported gradient. This intentionally keeps the rim translucent.
    const float gradientScale = 0.5 / 0.5641;
    const float transparentStop = 0.763015;
    const float surfaceOpacity = 0.25;

    vec3 viewDirection = normalize(-vViewPosition);
    float facing = clamp(dot(normalize(vViewNormal), viewDirection), 0.0, 1.0);
    float surfaceRadius = sqrt(max(0.0, 1.0 - facing * facing));
    float gradientPosition = surfaceRadius * gradientScale;
    float rim = clamp(
      (gradientPosition - transparentStop) / (1.0 - transparentStop),
      0.0,
      1.0
    );

    // CSS overlay cannot sample the DOM backplate from inside WebGL. Rebuild
    // overlay(base, white) from the same blue/violet ocean palette instead:
    // dark channels double, while channels above 0.5 resolve to white.
    vec3 oceanBottom = vec3(0.28, 0.08, 0.48);
    vec3 oceanTop = vec3(0.08, 0.2, 0.72);
    vec3 oceanColor = mix(
      oceanBottom,
      oceanTop,
      smoothstep(0.12, 0.88, vScreenHeight)
    );
    vec3 doubledColor = min(oceanColor * 2.0, vec3(1.0));
    vec3 color = mix(
      doubledColor,
      vec3(1.0),
      step(vec3(0.5), oceanColor)
    );
    float alpha = rim * surfaceOpacity;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`
