import { RoundedBox } from '@react-three/drei';

export function CyberDesk({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table Top */}
      <RoundedBox args={[14, 0.4, 6]} radius={0.05} position={[0, -0.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2d3342" roughness={0.7} metalness={0.2} />
      </RoundedBox>
      
      {/* Table Edge Trim */}
      <RoundedBox args={[14.05, 0.3, 6.05]} radius={0.02} position={[0, -0.2, 0]} receiveShadow>
        <meshStandardMaterial color="#1e222b" roughness={0.5} metalness={0.8} />
      </RoundedBox>

      {/* Legs */}
      <RoundedBox args={[0.4, 4, 4]} radius={0.05} position={[-6.5, -2.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e222b" roughness={0.6} metalness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.4, 4, 4]} radius={0.05} position={[6.5, -2.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1e222b" roughness={0.6} metalness={0.8} />
      </RoundedBox>
    </group>
  );
}
