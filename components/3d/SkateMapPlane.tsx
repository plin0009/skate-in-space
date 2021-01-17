import { useEffect, useMemo } from "react";
import { useFrame, useUpdate } from "react-three-fiber";
import { SkateMap } from "../../utils/skatemap";

import * as CANNON from "cannon-es";
import { Mesh, PlaneBufferGeometry, Vector3 } from "three";

interface SkateMapPlaneProps {
  data: SkateMap;
  world: CANNON.World;
}
const SkateMapPlane: React.FC<SkateMapPlaneProps> = ({ data, world }) => {
  const squareSize = 3;
  const { widthSegments, heightSegments, heights } = data;

  const { body } = useMemo(() => {
    const shape = new CANNON.Heightfield(heights, {
      elementSize: squareSize,
    });
    const body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(0, -4, 2);
    body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    return { body };
  }, []);

  useEffect(() => {
    world.addBody(body);
  });
  const mesh = useUpdate<Mesh<PlaneBufferGeometry>>(
    ({ geometry, position, quaternion }) => {
      position.copy((body.position as unknown) as Vector3);
      quaternion.copy((body.quaternion as unknown) as THREE.Quaternion);
      const pos = geometry.getAttribute("position");
      const pa = pos.array;

      const heightPoints = geometry.parameters.heightSegments + 1;
      const widthPoints = geometry.parameters.widthSegments + 1;

      for (let y = 0; y < heightPoints; y++) {
        for (let x = 0; x < widthPoints; x++) {
          // @ts-ignore
          pa[3 * (y * widthPoints + x) + 2] = heights[y][x];
        }
      }
      pos.needsUpdate = true;
    },
    [body]
  );

  useFrame(() => {
    if (!mesh.current) {
      return;
    }
    mesh.current.position.copy((body.position as unknown) as Vector3);
    mesh.current.quaternion.copy(
      (body.quaternion as unknown) as THREE.Quaternion
    );
  });

  return (
    <mesh ref={mesh} receiveShadow>
      <planeBufferGeometry
        attach="geometry"
        args={[
          squareSize * widthSegments,
          squareSize * heightSegments,
          widthSegments,
          heightSegments,
        ]}
      />
      <meshLambertMaterial attach="material" color="#ff8823" />
    </mesh>
  );
};

export default SkateMapPlane;
