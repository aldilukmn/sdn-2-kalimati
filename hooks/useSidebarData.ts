import { useState, useEffect, useMemo } from "react";
import AssessmentConfigService from "@/services/assessment-config.service";
import { menuItems, penjagaMenuItems, guruAllowedHrefs, SidebarItem } from "@/lib/constants/menu";

export function useSidebarData(userRole: string | null, userGrade: string | null) {
  const [showLitnum, setShowLitnum] = useState(false);

  useEffect(() => {
    if (!userRole) return;
    AssessmentConfigService.getAll(userRole === "guru" && userGrade ? { grade: userGrade } : undefined)
      .then((res) => {
        const configs = res?.result || [];
        const hasLitnum = configs.some((cfg) =>
          cfg.components.some((c) => c.key === "litnum")
        );
        setShowLitnum(hasLitnum);
      })
      .catch(() => {});
  }, [userRole, userGrade]);

  const isItemAllowed = (item: SidebarItem): boolean => {
    if ("href" in item) return guruAllowedHrefs.has(item.href);
    return item.children.some((c) => guruAllowedHrefs.has(c.href));
  };

  const filteredMenuItems = useMemo(() => {
    if (userRole === null) return [];
    
    let baseMenu = menuItems;
    if (userRole === "penjaga") return penjagaMenuItems;
    
    if (!showLitnum) {
      baseMenu = baseMenu.map((item) => {
        if ("children" in item) {
          return {
            ...item,
            children: item.children.filter((c) => c.href !== "/nilai-litnum"),
          };
        }
        return item;
      });
    }

    if (userRole === "guru") return baseMenu.filter(isItemAllowed);
    return baseMenu;
  }, [userRole, showLitnum]);

  return { filteredMenuItems, guruAllowedHrefs };
}
