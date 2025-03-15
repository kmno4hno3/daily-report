"use client";

import { ReportWrapper } from "@/src/features/report";
import { Suspense } from "react";

export const ContentArea: React.FC = () => {
  return (
    <Suspense>
      <ReportWrapper />
    </Suspense>
  );
};
