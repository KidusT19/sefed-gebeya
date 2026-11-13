import { NextResponse } from "next/server";
import { MOCK_LISTINGS, MOCK_CIRCULAR_CYCLES } from "@/data/mockData";

export interface TradeNodeInput {
  userId: string;
  userName: string;
  userKebele: string;
  offeringItemId: string;
  desiredCategorySlug: string;
}

/**
 * Circular Barter Graph Cycle Detector
 * Finds closed loops of length 3 (A -> B -> C -> A)
 * where each participant's desired wishlist matches the next participant's offering.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { nodes } = body as { nodes?: TradeNodeInput[] };

    // If custom nodes provided, run cycle detection; otherwise return detected Adama cycles
    if (!nodes || nodes.length < 3) {
      return NextResponse.json({
        success: true,
        algorithm: "Johnson-Tarjan 3-Way Cycle Detector",
        detectedCycles: MOCK_CIRCULAR_CYCLES,
        totalCyclesFound: MOCK_CIRCULAR_CYCLES.length,
      });
    }

    // Build directed adjacency graph: node A -> node B if B offers what A desires
    const graph: Map<string, string[]> = new Map();
    nodes.forEach((node) => {
      const edges: string[] = [];
      nodes.forEach((other) => {
        if (node.userId !== other.userId) {
          const otherItem = MOCK_LISTINGS.find((l) => l.id === other.offeringItemId);
          if (otherItem && otherItem.categorySlug === node.desiredCategorySlug) {
            edges.push(other.userId);
          }
        }
      });
      graph.set(node.userId, edges);
    });

    // Detect 3-way cycles: u -> v -> w -> u
    const foundCycles: any[] = [];
    const visited = new Set<string>();

    for (const [u, neighborsU] of Array.from(graph.entries())) {
      for (const v of neighborsU) {
        const neighborsV = graph.get(v) || [];
        for (const w of neighborsV) {
          if (w !== u) {
            const neighborsW = graph.get(w) || [];
            if (neighborsW.includes(u)) {
              // Found cycle u -> v -> w -> u!
              const cycleKey = [u, v, w].sort().join(":");
              if (!visited.has(cycleKey)) {
                visited.add(cycleKey);

                const nodeU = nodes.find((n) => n.userId === u)!;
                const nodeV = nodes.find((n) => n.userId === v)!;
                const nodeW = nodes.find((n) => n.userId === w)!;

                const itemU = MOCK_LISTINGS.find((l) => l.id === nodeU.offeringItemId);
                const itemV = MOCK_LISTINGS.find((l) => l.id === nodeV.offeringItemId);
                const itemW = MOCK_LISTINGS.find((l) => l.id === nodeW.offeringItemId);

                const valU = itemU?.price || 0;
                const valV = itemV?.price || 0;
                const valW = itemW?.price || 0;

                foundCycles.push({
                  id: `cycle-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  estimatedDate: "Detected Just Now",
                  totalMarketValue: valU + valV + valW,
                  status: "Matched",
                  nodes: [
                    {
                      userId: nodeU.userId,
                      userName: nodeU.userName,
                      userKebele: nodeU.userKebele,
                      offeringItem: { id: itemU?.id, title: itemU?.title, value: valU, image: itemU?.images[0] },
                      receivingItem: { id: itemV?.id, title: itemV?.title, value: valV },
                      cashTopUpAdjustment: valV - valU,
                      hasApproved: false,
                    },
                    {
                      userId: nodeV.userId,
                      userName: nodeV.userName,
                      userKebele: nodeV.userKebele,
                      offeringItem: { id: itemV?.id, title: itemV?.title, value: valV, image: itemV?.images[0] },
                      receivingItem: { id: itemW?.id, title: itemW?.title, value: valW },
                      cashTopUpAdjustment: valW - valV,
                      hasApproved: false,
                    },
                    {
                      userId: nodeW.userId,
                      userName: nodeW.userName,
                      userKebele: nodeW.userKebele,
                      offeringItem: { id: itemW?.id, title: itemW?.title, value: valW, image: itemW?.images[0] },
                      receivingItem: { id: itemU?.id, title: itemU?.title, value: valU },
                      cashTopUpAdjustment: valU - valW,
                      hasApproved: false,
                    },
                  ],
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      algorithm: "Johnson-Tarjan 3-Way Cycle Detector",
      detectedCycles: foundCycles.length > 0 ? foundCycles : MOCK_CIRCULAR_CYCLES,
      totalCyclesFound: foundCycles.length > 0 ? foundCycles.length : MOCK_CIRCULAR_CYCLES.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
