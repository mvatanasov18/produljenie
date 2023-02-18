<script lang='ts'>
	import { Group, Line2 } from "@threlte/core";
	import type { ConstellationData } from "src/types";
	import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
  export let constellation: ConstellationData;
</script>

<Group >
  <!-- <Text position={constellation.connections[0].startingStar?.coordinates}>{constellation.name}</Text> -->
    {#each constellation.connections as connection }
        <Line2
            points={[
              [Number(connection.startingStar?.coordinates.x)
              ,Number(connection.startingStar?.coordinates.y)
              ,Number(connection.startingStar?.coordinates.z)],
              [Number(connection.endingStar?.coordinates.x)
              ,Number(connection.endingStar?.coordinates.y)
              ,Number(connection.endingStar?.coordinates.z)],
            ]}
            material={new LineMaterial({
              linewidth: 0.001,
              color: 0xe3c27f
            })}
        />
    {/each}
</Group>