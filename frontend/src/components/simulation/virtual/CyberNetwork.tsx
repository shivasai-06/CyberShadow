import { Line, Sphere, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export interface CyberNetworkProps {
  activeScreenId: string | null;
  activeState?: 'IDLE' | 'ACTIVE' | 'WAITING' | 'SUCCESS' | 'WARNING' | 'BLOCKED' | 'COMPROMISED';
}

// Increased footprint by 1.7x, added more depth
const NODES = {
  email: { id: 'email', label: 'EMAIL GATEWAY', position: [-6.8, 0, 0], color: '#8b5cf6' },
  social: { id: 'social', label: 'SOCIAL', position: [-3.4, 0, -5.1], color: '#ec4899' },
  device: { id: 'device', label: 'ENDPOINT', position: [-3.4, 0, 3.4], color: '#3b82f6' },
  browser: { id: 'browser', label: 'BROWSER', position: [0, 0, 5.1], color: '#f59e0b' },
  identity: { id: 'identity', label: 'IDENTITY', position: [3.4, 0, 1.7], color: '#06b6d4' },
  defense: { id: 'defense', label: 'DEFENSE', position: [0, 2.5, 0], color: '#10b981' },
  cloud: { id: 'cloud', label: 'CLOUD ASSETS', position: [6.8, 0, -1.7], color: '#6366f1' },
};

const CONNECTIONS = [
  { source: 'email', target: 'device' },
  { source: 'social', target: 'device' },
  { source: 'device', target: 'browser' },
  { source: 'browser', target: 'identity' },
  { source: 'identity', target: 'defense' },
  { source: 'defense', target: 'cloud' },
  { source: 'identity', target: 'cloud' },
];

function ConnectionLine({ 
  sourcePos, 
  targetPos, 
  isActive, 
  isPathActive 
}: { 
  sourcePos: [number,number,number], 
  targetPos: [number,number,number], 
  isActive: boolean,
  isPathActive: boolean 
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const vSource = useMemo(() => new THREE.Vector3(...sourcePos), [sourcePos]);
  const vTarget = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  
  useFrame((state) => {
    if (isPathActive && pulseRef.current) {
      // Pulse animation along the line
      const t = (state.clock.elapsedTime * 0.8) % 1; // 0 to 1
      pulseRef.current.position.copy(vSource).lerp(vTarget, t);
    }
  });

  return (
    <group>
      <Line
        points={[sourcePos, targetPos]}
        color={isActive ? '#38bdf8' : '#1e293b'}
        lineWidth={isActive ? 3 : 1}
        dashed={!isActive}
        dashScale={5}
        dashSize={0.5}
        dashOffset={0}
        opacity={isActive ? 0.8 : 0.3}
        transparent
      />
      {isPathActive && (
        <Sphere ref={pulseRef} args={[0.15, 8, 8]}>
          <meshBasicMaterial color="#38bdf8" />
        </Sphere>
      )}
    </group>
  );
}

function NetworkNode({ data, isActive, nodeState }: { data: any, isActive: boolean, nodeState?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
    if (glowRef.current && isActive) {
      // Subtle pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  let nodeColor = data.color;
  let emissiveIntensity = isActive ? 1.2 : 0;
  let showWarning = false;
  let showBlocked = false;
  let showSuccess = false;

  if (isActive) {
    if (nodeState === 'WARNING' || nodeState === 'COMPROMISED') {
      nodeColor = '#ef4444'; // Red for compromise/warning
      showWarning = true;
    } else if (nodeState === 'BLOCKED') {
      nodeColor = '#10b981'; // Green for blocked
      showBlocked = true;
    } else if (nodeState === 'SUCCESS') {
      nodeColor = '#3b82f6'; // Blue for recovered
      showSuccess = true;
    }
  }

  return (
    <group position={data.position}>
      <Sphere ref={meshRef} args={[0.5, 24, 24]}>
        <meshStandardMaterial 
          color={isActive ? nodeColor : '#334155'} 
          emissive={isActive ? nodeColor : '#000000'}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.8}
          wireframe={!isActive}
        />
      </Sphere>
      
      {isActive && (
        <Sphere ref={glowRef} args={[0.7, 16, 16]}>
          <meshBasicMaterial color={nodeColor} transparent opacity={0.2} wireframe />
        </Sphere>
      )}
      
      {showWarning && (
        <group position={[0, 1.2, 0]}>
           <Text fontSize={0.3} color="#ef4444" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
             [ ALERT ]
           </Text>
        </group>
      )}

      {showBlocked && (
        <group position={[0, 1.2, 0]}>
           <Text fontSize={0.3} color="#10b981" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
             [ BLOCKED ]
           </Text>
        </group>
      )}

      {showSuccess && (
        <group position={[0, 1.2, 0]}>
           <Text fontSize={0.3} color="#3b82f6" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
             [ RECOVERED ]
           </Text>
        </group>
      )}

      <Text
        position={[0, -0.9, 0]}
        fontSize={0.3}
        color={isActive ? '#ffffff' : '#64748b'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {data.label}
      </Text>
    </group>
  );
}

export function CyberNetwork({ activeScreenId, activeState = 'IDLE' }: CyberNetworkProps) {
  // Path inference based on current active screen.
  // Attack path is active if the target of the connection is the currently active node

  return (
    <group>
      {/* Draw Connections */}
      {CONNECTIONS.map((conn, idx) => {
        const source = NODES[conn.source as keyof typeof NODES];
        const target = NODES[conn.target as keyof typeof NODES];
        
        let targetIsActiveNode = activeScreenId === target.id;
        if (activeScreenId === 'outcome' && target.id === 'cloud') {
           targetIsActiveNode = true;
        }

        const isActive = activeScreenId === source.id || activeScreenId === target.id || (activeScreenId === 'outcome' && (source.id === 'cloud' || target.id === 'cloud'));
        
        // Active pulse flows into the active node
        const isPathActive = targetIsActiveNode;

        return (
          <ConnectionLine
            key={idx}
            sourcePos={source.position as [number,number,number]}
            targetPos={target.position as [number,number,number]}
            isActive={isActive}
            isPathActive={isPathActive}
          />
        );
      })}

      {/* Draw Nodes */}
      {Object.values(NODES).map((node) => {
        const isActive = activeScreenId === node.id || (activeScreenId === 'outcome' && node.id === 'cloud');
        return (
          <NetworkNode 
            key={node.id} 
            data={node} 
            isActive={isActive}
            nodeState={isActive ? activeState : undefined}
          />
        );
      })}
    </group>
  );
}
