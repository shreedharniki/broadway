import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './city-prototype.css';

type CameraView = 'overview' | 'branching' | 'clusters';

type BuildingOptions = {
  width: number;
  depth: number;
  height: number;
  body: THREE.ColorRepresentation;
  accent?: THREE.ColorRepresentation;
  floors?: number;
  columns?: number;
  roof?: 'flat' | 'stepped' | 'canopy';
  windowTone?: THREE.ColorRepresentation;
};

type NetworkRoute = {
  curve: THREE.CatmullRomCurve3;
  halo: THREE.Mesh;
  pulse: THREE.Mesh;
  speed: number;
  offset: number;
};

const CAMERA_LABELS: Record<CameraView, string> = {
  overview: 'City overview',
  branching: 'Network branching',
  clusters: 'Connected clusters',
};

const CAMERA_POSES: Record<CameraView, { position: THREE.Vector3; target: THREE.Vector3 }> = {
  overview: {
    position: new THREE.Vector3(42, 31, 44),
    target: new THREE.Vector3(0, 3, -4),
  },
  branching: {
    position: new THREE.Vector3(23, 16, 27),
    target: new THREE.Vector3(0, 1.7, -3),
  },
  clusters: {
    position: new THREE.Vector3(0, 45, 47),
    target: new THREE.Vector3(0, 1.2, -3),
  },
};

const palette = {
  navy: 0x0e2a48,
  blue: 0x1769e0,
  fibre: 0x22b8ff,
  fibreLight: 0xbdefff,
  glass: 0x295b85,
  white: 0xf4f7f9,
  warmWhite: 0xeee9df,
  concrete: 0xc9d2da,
  road: 0x394957,
  roadEdge: 0x93a7b5,
  lawn: 0x92ad88,
  tree: 0x3f785c,
};

function makeMaterial(
  color: THREE.ColorRepresentation,
  roughness = 0.72,
  metalness = 0.02,
) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function addBox(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  castShadow = true,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addWindows(
  building: THREE.Group,
  width: number,
  depth: number,
  height: number,
  floors: number,
  columns: number,
  material: THREE.Material,
) {
  const windowWidth = Math.min(0.66, (width - 0.7) / columns - 0.22);
  const windowHeight = Math.min(0.58, height / floors - 0.28);
  const floorGap = height / floors;
  const columnGap = width / columns;

  for (let floor = 0; floor < floors; floor += 1) {
    const y = 0.48 + floor * floorGap;
    for (let column = 0; column < columns; column += 1) {
      const x = -width / 2 + columnGap * (column + 0.5);
      addBox(
        building,
        [windowWidth, windowHeight, 0.055],
        [x, y, depth / 2 + 0.032],
        material,
        false,
      );
      addBox(
        building,
        [windowWidth, windowHeight, 0.055],
        [x, y, -depth / 2 - 0.032],
        material,
        false,
      );
    }
  }
}

function createBuilding(options: BuildingOptions) {
  const {
    width,
    depth,
    height,
    body,
    accent = palette.navy,
    floors = Math.max(2, Math.round(height / 1.35)),
    columns = Math.max(2, Math.round(width / 1.35)),
    roof = 'flat',
    windowTone = palette.glass,
  } = options;

  const group = new THREE.Group();
  const bodyMaterial = makeMaterial(body, 0.78);
  const accentMaterial = makeMaterial(accent, 0.56, 0.08);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: windowTone,
    emissive: new THREE.Color(0x103a63),
    emissiveIntensity: 0.16,
    roughness: 0.22,
    metalness: 0.3,
  });

  addBox(group, [width, height, depth], [0, height / 2, 0], bodyMaterial);
  addWindows(group, width, depth, height, floors, columns, windowMaterial);

  addBox(group, [width + 0.12, 0.12, depth + 0.12], [0, 0.12, 0], accentMaterial);

  if (roof === 'stepped') {
    addBox(
      group,
      [width * 0.64, 0.58, depth * 0.66],
      [0, height + 0.29, 0],
      accentMaterial,
    );
    addBox(
      group,
      [width * 0.22, 0.52, depth * 0.26],
      [width * 0.18, height + 0.84, -depth * 0.08],
      accentMaterial,
    );
  } else if (roof === 'canopy') {
    addBox(
      group,
      [width + 0.32, 0.14, depth + 0.42],
      [0, height + 0.08, 0],
      accentMaterial,
    );
  } else {
    addBox(
      group,
      [width * 0.28, 0.32, depth * 0.32],
      [width * 0.18, height + 0.16, -depth * 0.12],
      accentMaterial,
    );
  }

  return group;
}

function createGableRoof(width: number, depth: number, height: number, material: THREE.Material) {
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const vertices = new Float32Array([
    -halfWidth, 0, -halfDepth,
    halfWidth, 0, -halfDepth,
    0, height, -halfDepth,
    -halfWidth, 0, halfDepth,
    halfWidth, 0, halfDepth,
    0, height, halfDepth,
  ]);
  const indices = [
    0, 1, 2,
    3, 5, 4,
    0, 3, 4,
    0, 4, 1,
    1, 4, 5,
    1, 5, 2,
    2, 5, 3,
    2, 3, 0,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const roof = new THREE.Mesh(geometry, material);
  roof.castShadow = true;
  roof.receiveShadow = true;
  return roof;
}

function createHouse(bodyColor: THREE.ColorRepresentation, roofColor: THREE.ColorRepresentation) {
  const group = new THREE.Group();
  const bodyMaterial = makeMaterial(bodyColor, 0.82);
  const roofMaterial = makeMaterial(roofColor, 0.7);
  const glassMaterial = makeMaterial(0x39739d, 0.24, 0.2);
  addBox(group, [3.1, 2.25, 2.6], [0, 1.125, 0], bodyMaterial);
  const roof = createGableRoof(3.42, 2.9, 1.08, roofMaterial);
  roof.position.y = 2.24;
  group.add(roof);
  addBox(group, [0.62, 0.8, 0.08], [-0.72, 1.18, 1.33], glassMaterial, false);
  addBox(group, [0.62, 0.8, 0.08], [0.72, 1.18, 1.33], glassMaterial, false);
  addBox(group, [0.58, 1.42, 0.12], [0, 0.73, 1.35], makeMaterial(palette.navy), false);
  return group;
}

function createTree(scale = 1) {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 1.25 * scale, 8),
    makeMaterial(0x7b624b, 0.95),
  );
  trunk.position.y = 0.625 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.76 * scale, 1),
    makeMaterial(palette.tree, 0.9),
  );
  crown.scale.set(1, 1.15, 1);
  crown.position.y = 1.55 * scale;
  crown.castShadow = true;
  tree.add(crown);
  return tree;
}

function addRoad(
  parent: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3,
  width: number,
  roadMaterial: THREE.Material,
  edgeMaterial: THREE.Material,
) {
  const direction = end.clone().sub(start);
  const length = Math.hypot(direction.x, direction.z);
  const center = start.clone().add(end).multiplyScalar(0.5);
  const road = addBox(parent, [length, 0.11, width], [center.x, 0.08, center.z], roadMaterial, false);
  road.rotation.y = -Math.atan2(direction.z, direction.x);

  for (const edgeOffset of [-width / 2 - 0.08, width / 2 + 0.08]) {
    const edge = addBox(parent, [length, 0.07, 0.11], [center.x, 0.15, center.z], edgeMaterial, false);
    edge.rotation.y = road.rotation.y;
    edge.position.x += Math.sin(road.rotation.y) * edgeOffset;
    edge.position.z += Math.cos(road.rotation.y) * edgeOffset;
  }
}

function addDistrictLabel(parent: THREE.Object3D, text: string, position: THREE.Vector3) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 112;
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(8, 34, 61, 0.88)';
  context.beginPath();
  context.roundRect(8, 8, 496, 96, 22);
  context.fill();
  context.font = '600 35px Manrope, Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#f7fbff';
  context.fillText(text, 256, 58);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
  );
  sprite.position.copy(position);
  sprite.scale.set(5.4, 1.18, 1);
  sprite.userData.labelTexture = texture;
  parent.add(sprite);
}

function createSky() {
  const geometry = new THREE.SphereGeometry(240, 48, 28);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x5da8eb) },
      horizonColor: { value: new THREE.Color(0xe7f4ff) },
      offset: { value: 7.0 },
      exponent: { value: 0.72 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        float blend = max(pow(max(h, 0.0), exponent), 0.0);
        gl_FragColor = vec4(mix(horizonColor, topColor, blend), 1.0);
      }
    `,
  });
  return new THREE.Mesh(geometry, material);
}

function addResidentialCluster(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.position.set(-16, 0, 14);
  const houseColors = [palette.warmWhite, 0xe7edf1, 0xf2e5d5, 0xdde7ea];
  const roofColors = [0x315472, 0x546d7e, 0x8a6658, 0x2b4d69];
  const placements = [
    [-4.2, 2.5, 0.08],
    [0, 3.1, -0.08],
    [4.2, 2.2, 0.12],
    [-2.2, -1.4, -0.03],
    [2.2, -1.8, 0.06],
  ] as const;
  placements.forEach(([x, z, rotation], index) => {
    const house = createHouse(houseColors[index % houseColors.length], roofColors[index % roofColors.length]);
    house.position.set(x, 0, z);
    house.rotation.y = rotation;
    group.add(house);
  });
  addDistrictLabel(group, 'Homes', new THREE.Vector3(0, 5.2, 1.4));
  scene.add(group);
}

function addApartmentCluster(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.position.set(-18, 0, -8);
  const towerSpecs = [
    [-3.4, 0.8, 4.6, 4.5, 10.5],
    [1.4, -0.4, 4.9, 4.7, 13.2],
    [5.6, 1.2, 3.8, 4.2, 8.6],
  ] as const;
  towerSpecs.forEach(([x, z, width, depth, height], index) => {
    const tower = createBuilding({
      width,
      depth,
      height,
      body: index === 1 ? 0xdbe3e8 : 0xe8edf0,
      accent: index === 1 ? palette.blue : palette.navy,
      floors: Math.round(height / 1.35),
      columns: 4,
      roof: index === 1 ? 'stepped' : 'flat',
    });
    tower.position.set(x, 0, z);
    group.add(tower);
    for (let floor = 1; floor < Math.round(height / 1.35); floor += 2) {
      addBox(
        tower,
        [width * 0.72, 0.11, 0.58],
        [0, floor * 1.35 + 0.22, depth / 2 + 0.3],
        makeMaterial(0xc5d1d9),
        false,
      );
    }
  });
  addDistrictLabel(group, 'Apartments', new THREE.Vector3(1, 15.7, 0));
  scene.add(group);
}

function addBusinessCluster(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.position.set(15, 0, -8);
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e679e,
    roughness: 0.18,
    metalness: 0.46,
    emissive: 0x082744,
    emissiveIntensity: 0.25,
  });
  const frameMaterial = makeMaterial(palette.navy, 0.42, 0.24);

  addBox(group, [7.4, 13.8, 6.2], [0, 6.9, 0], glassMaterial);
  addBox(group, [7.9, 0.34, 6.65], [0, 13.8, 0], frameMaterial);
  addBox(group, [4.2, 5.4, 7.4], [-5.7, 2.7, 0.5], makeMaterial(0xdde5e9));
  addBox(group, [4.7, 0.24, 7.8], [-5.7, 5.48, 0.5], frameMaterial);
  for (const x of [-3.1, -2.05, -1, 0, 1, 2.05, 3.1]) {
    addBox(group, [0.09, 13.3, 0.12], [x, 6.75, 3.16], frameMaterial, false);
  }
  for (let floor = 1; floor < 9; floor += 1) {
    addBox(group, [7.45, 0.075, 0.13], [0, floor * 1.48, 3.17], frameMaterial, false);
  }
  addBox(group, [3.8, 0.28, 2.5], [0, 1.9, 4.25], makeMaterial(0xeef4f7), false);
  addDistrictLabel(group, 'Business', new THREE.Vector3(-0.5, 16.2, 0));
  scene.add(group);
}

function addCampusCluster(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.position.set(0, 0, -19);
  const wall = makeMaterial(0xe8eceb, 0.82);
  const accent = makeMaterial(0x315e82, 0.5, 0.08);
  const glass = makeMaterial(0x4a86aa, 0.24, 0.2);

  addBox(group, [12, 3.5, 3.8], [0, 1.75, -2.8], wall);
  addBox(group, [4.2, 4.7, 9.5], [-4.2, 2.35, 2], wall);
  addBox(group, [4.2, 3.1, 8.6], [4.2, 1.55, 1.6], wall);
  addBox(group, [4.5, 0.2, 9.8], [-4.2, 4.78, 2], accent);
  addBox(group, [4.5, 0.2, 9], [4.2, 3.18, 1.6], accent);
  for (const x of [-4.5, -2.25, 0, 2.25, 4.5]) {
    addBox(group, [1.18, 1.05, 0.08], [x, 1.95, -0.86], glass, false);
  }
  addBox(group, [3.5, 0.22, 2.4], [0, 2.8, -0.55], accent, false);
  addBox(group, [3.15, 2.45, 0.12], [0, 1.45, -0.74], glass, false);
  addDistrictLabel(group, 'Campus', new THREE.Vector3(0, 7.2, 0));
  scene.add(group);
}

function addCentralHub(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.position.set(0, 0, 1);
  const plinth = makeMaterial(0xdce6eb, 0.65);
  const navy = makeMaterial(palette.navy, 0.38, 0.3);
  const fibre = new THREE.MeshStandardMaterial({
    color: palette.fibre,
    emissive: palette.fibre,
    emissiveIntensity: 1.6,
    roughness: 0.2,
  });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.5, 0.58, 32), plinth);
  base.position.y = 0.29;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.95, 2.2, 24), navy);
  core.position.y = 1.42;
  core.castShadow = true;
  group.add(core);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.1, 12, 48), fibre);
  ring.position.y = 1.28;
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.65, 0.26, 24), fibre);
  cap.position.y = 2.62;
  group.add(cap);
  addDistrictLabel(group, 'Network hub', new THREE.Vector3(0, 4.3, 0));
  scene.add(group);
}

function addNetwork(scene: THREE.Scene) {
  const coreMaterial = new THREE.MeshBasicMaterial({ color: palette.fibre });
  const branchMaterial = new THREE.MeshBasicMaterial({ color: 0x46c8ff });
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: palette.fibreLight,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const networkGroup = new THREE.Group();
  const effectsGroup = new THREE.Group();
  const routes: NetworkRoute[] = [];

  const routeDefinitions = [
    {
      points: [
        [-29, 0.5, 15],
        [-18, 0.62, 10],
        [-7, 0.74, 5],
        [0, 0.88, 1],
        [10, 0.7, -3],
        [26, 0.54, -10],
      ],
      radius: 0.16,
      speed: 0.055,
    },
    {
      points: [
        [0, 0.87, 1],
        [-7, 0.8, 8],
        [-16, 0.7, 15],
      ],
      radius: 0.1,
      speed: 0.072,
    },
    {
      points: [
        [0, 0.87, 1],
        [-8, 0.75, -3],
        [-18, 0.72, -8],
      ],
      radius: 0.1,
      speed: 0.066,
    },
    {
      points: [
        [0, 0.87, 1],
        [8, 0.82, -3],
        [15, 0.78, -8],
      ],
      radius: 0.1,
      speed: 0.075,
    },
    {
      points: [
        [0, 0.87, 1],
        [2, 0.78, -9],
        [0, 0.72, -19],
      ],
      radius: 0.1,
      speed: 0.062,
    },
  ] as const;

  routeDefinitions.forEach((definition, index) => {
    const points = definition.points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.45);
    const core = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 96, definition.radius, 10, false),
      index === 0 ? coreMaterial : branchMaterial,
    );
    networkGroup.add(core);

    const halo = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 96, definition.radius * 2.2, 10, false),
      haloMaterial,
    );
    effectsGroup.add(halo);

    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(index === 0 ? 0.3 : 0.22, 16, 12),
      pulseMaterial,
    );
    pulse.position.copy(curve.getPointAt(0));
    effectsGroup.add(pulse);
    routes.push({ curve, halo, pulse, speed: definition.speed, offset: index * 0.17 });
  });

  const nodePositions = [
    [-16, 0.84, 15],
    [-18, 0.84, -8],
    [15, 0.86, -8],
    [0, 0.8, -19],
  ] as const;
  nodePositions.forEach(([x, y, z]) => {
    const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.3, 0.82, 16), coreMaterial);
    marker.position.set(x, y, z);
    networkGroup.add(marker);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.055, 10, 36), haloMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.5, z);
    effectsGroup.add(ring);
  });

  scene.add(networkGroup, effectsGroup);
  return { routes, effectsGroup };
}

function addSceneStructure(scene: THREE.Scene) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(92, 76),
    makeMaterial(0xb6c6ae, 0.96),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  const roadMaterial = makeMaterial(palette.road, 0.9);
  const roadEdgeMaterial = makeMaterial(palette.roadEdge, 0.85);
  addRoad(scene, new THREE.Vector3(-34, 0, 8), new THREE.Vector3(31, 0, -12), 3.6, roadMaterial, roadEdgeMaterial);
  addRoad(scene, new THREE.Vector3(-19, 0, 25), new THREE.Vector3(-17, 0, -20), 2.8, roadMaterial, roadEdgeMaterial);
  addRoad(scene, new THREE.Vector3(-4, 0, 22), new THREE.Vector3(0, 0, -28), 3.1, roadMaterial, roadEdgeMaterial);
  addRoad(scene, new THREE.Vector3(0, 0, 1), new THREE.Vector3(29, 0, 6), 2.5, roadMaterial, roadEdgeMaterial);

  addResidentialCluster(scene);
  addApartmentCluster(scene);
  addBusinessCluster(scene);
  addCampusCluster(scene);
  addCentralHub(scene);

  const treePositions = [
    [-27, 11, 0.85], [-25, 16, 0.7], [-22, 20, 0.75], [-10, 18, 0.8],
    [-25, -3, 0.92], [-11, -10, 0.72], [-9, -16, 0.8], [-2, -16, 0.7],
    [4, 13, 0.86], [9, 11, 0.78], [17, 8, 0.9], [25, -2, 0.76],
    [22, -17, 0.8], [15, -20, 0.72], [0, -24, 0.82], [-5, -27, 0.75],
  ] as const;
  treePositions.forEach(([x, z, scale]) => {
    const tree = createTree(scale);
    tree.position.set(x, 0, z);
    scene.add(tree);
  });
}

function supportsWebGL() {
  try {
    const testCanvas = document.createElement('canvas');
    return Boolean(
      window.WebGL2RenderingContext &&
        testCanvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

export function BroadwayCityPrototype() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCameraRef = useRef<(view: CameraView) => void>(() => undefined);
  const setEffectsRef = useRef<(enabled: boolean) => void>(() => undefined);
  const [cameraView, setCameraView] = useState<CameraView>('overview');
  const [networkEffects, setNetworkEffects] = useState(true);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Broadway Connected City | Three.js Prototype';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !supportsWebGL()) {
      setWebGLFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebGLFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd9edfa, 72, 220);
    scene.add(createSky());

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 180);
    const cameraTarget = new THREE.Vector3();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const hemisphere = new THREE.HemisphereLight(0xcfeaff, 0x60715f, 2.25);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xfff4df, 3.65);
    sun.position.set(-24, 38, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -42;
    sun.shadow.camera.right = 42;
    sun.shadow.camera.top = 38;
    sun.shadow.camera.bottom = -38;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 105;
    sun.shadow.bias = -0.00025;
    scene.add(sun);

    addSceneStructure(scene);
    const { routes, effectsGroup } = addNetwork(scene);

    let activeView: CameraView = 'overview';
    let transitionStart = 0;
    let transitionDuration = 760;
    let transitionFromPosition = CAMERA_POSES.overview.position.clone();
    let transitionFromTarget = CAMERA_POSES.overview.target.clone();
    let transitionToPosition = CAMERA_POSES.overview.position.clone();
    let transitionToTarget = CAMERA_POSES.overview.target.clone();
    let animationFrame = 0;
    let previousFrame = 0;
    let pulseElapsed = 0;

    const getResponsivePose = (view: CameraView) => {
      const pose = CAMERA_POSES[view];
      const aspect = Math.max(container.clientWidth / Math.max(container.clientHeight, 1), 0.3);
      const mobileScale = aspect < 0.8 ? 1.55 : aspect < 1.2 ? 1.18 : 1;
      const position = pose.position.clone().multiplyScalar(mobileScale);
      position.y += aspect < 0.8 ? 4 : 0;
      return { position, target: pose.target.clone() };
    };

    const jumpToPose = (view: CameraView) => {
      const pose = getResponsivePose(view);
      camera.position.copy(pose.position);
      cameraTarget.copy(pose.target);
      camera.lookAt(cameraTarget);
    };

    setCameraRef.current = (view) => {
      activeView = view;
      const pose = getResponsivePose(view);
      transitionFromPosition = camera.position.clone();
      transitionFromTarget = cameraTarget.clone();
      transitionToPosition = pose.position;
      transitionToTarget = pose.target;
      transitionStart = performance.now();
      transitionDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 760;
    };

    setEffectsRef.current = (enabled) => {
      effectsGroup.visible = enabled;
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.fov = camera.aspect < 0.8 ? 50 : 38;
      camera.updateProjectionMatrix();
      jumpToPose(activeView);
    };

    const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5);
    const render = (now: number) => {
      animationFrame = requestAnimationFrame(render);
      if (previousFrame === 0) previousFrame = now;
      const frameDelta = Math.min(Math.max((now - previousFrame) / 1000, 0), 0.05);
      previousFrame = now;
      pulseElapsed += frameDelta;
      if (transitionStart > 0) {
        const rawProgress = transitionDuration === 0
          ? 1
          : Math.min(Math.max((now - transitionStart) / transitionDuration, 0), 1);
        const progress = easeOutQuint(rawProgress);
        camera.position.lerpVectors(transitionFromPosition, transitionToPosition, progress);
        cameraTarget.lerpVectors(transitionFromTarget, transitionToTarget, progress);
        camera.lookAt(cameraTarget);
        if (rawProgress >= 1) transitionStart = 0;
      }

      if (effectsGroup.visible) {
        routes.forEach((route) => {
          const progress = (pulseElapsed * route.speed + route.offset) % 1;
          route.pulse.position.copy(route.curve.getPointAt(progress));
          const pulse = 0.78 + Math.sin(pulseElapsed * 4 + route.offset * 8) * 0.18;
          route.pulse.scale.setScalar(pulse);
        });
      }

      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    jumpToPose('overview');
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      setCameraRef.current = () => undefined;
      setEffectsRef.current = () => undefined;
      scene.traverse((object) => {
        if (object instanceof THREE.Sprite) {
          const texture = object.userData.labelTexture as THREE.Texture | undefined;
          texture?.dispose();
          object.material.dispose();
        }
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  const selectCamera = (view: CameraView) => {
    setCameraView(view);
    setCameraRef.current(view);
  };

  const toggleNetworkEffects = () => {
    const next = !networkEffects;
    setNetworkEffects(next);
    setEffectsRef.current(next);
  };

  return (
    <main className="city-prototype">
      <div ref={containerRef} className="city-prototype__stage">
        {!webGLFailed && (
          <canvas
            ref={canvasRef}
            className="city-prototype__canvas"
            aria-label="Three-dimensional connected city scene showing Broadway fibre routes linking homes, apartments, business and a campus"
          />
        )}

        {webGLFailed && (
          <div className="city-prototype__fallback" role="img" aria-label="Broadway connected Bengaluru city">
            <div className="city-prototype__fallback-note">
              Interactive 3D is unavailable. Showing the connected-city reference image.
            </div>
          </div>
        )}

        <div className="city-prototype__identity" aria-hidden="true">
          <span className="city-prototype__brand">Broadway</span>
          <span className="city-prototype__descriptor">Connected city study</span>
        </div>

        {!webGLFailed && <section className="city-prototype__controls" aria-label="3D scene developer controls">
          <div className="city-prototype__control-heading">
            <span>Preview camera</span>
            <span className="city-prototype__status">{CAMERA_LABELS[cameraView]}</span>
          </div>
          <div className="city-prototype__camera-list">
            {(Object.keys(CAMERA_LABELS) as CameraView[]).map((view, index) => (
              <button
                key={view}
                type="button"
                className="city-prototype__camera-button"
                aria-pressed={cameraView === view}
                onClick={() => selectCamera(view)}
              >
                <span>{index + 1}</span>
                {CAMERA_LABELS[view]}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="city-prototype__effects-button"
            aria-pressed={networkEffects}
            onClick={toggleNetworkEffects}
          >
            <span className="city-prototype__switch" aria-hidden="true">
              <span />
            </span>
            Network effects
            <strong>{networkEffects ? 'On' : 'Off'}</strong>
          </button>
        </section>}

        {!webGLFailed && <div className="city-prototype__legend" aria-hidden="true">
          <span><i /> Backbone</span>
          <span><i /> Service branches</span>
        </div>}
      </div>
    </main>
  );
}
