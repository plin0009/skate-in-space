import * as CANNON from "cannon-es";
import { useEffect, useMemo } from "react";
import { useFrame, useUpdate } from "react-three-fiber";
import { Mesh, SphereBufferGeometry } from "three";

// a very round cube

interface CubeProps {
  world: CANNON.World;
}

const Cube: React.FC<CubeProps> = ({ world }) => {
  const radius = 1;
  const { body } = useMemo(() => {
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({ mass: 1 });
    body.addShape(shape);
    body.position.set(1, 5, 2);
    return { body };
  }, []);

  useEffect(() => {
    world.addBody(body);
  });

  useFrame(() => {
    if (!mesh.current) {
      return;
    }
    mesh.current.position.copy((body.position as unknown) as THREE.Vector3);
    mesh.current.quaternion.copy(
      (body.quaternion as unknown) as THREE.Quaternion
    );
  });

  const mesh = useUpdate<Mesh<SphereBufferGeometry>>(
    ({ position, quaternion }) => {
      position.copy((body.position as unknown) as THREE.Vector3);
      quaternion.copy((body.quaternion as unknown) as THREE.Quaternion);
    },
    [body]
  );

  return (
    <mesh ref={mesh} receiveShadow castShadow>
      <sphereBufferGeometry args={[radius, 10, 10]} />
      <meshLambertMaterial color={"#ff2f2f"} />
    </mesh>
  );
};

export default Cube;
