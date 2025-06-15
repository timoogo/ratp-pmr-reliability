import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { LineFamilyCard } from "@/components/LineFamilyCard";
import Link from "next/link";



export default function EtatEquipement() {
return (
    <ContentCardWrapper>
      <h1>Etat Equipement</h1>
        <Link href="/etat-equipement/metro">Métros</Link>
    </ContentCardWrapper>
)
}