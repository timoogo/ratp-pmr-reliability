import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EquipmentDetailPage({ params }: any) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { family, line, station, equipment } = params;

  function randomizeStatus() {
    return Math.random() < 0.5 ? "ok" : "ko";
  }

  const equipmentData = await prisma.equipment.findUnique({
    where: {
      code: equipment,
    },
    include: {
      station: true,
    },
  });
  console.log("params.equipment =", equipment);
  if (!equipmentData) return notFound();

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">{equipmentData.name}</h1>

      <ContentCardWrapper>
        <p>{equipmentData.status}</p>
      </ContentCardWrapper>

      <ContentCardWrapper>
        <h2 className="text-lg font-bold">Historique</h2>
        <Stepper orientation="vertical">
          <StepperItem step={1}>
            <StepperTrigger>
              <StepperTitle>2024-02-15</StepperTitle>
              <StepperDescription>
                <p>{randomizeStatus()}</p>
              </StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem step={2}>
            <StepperTrigger>
              <StepperTitle>2024-02-01</StepperTitle>
              <StepperDescription>
                <p>{randomizeStatus()}</p>
              </StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem step={3}>
            <StepperTrigger>
              <StepperTitle>2024-01-15</StepperTitle>
              <StepperDescription>
                <p>{randomizeStatus()}</p>
              </StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem step={4}>
            <StepperTrigger>
              <StepperTitle>2024-01-01</StepperTitle>
              <StepperDescription>
                <p>{randomizeStatus()}</p>
              </StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem step={5}>
            <StepperTrigger>
              <StepperTitle>2023-12-15</StepperTitle>
              <StepperDescription>
                <p>{randomizeStatus()}</p>
              </StepperDescription>
            </StepperTrigger>
          </StepperItem>
        </Stepper>
      </ContentCardWrapper>

      <ContentCardWrapper>
        <h2 className="text-lg font-bold">Signaler un incident</h2>
        <p>
          Vous avez constaté un incident sur l'équipement ?
        </p>
        <Button>Signaler un incident</Button>
      </ContentCardWrapper>
    </div>
  );
}
