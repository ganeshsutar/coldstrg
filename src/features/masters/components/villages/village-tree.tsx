import { useMemo } from "react";
import { ChevronRight, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Village, VillageTreeNode } from "../../types";

interface VillageTreeProps {
  villages: Village[];
  onEdit: (village: Village) => void;
  onDelete: (village: Village) => void;
}

export function VillageTree({ villages, onEdit, onDelete }: VillageTreeProps) {
  const tree = useMemo(() => {
    const stateMap = new Map<string, Map<string, Village[]>>();

    for (const village of villages) {
      if (!stateMap.has(village.stateName)) {
        stateMap.set(village.stateName, new Map());
      }
      const districtMap = stateMap.get(village.stateName)!;
      if (!districtMap.has(village.districtName)) {
        districtMap.set(village.districtName, []);
      }
      districtMap.get(village.districtName)!.push(village);
    }

    const nodes: VillageTreeNode[] = [];
    for (const [stateName, districtMap] of stateMap) {
      const districts = [];
      for (const [districtName, vills] of districtMap) {
        districts.push({
          districtName,
          villages: vills.sort((a, b) => a.name.localeCompare(b.name)),
        });
      }
      districts.sort((a, b) => a.districtName.localeCompare(b.districtName));
      nodes.push({ stateName, districts });
    }
    nodes.sort((a, b) => a.stateName.localeCompare(b.stateName));
    return nodes;
  }, [villages]);

  if (tree.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No villages found. Add your first village.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tree.map((stateNode) => (
        <Collapsible key={stateNode.stateName} defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-accent text-left font-medium text-sm">
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            {stateNode.stateName}
            <Badge variant="secondary" className="ml-auto text-xs">
              {stateNode.districts.reduce(
                (acc, d) => acc + d.villages.length,
                0
              )}
            </Badge>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6">
            {stateNode.districts.map((districtNode) => (
              <Collapsible key={districtNode.districtName} defaultOpen>
                <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md hover:bg-accent text-left text-sm">
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                  {districtNode.districtName}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {districtNode.villages.length}
                  </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6">
                  {districtNode.villages.map((village) => (
                    <div
                      key={village.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-accent group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs text-muted-foreground">
                          {village.code}
                        </span>
                        <span className="text-sm truncate">{village.name}</span>
                        {village.nameHindi && (
                          <span className="text-xs text-muted-foreground truncate">
                            ({village.nameHindi})
                          </span>
                        )}
                        {village.isActive === false && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onEdit(village)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onDelete(village)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
