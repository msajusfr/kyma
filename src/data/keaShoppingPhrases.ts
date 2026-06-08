import type { GreekPhrase } from "../types/GreekPhrase";

type KeaPhraseSeed = [
  greek: string,
  transliteration: string,
  translation: string,
  options: string[],
];

const keaSeriesSeeds: Record<number, KeaPhraseSeed[]> = {
  1: [
    ["Θέλω νερό.", "Thelo nero.", "Je veux de l'eau.", ["Je veux de l'eau.", "Je veux du pain.", "Je veux du lait.", "Je veux du café."]],
    ["Έχετε γάλα;", "Ehete gala?", "Vous avez du lait ?", ["Vous avez du lait ?", "Vous avez du pain ?", "Vous avez du poisson ?", "Vous avez du fromage ?"]],
    ["Πού είναι το ρύζι;", "Pou einai to ryzi?", "Où est le riz ?", ["Où est le riz ?", "Où est le pain ?", "Où est la caisse ?", "Où est le bateau ?"]],
    ["Θέλω μήλα.", "Thelo mila.", "Je veux des pommes.", ["Je veux des pommes.", "Je veux des tomates.", "Je veux des oeufs.", "Je veux des sacs."]],
    ["Ένα κιλό ντομάτες.", "Ena kilo domates.", "Un kilo de tomates.", ["Un kilo de tomates.", "Un litre de lait.", "Un paquet de riz.", "Un pain chaud."]],
    ["Πόσο κάνει;", "Poso kanei?", "Combien ça coûte ?", ["Combien ça coûte ?", "Où est-ce ?", "C'est ouvert ?", "Vous avez du pain ?"]],
    ["Είναι φτηνό.", "Einai ftino.", "C'est bon marché.", ["C'est bon marché.", "C'est fermé.", "C'est froid.", "C'est loin."]],
    ["Είναι ακριβό.", "Einai akrivo.", "C'est cher.", ["C'est cher.", "C'est gratuit.", "C'est ouvert.", "C'est petit."]],
    ["Θέλω σακούλα.", "Thelo sakoula.", "Je veux un sac.", ["Je veux un sac.", "Je veux la plage.", "Je veux une table.", "Je veux un ticket."]],
    ["Με κάρτα, παρακαλώ.", "Me karta, parakalo.", "Par carte, s'il vous plaît.", ["Par carte, s'il vous plaît.", "En espèces, s'il vous plaît.", "Avec du pain, s'il vous plaît.", "Demain, s'il vous plaît."]],
    ["Με μετρητά.", "Me metrita.", "En espèces.", ["En espèces.", "Avec du fromage.", "Dans le panier.", "Au four."]],
    ["Πού είναι το ταμείο;", "Pou einai to tameio?", "Où est la caisse ?", ["Où est la caisse ?", "Où est la mer ?", "Où est le boucher ?", "Où est le pain ?"]],
    ["Θέλω αυγά.", "Thelo avga.", "Je veux des oeufs.", ["Je veux des oeufs.", "Je veux des olives.", "Je veux du miel.", "Je veux du poulet."]],
    ["Έχετε ελαιόλαδο;", "Ehete elaiolado?", "Vous avez de l'huile d'olive ?", ["Vous avez de l'huile d'olive ?", "Vous avez du pain chaud ?", "Vous avez du boeuf ?", "Vous avez une caisse ?"]],
    ["Θέλω καφέ.", "Thelo kafe.", "Je veux du café.", ["Je veux du café.", "Je veux du sel.", "Je veux du porc.", "Je veux du pain."]],
    ["Πού είναι το αλάτι;", "Pou einai to alati?", "Où est le sel ?", ["Où est le sel ?", "Où est le lait ?", "Où est le miel ?", "Où est le sac ?"]],
    ["Έχετε τυρί;", "Ehete tyri?", "Vous avez du fromage ?", ["Vous avez du fromage ?", "Vous avez des pommes ?", "Vous avez du pain ?", "Vous avez des sacs ?"]],
    ["Θέλω γιαούρτι.", "Thelo yaourti.", "Je veux du yaourt.", ["Je veux du yaourt.", "Je veux du riz.", "Je veux des oranges.", "Je veux du jambon."]],
    ["Είναι φρέσκο;", "Einai fresko?", "C'est frais ?", ["C'est frais ?", "C'est fermé ?", "C'est loin ?", "C'est salé ?"]],
    ["Ευχαριστώ πολύ.", "Efharisto poly.", "Merci beaucoup.", ["Merci beaucoup.", "Bonjour.", "C'est combien ?", "Je veux payer."]],
  ],
  2: [
    ["Θέλω κοτόπουλο.", "Thelo kotopoulo.", "Je veux du poulet.", ["Je veux du poulet.", "Je veux du pain.", "Je veux des pommes.", "Je veux du lait."]],
    ["Έχετε κιμά;", "Ehete kima?", "Vous avez de la viande hachée ?", ["Vous avez de la viande hachée ?", "Vous avez du pain chaud ?", "Vous avez du riz ?", "Vous avez des olives ?"]],
    ["Μισό κιλό, παρακαλώ.", "Miso kilo, parakalo.", "Un demi-kilo, s'il vous plaît.", ["Un demi-kilo, s'il vous plaît.", "Un litre, s'il vous plaît.", "Une tranche, s'il vous plaît.", "Une bouteille, s'il vous plaît."]],
    ["Ένα κιλό μοσχάρι.", "Ena kilo moschari.", "Un kilo de boeuf.", ["Un kilo de boeuf.", "Un kilo de tomates.", "Un kilo de pommes.", "Un kilo de pain."]],
    ["Θέλω χοιρινό.", "Thelo hirino.", "Je veux du porc.", ["Je veux du porc.", "Je veux du miel.", "Je veux du sel.", "Je veux du yaourt."]],
    ["Είναι καλό για σούπα;", "Einai kalo gia soupa?", "C'est bon pour la soupe ?", ["C'est bon pour la soupe ?", "C'est bon pour le café ?", "C'est bon pour le pain ?", "C'est bon pour la plage ?"]],
    ["Κόψτε το μικρό.", "Kopste to mikro.", "Coupez-le petit.", ["Coupez-le petit.", "Gardez-le entier.", "Mettez-le au frigo.", "Pesez-le encore."]],
    ["Κόψτε το σε φέτες.", "Kopste to se fetes.", "Coupez-le en tranches.", ["Coupez-le en tranches.", "Mettez-le dans un sac.", "Je le veux demain.", "C'est trop cher."]],
    ["Έχετε αρνί;", "Ehete arni?", "Vous avez de l'agneau ?", ["Vous avez de l'agneau ?", "Vous avez du fromage ?", "Vous avez du pain ?", "Vous avez des oeufs ?"]],
    ["Θέλω λίγο ζαμπόν.", "Thelo ligo zampon.", "Je veux un peu de jambon.", ["Je veux un peu de jambon.", "Je veux beaucoup d'eau.", "Je veux un café.", "Je veux un sac."]],
    ["Πόσο κάνει το κιλό;", "Poso kanei to kilo?", "Combien coûte le kilo ?", ["Combien coûte le kilo ?", "Où est le kilo ?", "C'est ouvert aujourd'hui ?", "Vous avez du sel ?"]],
    ["Είναι για σήμερα.", "Einai gia simera.", "C'est pour aujourd'hui.", ["C'est pour aujourd'hui.", "C'est pour demain.", "C'est pour le pain.", "C'est pour la mer."]],
    ["Βάλτε το σε σακούλα.", "Valte to se sakoula.", "Mettez-le dans un sac.", ["Mettez-le dans un sac.", "Coupez-le en deux.", "C'est trop petit.", "Je paie maintenant."]],
    ["Θέλω κάτι απλό.", "Thelo kati aplo.", "Je veux quelque chose de simple.", ["Je veux quelque chose de simple.", "Je veux quelque chose de sucré.", "Je veux quelque chose de froid.", "Je veux quelque chose de loin."]],
    ["Τι προτείνετε;", "Ti protinete?", "Que recommandez-vous ?", ["Que recommandez-vous ?", "Où payez-vous ?", "Quand partez-vous ?", "Vous comprenez ?"]],
    ["Θέλω για δύο άτομα.", "Thelo gia dyo atoma.", "Je veux pour deux personnes.", ["Je veux pour deux personnes.", "Je veux deux pains.", "Je veux deux sacs.", "Je veux deux cafés."]],
    ["Όχι πολύ λίπος.", "Ohi poly lipos.", "Pas trop de gras.", ["Pas trop de gras.", "Pas trop de pain.", "Pas trop de sel.", "Pas trop de lait."]],
    ["Είναι ντόπιο;", "Einai dopio?", "C'est local ?", ["C'est local ?", "C'est ouvert ?", "C'est salé ?", "C'est petit ?"]],
    ["Θα το πάρω.", "Tha to paro.", "Je vais le prendre.", ["Je vais le prendre.", "Je vais attendre.", "Je vais partir.", "Je vais le couper."]],
    ["Μπορώ να πληρώσω;", "Boro na pliroso?", "Je peux payer ?", ["Je peux payer ?", "Je peux entrer ?", "Je peux goûter ?", "Je peux attendre ?"]],
  ],
  3: [
    ["Θέλω ψωμί.", "Thelo psomi.", "Je veux du pain.", ["Je veux du pain.", "Je veux du poulet.", "Je veux des pommes.", "Je veux du lait."]],
    ["Έχετε φρέσκο ψωμί;", "Ehete fresko psomi?", "Vous avez du pain frais ?", ["Vous avez du pain frais ?", "Vous avez du boeuf frais ?", "Vous avez du riz ?", "Vous avez des sacs ?"]],
    ["Ένα καρβέλι, παρακαλώ.", "Ena karveli, parakalo.", "Une miche, s'il vous plaît.", ["Une miche, s'il vous plaît.", "Un kilo, s'il vous plaît.", "Une bouteille, s'il vous plaît.", "Une tranche de viande."]],
    ["Θέλω δύο κουλούρια.", "Thelo dyo koulouria.", "Je veux deux koulouria.", ["Je veux deux koulouria.", "Je veux deux cafés.", "Je veux deux sacs.", "Je veux deux tomates."]],
    ["Έχετε τυρόπιτα;", "Ehete tyropita?", "Vous avez une tarte au fromage ?", ["Vous avez une tarte au fromage ?", "Vous avez de l'huile ?", "Vous avez de l'agneau ?", "Vous avez du sel ?"]],
    ["Θέλω σπανακόπιτα.", "Thelo spanakopita.", "Je veux une spanakopita.", ["Je veux une spanakopita.", "Je veux une côtelette.", "Je veux du yaourt.", "Je veux du riz."]],
    ["Είναι ζεστό;", "Einai zesto?", "C'est chaud ?", ["C'est chaud ?", "C'est cher ?", "C'est local ?", "C'est fermé ?"]],
    ["Θέλω κάτι γλυκό.", "Thelo kati glyko.", "Je veux quelque chose de sucré.", ["Je veux quelque chose de sucré.", "Je veux quelque chose de salé.", "Je veux quelque chose de simple.", "Je veux quelque chose de local."]],
    ["Έχετε μέλι;", "Ehete meli?", "Vous avez du miel ?", ["Vous avez du miel ?", "Vous avez du poulet ?", "Vous avez du porc ?", "Vous avez des tomates ?"]],
    ["Θέλω ένα κρουασάν.", "Thelo ena krouasan.", "Je veux un croissant.", ["Je veux un croissant.", "Je veux un sac.", "Je veux un kilo.", "Je veux une caisse."]],
    ["Πόσο κάνει το ψωμί;", "Poso kanei to psomi?", "Combien coûte le pain ?", ["Combien coûte le pain ?", "Où est le pain ?", "Vous avez du pain ?", "Le pain est chaud ?"]],
    ["Είναι για πρωινό.", "Einai gia proino.", "C'est pour le petit-déjeuner.", ["C'est pour le petit-déjeuner.", "C'est pour la soupe.", "C'est pour ce soir.", "C'est pour le bateau."]],
    ["Θέλω μικρό ψωμί.", "Thelo mikro psomi.", "Je veux un petit pain.", ["Je veux un petit pain.", "Je veux un grand sac.", "Je veux un peu de viande.", "Je veux du lait froid."]],
    ["Έχετε ψωμί ολικής;", "Ehete psomi olikis?", "Vous avez du pain complet ?", ["Vous avez du pain complet ?", "Vous avez du boeuf ?", "Vous avez du fromage ?", "Vous avez des oranges ?"]],
    ["Κόψτε το στη μέση.", "Kopste to sti mesi.", "Coupez-le en deux.", ["Coupez-le en deux.", "Mettez-le au four.", "Donnez-moi du lait.", "C'est trop chaud."]],
    ["Θέλω για το σπίτι.", "Thelo gia to spiti.", "Je veux pour la maison.", ["Je veux pour la maison.", "Je veux pour le bateau.", "Je veux pour le boucher.", "Je veux pour la caisse."]],
    ["Τι είναι αυτό;", "Ti einai afto?", "Qu'est-ce que c'est ?", ["Qu'est-ce que c'est ?", "Combien ça coûte ?", "Où est-ce ?", "C'est frais ?"]],
    ["Είναι με τυρί;", "Einai me tyri?", "C'est avec du fromage ?", ["C'est avec du fromage ?", "C'est avec du porc ?", "C'est avec du café ?", "C'est avec du riz ?"]],
    ["Θα πάρω τρία.", "Tha paro tria.", "Je vais en prendre trois.", ["Je vais en prendre trois.", "Je vais payer demain.", "Je vais couper le pain.", "Je vais au marché."]],
    ["Καλή συνέχεια.", "Kali sinehia.", "Bonne continuation.", ["Bonne continuation.", "Combien ça coûte ?", "Je veux du pain.", "Où est la caisse ?"]],
  ],
};

function makeKeaSeries(series: number): GreekPhrase[] {
  const seeds = keaSeriesSeeds[series];

  return Array.from({ length: 100 }, (_, index) => {
    const seed = seeds[index % seeds.length];

    return {
      greek: seed[0],
      transliteration: seed[1],
      translation: seed[2],
      options: seed[3],
      id: `kea-s${series}-${String(index + 1).padStart(3, "0")}`,
      series,
      difficulty: series,
    };
  });
}

export const keaShoppingPhrases: GreekPhrase[] = [1, 2, 3].flatMap(makeKeaSeries);
