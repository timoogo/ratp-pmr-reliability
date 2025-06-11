"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const SubHeader = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [equipmentLabel, setEquipmentLabel] = useState<string | null>(null);

  const isEquipmentPage = segments.length === 5

  useEffect(() => {
    if (!isEquipmentPage) return;

    const equipmentCode = segments[5]; // last segment
    fetch(`/api/equipment/${equipmentCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) {
          setEquipmentLabel(data.name + " " + data.code);
        }
      })
      .catch(() => setEquipmentLabel(null));
  }, [segments, isEquipmentPage]);

  return (
    <div className="border-b bg-muted px-4 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Accueil</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;
            const isEquipment = isLast && isEquipmentPage;

            return (
              <div key={href} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={href}>
                      {isEquipment && equipmentLabel
                        ? equipmentLabel
                        : decodeURIComponent(segment)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
