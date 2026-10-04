import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { CyberDeviceScreen } from './CyberDeviceScreen';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CyberFirewall({ position = [0, 0, 0], rotation = [0, 0, 0], isActive, renderContent, status }: any) {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      if (isActive) {
        // Pulse when active
        (glowRef.current.material as any).emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
      } else {
        (glowRef.current.material as any).emissiveIntensity = 0.2;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Firewall Appliance Body */}
      <RoundedBox args={[1.5, 0.3, 1]} radius={0.02} position={[0, 0.15, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#202533" roughness={0.6} metalness={0.6} />
      </RoundedBox>

      {/* Front Faceplate */}
      <mesh position={[0, 0.15, 0.501]}>
        <planeGeometry args={[1.4, 0.2]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Glowing Hexagon or Shield Logo on top */}
      <mesh ref={glowRef} position={[0, 0.301, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.01, 6]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Holographic Screen floating above the firewall */}
      <group position={[0, 1.2, 0]}>
        {/* Hologram base projector beam */}
        <mesh position={[0, -0.6, 0]}>
           <cylinderGeometry args={[0.01, 0.1, 1.2, 16, 1, true]} />
           <meshBasicMaterial color="#10b981" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        
        <CyberDeviceScreen 
             title="SECURITY APPLIANCE" 
             subtitle="DEFENSIVE LAYER" 
             isActive={isActive} 
             status={status}
             color="#10b981" 
             width="400px" 
             height="300px" 
             scale={0.005}
           >
             {renderContent()}
        </CyberDeviceScreen>
      </group>
    </group>
  );
}
