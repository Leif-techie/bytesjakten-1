export type FaqItem = {
  question: string;
  answer: string[];
};

export const MOBILABBONEMANG_FAQ: FaqItem[] = [
  {
    question: "Hur gör man ett byte?",
    answer: [
      "Med Bytesjakten är flödet enkelt: registrera dig med dina preferenser, så mejlar vi dig när det är dags att byta till ett kampanjpris utan bindningstid.",
      "När du fått mejlet beställer du kampanjen hos den nya operatören och väljer nummerflytt (nummerportering) så att du behåller ditt nummer. Helst med eSIM – då slipper du vänta på ett plastkort.",
      "När bytet gått igenom anger du kampanjens slutdatum hos oss, så påminner vi dig i tid innan nästa byte.",
    ],
  },
  {
    question: "Hur fungerar nummerflytt?",
    answer: [
      "Nummerflytt (nummerportering) betyder att ditt mobilnummer flyttas från din gamla operatör till den nya.",
      "Du beställer det nya abonnemanget och anger att du vill ta med ditt befintliga nummer. Den nya operatören sköter flytten åt dig – du behöver normalt inte säga upp det gamla abonnemanget separat när numret flyttas över.",
      "Under själva övergången kan nätet tillfälligt saknas en stund. Ha gärna wifi till hands, särskilt om du aktiverar eSIM.",
    ],
  },
  {
    question: "Vad händer med mitt nummer?",
    answer: [
      "Om du väljer nummerflytt behåller du samma mobilnummer hos den nya operatören. Dina kontakter märker ingen skillnad.",
      "Det gamla abonnemanget avslutas i samband med att numret porteras. SMS, samtal och mobil data går sedan via den nya operatören.",
      "Om du däremot tar ett helt nytt nummer får du ett nytt – ditt gamla nummer stannar kvar hos den tidigare operatören tills det abonnemanget sägs upp.",
    ],
  },
  {
    question: "Kan man behålla sitt nummer?",
    answer: [
      "Ja. Nästan alla svenska mobilnummer går att flytta mellan operatörer via nummerportering.",
      "Kryssa i eller välj att du vill behålla ditt nummer när du beställer det nya abonnemanget. Ange ditt nuvarande nummer så att den nya operatören kan beställa flytten.",
    ],
  },
  {
    question: "Hur lång tid tar nummerflytt?",
    answer: [
      "Oftast går nummerflytten på några minuter upp till några timmar när allt är korrekt beställt och aktiverat.",
      "Ibland kan det ta längre – till exempel till nästa vardag – beroende på operatör och tidpunkt. Det är ovanligt att det drar ut mer än ett dygn för vanliga konsumentabonnemang.",
      "Behåll det gamla SIM-kortet eller eSIM:et tills du bekräftat att det nya fungerar för samtal, SMS och surf.",
    ],
  },
  {
    question: "Kan man byta operatör innan bindningstiden gått ut?",
    answer: [
      "Tekniskt sett kan du ofta teckna ett nytt abonnemang och flytta numret även under bindningstid – men du kan bli skyldig kvarvarande avgifter eller uppsägningskostnad hos den gamla operatören.",
      "Bytesjakten fokuserar på kampanjer utan bindningstid, så att du kan byta igen när kampanjpriset tar slut utan att låsas in.",
      "Har du bindningstid kvar: kolla villkoren hos din nuvarande operatör innan du porterar, så du vet vad bytet kostar.",
    ],
  },
  {
    question: "Hur fungerar eSIM?",
    answer: [
      "eSIM är ett digitalt SIM inbyggt i telefonen. I stället för ett plastkort får du en QR-kod eller aktiveringskod från operatören och installerar abonnemanget i telefonens inställningar.",
      "Du beställer abonnemang med eSIM, tar emot koden, skannar den och väntar in att linjen och eventuell nummerflytt aktiveras. Därefter testar du samtal, SMS och surf.",
      "En steg-för-steg-guide finns längre ner på den här sidan.",
    ],
  },
  {
    question: "Är eSIM bättre?",
    answer: [
      "För dig som byter operatör ofta är eSIM oftast smidigare: ingen väntan på postat kort, snabbare aktivering och enklare att ha flera abonnemang i telefonen.",
      "Du slipper öppna SIM-facket och kan göra hela bytet hemma med wifi. Därför rekommenderar vi eSIM när telefonen stödjer det.",
      "Har du en äldre telefon utan eSIM fungerar plast-SIM som vanligt – bytet tar bara lite längre tid.",
    ],
  },
];
