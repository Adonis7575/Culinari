// Culinaria translations.
// UI rows are [en, es, fr, pt, de, it, id]. TERMS rows are [es, fr, pt, de, it, id]
// keyed by the English value the app (and the AI prompts) use internally.

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", locale: "en-US" },
  { code: "es", name: "Spanish", native: "Español", locale: "es" },
  { code: "fr", name: "French", native: "Français", locale: "fr-FR" },
  { code: "pt", name: "Portuguese", native: "Português", locale: "pt-BR" },
  { code: "de", name: "German", native: "Deutsch", locale: "de-DE" },
  { code: "it", name: "Italian", native: "Italiano", locale: "it-IT" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", locale: "id-ID" },
] as const;

export type LanguageCode = typeof LANGUAGES[number]["code"];
export type Language = typeof LANGUAGES[number];

const LANGUAGE_INDEX: Record<LanguageCode, number> = {
  en: 0, es: 1, fr: 2, pt: 3, de: 4, it: 5, id: 6,
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";

type Row = readonly [string, string, string, string, string, string, string];
type TermRow = readonly [string, string, string, string, string, string];

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && value in LANGUAGE_INDEX;
}

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES[LANGUAGE_INDEX[code]];
}

/** Best match for the visitor's browser languages, or English. */
export function detectLanguage(preferred: readonly string[]): LanguageCode {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split("-")[0];
    if (base === "in") return "id"; // legacy Indonesian tag
    if (isLanguageCode(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}

const UI = {
  // ── Language switcher ──
  language: ["Language", "Idioma", "Langue", "Idioma", "Sprache", "Lingua", "Bahasa"],
  chooseLanguage: ["Choose language", "Elige un idioma", "Choisir la langue", "Escolha o idioma", "Sprache wählen", "Scegli la lingua", "Pilih bahasa"],
  currentLanguage: ["Language: {name}", "Idioma: {name}", "Langue : {name}", "Idioma: {name}", "Sprache: {name}", "Lingua: {name}", "Bahasa: {name}"],
  langMenuNote: [
    "New recipes will be written in this language.",
    "Las recetas nuevas se escribirán en este idioma.",
    "Les nouvelles recettes seront rédigées dans cette langue.",
    "As novas receitas serão escritas neste idioma.",
    "Neue Rezepte werden in dieser Sprache verfasst.",
    "Le nuove ricette saranno scritte in questa lingua.",
    "Resep baru akan ditulis dalam bahasa ini.",
  ],

  // ── Navigation ──
  skipToContent: ["Skip to main content", "Saltar al contenido principal", "Aller au contenu principal", "Pular para o conteúdo principal", "Zum Hauptinhalt springen", "Vai al contenuto principale", "Langsung ke konten utama"],
  primaryNav: ["Primary", "Principal", "Principale", "Principal", "Hauptnavigation", "Principale", "Utama"],
  navGenerate: ["Generate", "Generar", "Générer", "Gerar", "Erstellen", "Genera", "Buat"],
  navDiscover: ["Discover", "Descubrir", "Découvrir", "Descobrir", "Entdecken", "Scopri", "Jelajahi"],
  navPantry: ["Pantry", "Despensa", "Placard", "Despensa", "Vorrat", "Dispensa", "Dapur"],
  navPlanner: ["Planner", "Plan", "Menus", "Cardápio", "Planer", "Menù", "Rencana"],
  navSaved: ["Saved", "Guardadas", "Favoris", "Salvas", "Favoriten", "Salvate", "Tersimpan"],
  nightMode: ["Night mode", "Modo nocturno", "Mode nuit", "Modo noturno", "Nachtmodus", "Modalità notte", "Mode malam"],
  switchToDay: ["Switch to day mode", "Cambiar a modo día", "Passer en mode jour", "Mudar para o modo dia", "Zum Tagmodus wechseln", "Passa alla modalità giorno", "Beralih ke mode siang"],
  switchToNight: ["Switch to night mode", "Cambiar a modo nocturno", "Passer en mode nuit", "Mudar para o modo noturno", "Zum Nachtmodus wechseln", "Passa alla modalità notte", "Beralih ke mode malam"],

  // ── Feedback ──
  fbKicker: ["Private note", "Nota privada", "Note privée", "Nota privada", "Private Nachricht", "Nota privata", "Catatan pribadi"],
  fbTitle: ["Share feedback", "Envía tus comentarios", "Donner votre avis", "Envie sua opinião", "Feedback geben", "Lascia un feedback", "Kirim masukan"],
  fbClose: ["Close feedback form", "Cerrar formulario de comentarios", "Fermer le formulaire d'avis", "Fechar formulário de opinião", "Feedback-Formular schließen", "Chiudi il modulo di feedback", "Tutup formulir masukan"],
  fbThanks: ["Thank you.", "Gracias.", "Merci.", "Obrigado.", "Danke.", "Grazie.", "Terima kasih."],
  fbSent: ["Your feedback was sent privately.", "Tus comentarios se enviaron de forma privada.", "Votre avis a été envoyé en privé.", "Sua opinião foi enviada de forma privada.", "Dein Feedback wurde privat gesendet.", "Il tuo feedback è stato inviato in privato.", "Masukanmu telah dikirim secara pribadi."],
  fbAnother: ["Send another note", "Enviar otra nota", "Envoyer une autre note", "Enviar outra nota", "Weitere Nachricht senden", "Invia un'altra nota", "Kirim catatan lain"],
  fbQuestion: ["What could be better?", "¿Qué podríamos mejorar?", "Qu'est-ce qui pourrait être amélioré ?", "O que poderia ser melhor?", "Was könnten wir besser machen?", "Cosa potremmo migliorare?", "Apa yang bisa lebih baik?"],
  fbPlaceholder: ["A quick thought, bug, or idea...", "Una idea, un error o una sugerencia...", "Une remarque, un bug ou une idée...", "Uma ideia, um erro ou uma sugestão...", "Ein kurzer Gedanke, ein Fehler oder eine Idee ...", "Un pensiero, un bug o un'idea...", "Pemikiran singkat, bug, atau ide..."],
  fbEmail: ["Email", "Correo", "E-mail", "E-mail", "E-Mail", "Email", "Email"],
  fbEmailHint: ["(optional, for a reply)", "(opcional, para responderte)", "(facultatif, pour une réponse)", "(opcional, para resposta)", "(optional, für eine Antwort)", "(facoltativa, per una risposta)", "(opsional, untuk balasan)"],
  fbOwnerOnly: ["Your note goes only to the Culinaria owner.", "Tu nota solo la recibe el dueño de Culinaria.", "Votre note est envoyée uniquement au propriétaire de Culinaria.", "Sua nota vai apenas para o dono do Culinaria.", "Deine Nachricht geht nur an den Betreiber von Culinaria.", "La tua nota arriva solo al titolare di Culinaria.", "Catatanmu hanya dikirim ke pemilik Culinaria."],
  fbSending: ["Sending...", "Enviando...", "Envoi...", "Enviando...", "Wird gesendet ...", "Invio in corso...", "Mengirim..."],
  fbSend: ["Send privately", "Enviar en privado", "Envoyer en privé", "Enviar em privado", "Privat senden", "Invia in privato", "Kirim secara pribadi"],
  fbTrigger: ["Feedback", "Comentarios", "Avis", "Opinião", "Feedback", "Feedback", "Masukan"],
  fbTooShort: ["Please share at least a few words.", "Escribe al menos unas palabras.", "Écrivez au moins quelques mots.", "Escreva pelo menos algumas palavras.", "Bitte schreib mindestens ein paar Worte.", "Scrivi almeno qualche parola.", "Tulis setidaknya beberapa kata."],
  fbFailed: ["Feedback could not be sent. Please try again.", "No se pudieron enviar los comentarios. Inténtalo de nuevo.", "Votre avis n'a pas pu être envoyé. Veuillez réessayer.", "Não foi possível enviar sua opinião. Tente novamente.", "Feedback konnte nicht gesendet werden. Bitte versuch es erneut.", "Impossibile inviare il feedback. Riprova.", "Masukan gagal dikirim. Silakan coba lagi."],
  fbInvalidEmail: ["Please enter a valid reply email.", "Introduce un correo válido para responderte.", "Veuillez saisir une adresse e-mail valide.", "Informe um e-mail válido para resposta.", "Bitte gib eine gültige E-Mail-Adresse ein.", "Inserisci un indirizzo email valido.", "Masukkan email balasan yang valid."],
  fbNotConfigured: ["Private feedback is not configured yet.", "Los comentarios privados aún no están configurados.", "Les avis privés ne sont pas encore configurés.", "O envio de opiniões ainda não está configurado.", "Privates Feedback ist noch nicht eingerichtet.", "Il feedback privato non è ancora configurato.", "Masukan pribadi belum dikonfigurasi."],
  fbTooMany: ["Too many notes were sent recently. Please try again later.", "Se enviaron demasiadas notas recientemente. Inténtalo más tarde.", "Trop de notes ont été envoyées récemment. Réessayez plus tard.", "Muitas notas foram enviadas recentemente. Tente mais tarde.", "Zu viele Nachrichten in kurzer Zeit. Bitte versuch es später erneut.", "Troppe note inviate di recente. Riprova più tardi.", "Terlalu banyak catatan dikirim baru-baru ini. Coba lagi nanti."],

  // ── Ingredient wheel ──
  wheelBack: ["Scroll ingredients backward", "Desplazar ingredientes hacia atrás", "Faire défiler les ingrédients vers l'arrière", "Rolar ingredientes para trás", "Zutaten zurückscrollen", "Scorri gli ingredienti indietro", "Geser bahan ke belakang"],
  wheelForward: ["Scroll ingredients forward", "Desplazar ingredientes hacia adelante", "Faire défiler les ingrédients vers l'avant", "Rolar ingredientes para frente", "Zutaten vorwärtsscrollen", "Scorri gli ingredienti avanti", "Geser bahan ke depan"],
  wheelLabel: ["Selected ingredients. Use the mouse wheel or arrow keys to scroll.", "Ingredientes seleccionados. Usa la rueda del ratón o las flechas para desplazarte.", "Ingrédients sélectionnés. Utilisez la molette ou les flèches pour faire défiler.", "Ingredientes selecionados. Use a roda do mouse ou as setas para rolar.", "Ausgewählte Zutaten. Mit Mausrad oder Pfeiltasten scrollen.", "Ingredienti selezionati. Usa la rotella del mouse o le frecce per scorrere.", "Bahan terpilih. Gunakan roda mouse atau tombol panah untuk menggeser."],
  wheelTitle: ["Use the mouse wheel or arrows to scroll ingredients", "Usa la rueda del ratón o las flechas para ver los ingredientes", "Utilisez la molette ou les flèches pour parcourir les ingrédients", "Use a roda do mouse ou as setas para ver os ingredientes", "Mit Mausrad oder Pfeilen durch die Zutaten scrollen", "Usa la rotella o le frecce per scorrere gli ingredienti", "Gunakan roda mouse atau panah untuk menggeser bahan"],
  wheelEmpty: ["Add what you have on hand", "Añade lo que tengas a mano", "Ajoutez ce que vous avez sous la main", "Adicione o que você tem em casa", "Füge hinzu, was du da hast", "Aggiungi quello che hai in casa", "Tambahkan bahan yang kamu punya"],
  removeNamed: ["Remove {name}", "Quitar {name}", "Retirer {name}", "Remover {name}", "{name} entfernen", "Rimuovi {name}", "Hapus {name}"],

  // ── Recipe output ──
  copyFailed: ["Copy failed", "No se pudo copiar", "Échec de la copie", "Falha ao copiar", "Kopieren fehlgeschlagen", "Copia non riuscita", "Gagal menyalin"],
  editMissing: [
    "Add a recipe name, at least one ingredient, and at least one direction before saving.",
    "Añade un nombre, al menos un ingrediente y al menos un paso antes de guardar.",
    "Ajoutez un nom, au moins un ingrédient et au moins une étape avant d'enregistrer.",
    "Adicione um nome, pelo menos um ingrediente e pelo menos um passo antes de salvar.",
    "Füge vor dem Speichern einen Namen, mindestens eine Zutat und mindestens einen Schritt hinzu.",
    "Aggiungi un nome, almeno un ingrediente e almeno un passaggio prima di salvare.",
    "Tambahkan nama resep, minimal satu bahan, dan minimal satu langkah sebelum menyimpan.",
  ],
  editsSaved: ["Recipe edits saved", "Cambios guardados", "Modifications enregistrées", "Alterações salvas", "Änderungen gespeichert", "Modifiche salvate", "Perubahan resep disimpan"],
  pdfDownloaded: ["Recipe PDF downloaded", "PDF de la receta descargado", "PDF de la recette téléchargé", "PDF da receita baixado", "Rezept-PDF heruntergeladen", "PDF della ricetta scaricato", "PDF resep diunduh"],
  pdfFailed: ["Could not create the PDF", "No se pudo crear el PDF", "Impossible de créer le PDF", "Não foi possível criar o PDF", "PDF konnte nicht erstellt werden", "Impossibile creare il PDF", "Gagal membuat PDF"],
  cancel: ["Cancel", "Cancelar", "Annuler", "Cancelar", "Abbrechen", "Annulla", "Batal"],
  saveChanges: ["Save changes", "Guardar cambios", "Enregistrer", "Salvar alterações", "Änderungen speichern", "Salva modifiche", "Simpan perubahan"],
  editRecipe: ["Edit recipe", "Editar receta", "Modifier la recette", "Editar receita", "Rezept bearbeiten", "Modifica ricetta", "Edit resep"],
  recipeName: ["Recipe name", "Nombre de la receta", "Nom de la recette", "Nome da receita", "Rezeptname", "Nome della ricetta", "Nama resep"],
  recipeDescription: ["Recipe description", "Descripción de la receta", "Description de la recette", "Descrição da receita", "Rezeptbeschreibung", "Descrizione della ricetta", "Deskripsi resep"],
  time: ["Time", "Tiempo", "Durée", "Tempo", "Zeit", "Tempo", "Waktu"],
  difficulty: ["Difficulty", "Dificultad", "Difficulté", "Dificuldade", "Schwierigkeit", "Difficoltà", "Kesulitan"],
  caloriesPerServing: ["Calories / serving", "Calorías / porción", "Calories / portion", "Calorias / porção", "Kalorien / Portion", "Calorie / porzione", "Kalori / porsi"],
  servings: ["Servings", "Porciones", "Portions", "Porções", "Portionen", "Porzioni", "Porsi"],
  decreaseServings: ["Decrease servings", "Menos porciones", "Réduire les portions", "Diminuir porções", "Weniger Portionen", "Meno porzioni", "Kurangi porsi"],
  increaseServings: ["Increase servings", "Más porciones", "Augmenter les portions", "Aumentar porções", "Mehr Portionen", "Più porzioni", "Tambah porsi"],
  amountsTimes: ["amounts ×{factor}", "cantidades ×{factor}", "quantités ×{factor}", "quantidades ×{factor}", "Mengen ×{factor}", "quantità ×{factor}", "takaran ×{factor}"],
  ingredients: ["Ingredients", "Ingredientes", "Ingrédients", "Ingredientes", "Zutaten", "Ingredienti", "Bahan"],
  ingredientAmountN: ["Ingredient {n} amount", "Cantidad del ingrediente {n}", "Quantité de l'ingrédient {n}", "Quantidade do ingrediente {n}", "Menge der Zutat {n}", "Quantità dell'ingrediente {n}", "Takaran bahan {n}"],
  ingredientNameN: ["Ingredient {n} name", "Nombre del ingrediente {n}", "Nom de l'ingrédient {n}", "Nome do ingrediente {n}", "Name der Zutat {n}", "Nome dell'ingrediente {n}", "Nama bahan {n}"],
  amount: ["Amount", "Cantidad", "Quantité", "Quantidade", "Menge", "Quantità", "Takaran"],
  ingredient: ["Ingredient", "Ingrediente", "Ingrédient", "Ingrediente", "Zutat", "Ingrediente", "Bahan"],
  removeIngredientN: ["Remove ingredient {n}: {name}", "Quitar ingrediente {n}: {name}", "Retirer l'ingrédient {n} : {name}", "Remover ingrediente {n}: {name}", "Zutat {n} entfernen: {name}", "Rimuovi ingrediente {n}: {name}", "Hapus bahan {n}: {name}"],
  unnamedIngredient: ["unnamed ingredient", "ingrediente sin nombre", "ingrédient sans nom", "ingrediente sem nome", "unbenannte Zutat", "ingrediente senza nome", "bahan tanpa nama"],
  findSubstituteFor: ["Find a substitute for {name}", "Buscar un sustituto para {name}", "Trouver un substitut pour {name}", "Encontrar um substituto para {name}", "Ersatz für {name} finden", "Trova un sostituto per {name}", "Cari pengganti {name}"],
  swap: ["Swap", "Cambiar", "Remplacer", "Trocar", "Ersetzen", "Sostituisci", "Ganti"],
  addIngredient: ["Add ingredient", "Añadir ingrediente", "Ajouter un ingrédient", "Adicionar ingrediente", "Zutat hinzufügen", "Aggiungi ingrediente", "Tambah bahan"],
  proTip: ["Pro tip", "Consejo", "Astuce du chef", "Dica", "Profi-Tipp", "Consiglio", "Tips"],
  subTitle: ["Need a substitute ingredient?", "¿Necesitas un sustituto?", "Besoin d'un ingrédient de remplacement ?", "Precisa de um substituto?", "Brauchst du einen Ersatz?", "Ti serve un sostituto?", "Butuh bahan pengganti?"],
  subDesc: [
    "Tap Swap beside an ingredient, or tell us what you do not have.",
    "Toca Cambiar junto a un ingrediente o dinos qué te falta.",
    "Touchez Remplacer à côté d'un ingrédient ou dites-nous ce qui vous manque.",
    "Toque em Trocar ao lado de um ingrediente ou diga o que está faltando.",
    "Tippe neben einer Zutat auf Ersetzen oder sag uns, was dir fehlt.",
    "Tocca Sostituisci accanto a un ingrediente o dicci cosa ti manca.",
    "Ketuk Ganti di samping bahan, atau beri tahu kami bahan yang tidak kamu punya.",
  ],
  subLabel: ["What ingredient do you need to replace?", "¿Qué ingrediente necesitas reemplazar?", "Quel ingrédient devez-vous remplacer ?", "Qual ingrediente você precisa substituir?", "Welche Zutat möchtest du ersetzen?", "Quale ingrediente devi sostituire?", "Bahan apa yang perlu diganti?"],
  subPlaceholder: ["I don't have sherry. What can I use instead?", "No tengo jerez. ¿Qué puedo usar en su lugar?", "Je n'ai pas de xérès. Par quoi le remplacer ?", "Não tenho xerez. O que posso usar no lugar?", "Ich habe keinen Sherry. Was kann ich stattdessen nehmen?", "Non ho lo sherry. Cosa posso usare al suo posto?", "Saya tidak punya sherry. Apa penggantinya?"],
  subSubmit: ["Find a substitute", "Buscar sustituto", "Trouver un substitut", "Encontrar substituto", "Ersatz finden", "Trova un sostituto", "Cari pengganti"],
  instructions: ["Instructions", "Preparación", "Préparation", "Modo de preparo", "Zubereitung", "Preparazione", "Cara membuat"],
  cooking: ["Cooking", "Cocinando", "En cuisine", "Cozinhando", "Am Kochen", "In cucina", "Sedang memasak"],
  cookMode: ["Cook Mode", "Modo cocina", "Mode cuisine", "Modo cozinha", "Kochmodus", "Modalità cucina", "Mode masak"],
  cookingProgress: ["Cooking progress", "Progreso", "Progression", "Progresso", "Kochfortschritt", "Avanzamento", "Progres memasak"],
  stepsDone: ["{done}/{total} steps", "{done}/{total} pasos", "{done}/{total} étapes", "{done}/{total} passos", "{done}/{total} Schritte", "{done}/{total} passaggi", "{done}/{total} langkah"],
  bonAppetit: ["bon appétit!", "¡buen provecho!", "bon appétit !", "bom apetite!", "guten Appetit!", "buon appetito!", "selamat makan!"],
  directionN: ["Direction {n}", "Paso {n}", "Étape {n}", "Passo {n}", "Schritt {n}", "Passaggio {n}", "Langkah {n}"],
  removeDirectionN: ["Remove direction {n}", "Quitar paso {n}", "Retirer l'étape {n}", "Remover passo {n}", "Schritt {n} entfernen", "Rimuovi passaggio {n}", "Hapus langkah {n}"],
  addDirection: ["Add direction", "Añadir paso", "Ajouter une étape", "Adicionar passo", "Schritt hinzufügen", "Aggiungi passaggio", "Tambah langkah"],
  calories: ["Calories", "Calorías", "Calories", "Calorias", "Kalorien", "Calorie", "Kalori"],
  protein: ["Protein", "Proteína", "Protéines", "Proteína", "Eiweiß", "Proteine", "Protein"],
  carbs: ["Carbs", "Carbohidratos", "Glucides", "Carboidratos", "Kohlenhydrate", "Carboidrati", "Karbohidrat"],
  fat: ["Fat", "Grasa", "Lipides", "Gordura", "Fett", "Grassi", "Lemak"],
  makeItYours: ["Make it yours", "Hazla tuya", "Personnalisez-la", "Do seu jeito", "Mach es zu deinem", "Rendila tua", "Sesuaikan"],
  makeItYoursDesc: [
    "Choose a quick adjustment or ask for a completely different dish.",
    "Elige un ajuste rápido o pide un plato totalmente distinto.",
    "Choisissez un ajustement rapide ou demandez un plat complètement différent.",
    "Escolha um ajuste rápido ou peça um prato totalmente diferente.",
    "Wähle eine schnelle Anpassung oder fordere ein ganz anderes Gericht an.",
    "Scegli una modifica rapida o chiedi un piatto completamente diverso.",
    "Pilih penyesuaian cepat atau minta hidangan yang sama sekali berbeda.",
  ],
  tryDifferent: ["Try a different recipe", "Probar otra receta", "Essayer une autre recette", "Tentar outra receita", "Anderes Rezept ausprobieren", "Prova un'altra ricetta", "Coba resep lain"],
  saved: ["Saved", "Guardada", "Enregistrée", "Salva", "Gespeichert", "Salvata", "Tersimpan"],
  saveRecipe: ["Save Recipe", "Guardar receta", "Enregistrer", "Salvar receita", "Rezept speichern", "Salva ricetta", "Simpan resep"],
  copy: ["Copy", "Copiar", "Copier", "Copiar", "Kopieren", "Copia", "Salin"],
  recipeCopied: ["Recipe copied", "Receta copiada", "Recette copiée", "Receita copiada", "Rezept kopiert", "Ricetta copiata", "Resep disalin"],
  groceryList: ["Grocery List", "Lista de compras", "Liste de courses", "Lista de compras", "Einkaufsliste", "Lista della spesa", "Daftar belanja"],
  groceryCopied: ["Grocery list copied", "Lista de compras copiada", "Liste de courses copiée", "Lista de compras copiada", "Einkaufsliste kopiert", "Lista della spesa copiata", "Daftar belanja disalin"],
  servesN: ["serves {n}", "para {n}", "pour {n}", "serve {n}", "für {n}", "per {n}", "untuk {n} porsi"],
  stepsHeading: ["Steps", "Pasos", "Étapes", "Passos", "Schritte", "Passaggi", "Langkah"],
  preparingPdf: ["Preparing PDF...", "Preparando PDF...", "Préparation du PDF...", "Preparando PDF...", "PDF wird erstellt ...", "Preparazione PDF...", "Menyiapkan PDF..."],
  downloadPdf: ["Download PDF", "Descargar PDF", "Télécharger le PDF", "Baixar PDF", "PDF herunterladen", "Scarica PDF", "Unduh PDF"],
  addToPlanner: ["Add to Planner", "Añadir al plan", "Ajouter au menu", "Adicionar ao cardápio", "Zum Planer hinzufügen", "Aggiungi al menù", "Tambah ke rencana"],
  chooseSlot: ["Choose meal plan slot", "Elige día y comida", "Choisir le jour et le repas", "Escolha o dia e a refeição", "Tag und Mahlzeit wählen", "Scegli giorno e pasto", "Pilih hari dan waktu makan"],
  day: ["Day", "Día", "Jour", "Dia", "Tag", "Giorno", "Hari"],
  meal: ["Meal", "Comida", "Repas", "Refeição", "Mahlzeit", "Pasto", "Waktu makan"],
  breakfast: ["Breakfast", "Desayuno", "Petit-déjeuner", "Café da manhã", "Frühstück", "Colazione", "Sarapan"],
  lunch: ["Lunch", "Almuerzo", "Déjeuner", "Almoço", "Mittagessen", "Pranzo", "Makan siang"],
  dinner: ["Dinner", "Cena", "Dîner", "Jantar", "Abendessen", "Cena", "Makan malam"],
  addToPlan: ["Add to Plan", "Añadir", "Ajouter", "Adicionar", "Hinzufügen", "Aggiungi", "Tambahkan"],

  // ── Generator ──
  generationFailed: ["Generation failed: {msg}", "No se pudo generar: {msg}", "Échec de la génération : {msg}", "Falha ao gerar: {msg}", "Erstellung fehlgeschlagen: {msg}", "Generazione non riuscita: {msg}", "Gagal membuat resep: {msg}"],
  improvementFailed: ["Improvement failed: {msg}", "No se pudo mejorar: {msg}", "Échec de l'amélioration : {msg}", "Falha ao ajustar: {msg}", "Anpassung fehlgeschlagen: {msg}", "Modifica non riuscita: {msg}", "Gagal menyesuaikan: {msg}"],
  unknownError: ["Unknown error", "Error desconocido", "Erreur inconnue", "Erro desconhecido", "Unbekannter Fehler", "Errore sconosciuto", "Kesalahan tidak diketahui"],
  heroEyebrow: ["AI-Powered Recipe Creation", "Recetas creadas con IA", "Recettes créées par l'IA", "Receitas criadas com IA", "Rezepte mit KI erstellen", "Ricette create con l'IA", "Resep buatan AI"],
  heroTitle: ["Turn what|you have into|something", "Convierte lo|que tienes en|algo", "Transformez ce|que vous avez|en quelque chose", "Transforme o|que você tem em|algo", "Mach aus dem,|was du hast,|etwas", "Trasforma ciò|che hai in|qualcosa di", "Ubah bahan|yang kamu punya|menjadi sesuatu"],
  heroTitleEm: ["extraordinary.", "extraordinario.", "d'extraordinaire.", "extraordinário.", "Besonderes.", "straordinario.", "luar biasa."],
  heroSubtitle: [
    "Tell us what you have. Our AI generates complete, restaurant-quality recipes tailored to your taste, diet, and time.",
    "Dinos qué tienes. Nuestra IA crea recetas completas, de calidad de restaurante, adaptadas a tu gusto, tu dieta y tu tiempo.",
    "Dites-nous ce que vous avez. Notre IA crée des recettes complètes, dignes d'un restaurant, adaptées à vos goûts, à votre régime et à votre emploi du temps.",
    "Diga o que você tem. Nossa IA cria receitas completas, com qualidade de restaurante, sob medida para seu gosto, sua dieta e seu tempo.",
    "Sag uns, was du da hast. Unsere KI erstellt vollständige Rezepte in Restaurantqualität, abgestimmt auf deinen Geschmack, deine Ernährung und deine Zeit.",
    "Dicci cosa hai. La nostra IA crea ricette complete, da ristorante, su misura per i tuoi gusti, la tua dieta e il tuo tempo.",
    "Beri tahu kami bahan yang kamu punya. AI kami membuat resep lengkap berkualitas restoran yang sesuai dengan selera, pola makan, dan waktumu.",
  ],
  heroVisualAlt: ["Herb roasted chicken with tomatoes, garlic, and lemon", "Pollo asado a las hierbas con tomates, ajo y limón", "Poulet rôti aux herbes avec tomates, ail et citron", "Frango assado com ervas, tomates, alho e limão", "Kräuterbrathähnchen mit Tomaten, Knoblauch und Zitrone", "Pollo arrosto alle erbe con pomodori, aglio e limone", "Ayam panggang rempah dengan tomat, bawang putih, dan lemon"],
  recipeGenerator: ["Recipe generator", "Generador de recetas", "Générateur de recettes", "Gerador de receitas", "Rezeptgenerator", "Generatore di ricette", "Pembuat resep"],
  addAnIngredient: ["Add an ingredient", "Añade un ingrediente", "Ajoutez un ingrédient", "Adicione um ingrediente", "Zutat hinzufügen", "Aggiungi un ingrediente", "Tambahkan bahan"],
  creatingRecipe: ["Creating your recipe...", "Creando tu receta...", "Création de votre recette...", "Criando sua receita...", "Rezept wird erstellt ...", "Creazione della ricetta...", "Membuat resepmu..."],
  improvingRecipe: ["Improving recipe...", "Mejorando la receta...", "Amélioration de la recette...", "Ajustando a receita...", "Rezept wird angepasst ...", "Modifica della ricetta...", "Menyesuaikan resep..."],
  generateRecipe: ["Generate recipe", "Generar receta", "Générer la recette", "Gerar receita", "Rezept erstellen", "Genera ricetta", "Buat resep"],
  surpriseTitle: ["Choose a random cuisine while keeping your dietary needs", "Elige una cocina al azar respetando tu dieta", "Choisit une cuisine au hasard en respectant votre régime", "Escolhe uma cozinha aleatória respeitando sua dieta", "Wählt eine zufällige Küche und berücksichtigt deine Ernährung", "Sceglie una cucina a caso rispettando la tua dieta", "Pilih masakan acak dengan tetap mengikuti pola makanmu"],
  surpriseMe: ["Surprise me", "Sorpréndeme", "Surprenez-moi", "Me surpreenda", "Überrasch mich", "Sorprendimi", "Kejutkan aku"],
  cuisine: ["Cuisine", "Cocina", "Cuisine", "Cozinha", "Küche", "Cucina", "Masakan"],
  cuisinePref: ["Cuisine preference", "Preferencia de cocina", "Préférence de cuisine", "Preferência de cozinha", "Bevorzugte Küche", "Preferenza di cucina", "Preferensi masakan"],
  timePref: ["Cooking time preference", "Tiempo de cocción", "Temps de préparation", "Tempo de preparo", "Gewünschte Kochzeit", "Tempo di preparazione", "Preferensi waktu memasak"],
  diet: ["Diet", "Dieta", "Régime", "Dieta", "Ernährung", "Dieta", "Pola makan"],
  nSelected: ["{n} selected", "{n} seleccionadas", "{n} sélectionné(s)", "{n} selecionadas", "{n} ausgewählt", "{n} selezionate", "{n} dipilih"],
  any: ["Any", "Cualquiera", "Tous", "Qualquer", "Alle", "Qualsiasi", "Semua"],
  fineTune: ["Fine-tune your recipe", "Ajusta tu receta", "Affinez votre recette", "Ajuste sua receita", "Rezept verfeinern", "Perfeziona la tua ricetta", "Sesuaikan resepmu"],
  texturePref: ["Texture and consistency preference", "Textura y consistencia", "Texture et consistance", "Textura e consistência", "Textur und Konsistenz", "Consistenza e texture", "Preferensi tekstur"],
  skillPref: ["Skill level preference", "Nivel de habilidad", "Niveau de compétence", "Nível de habilidade", "Kochniveau", "Livello di esperienza", "Tingkat keahlian"],
  caloriePref: ["Calorie preference", "Preferencia de calorías", "Préférence de calories", "Preferência de calorias", "Kalorienvorgabe", "Preferenza calorica", "Preferensi kalori"],
  textureNote: [
    "{texture} mode keeps the meal varied, complete, and appropriate for the requested texture.",
    "El modo «{texture}» mantiene la comida variada, completa y adecuada a la textura solicitada.",
    "Le mode « {texture} » garde un repas varié, complet et adapté à la texture demandée.",
    "O modo “{texture}” mantém a refeição variada, completa e adequada à textura pedida.",
    "Der Modus „{texture}“ hält die Mahlzeit abwechslungsreich, vollständig und passend zur gewünschten Konsistenz.",
    "La modalità «{texture}» mantiene il pasto vario, completo e adatto alla consistenza richiesta.",
    "Mode “{texture}” menjaga hidangan tetap bervariasi, lengkap, dan sesuai tekstur yang diminta.",
  ],
  anythingElse: ["Anything else?", "¿Algo más?", "Autre chose ?", "Algo mais?", "Sonst noch etwas?", "Altro?", "Ada lagi?"],
  customDietLabel: ["Custom dietary restrictions and notes", "Restricciones y notas personalizadas", "Restrictions et notes personnalisées", "Restrições e observações personalizadas", "Eigene Einschränkungen und Hinweise", "Restrizioni e note personalizzate", "Batasan dan catatan khusus"],
  customDietPlaceholder: [
    "Add allergies, texture needs, equipment limits, or other cooking notes.",
    "Añade alergias, necesidades de textura, limitaciones de equipo u otras notas.",
    "Ajoutez allergies, besoins de texture, limites d'équipement ou autres notes.",
    "Adicione alergias, necessidades de textura, limitações de equipamento ou outras observações.",
    "Allergien, Konsistenzwünsche, Geräte-Einschränkungen oder andere Hinweise.",
    "Aggiungi allergie, esigenze di consistenza, limiti di attrezzatura o altre note.",
    "Tambahkan alergi, kebutuhan tekstur, keterbatasan alat, atau catatan lain.",
  ],
  dietDisclaimer: [
    "Health and allergy filters guide recipe generation but do not replace medical advice. Verify packaged ingredients and cross-contamination risks.",
    "Los filtros de salud y alergias orientan la receta, pero no sustituyen el consejo médico. Revisa los ingredientes envasados y el riesgo de contaminación cruzada.",
    "Les filtres santé et allergies orientent la recette mais ne remplacent pas un avis médical. Vérifiez les ingrédients emballés et les risques de contamination croisée.",
    "Os filtros de saúde e alergia orientam a receita, mas não substituem orientação médica. Verifique ingredientes embalados e riscos de contaminação cruzada.",
    "Gesundheits- und Allergiefilter helfen bei der Rezepterstellung, ersetzen aber keinen ärztlichen Rat. Prüfe verpackte Zutaten und das Risiko von Kreuzkontamination.",
    "I filtri per salute e allergie guidano la ricetta ma non sostituiscono il parere medico. Controlla gli ingredienti confezionati e i rischi di contaminazione crociata.",
    "Filter kesehatan dan alergi membantu pembuatan resep, tetapi tidak menggantikan saran medis. Periksa bahan kemasan dan risiko kontaminasi silang.",
  ],
  promise: [
    "From your ingredients to a complete recipe—instantly. No more meal-planning guesswork.",
    "De tus ingredientes a una receta completa, al instante. Se acabaron las dudas sobre qué cocinar.",
    "De vos ingrédients à une recette complète, en un instant. Fini les casse-tête pour planifier vos repas.",
    "Dos seus ingredientes a uma receita completa, na hora. Chega de adivinhar o que cozinhar.",
    "Von deinen Zutaten zum fertigen Rezept – sofort. Schluss mit dem Rätselraten bei der Essensplanung.",
    "Dai tuoi ingredienti a una ricetta completa, all'istante. Basta indovinare cosa cucinare.",
    "Dari bahanmu menjadi resep lengkap, seketika. Tak perlu lagi bingung merencanakan menu.",
  ],
  craftingRecipe: ["Crafting your recipe...", "Preparando tu receta...", "Préparation de votre recette...", "Preparando sua receita...", "Dein Rezept entsteht ...", "Stiamo preparando la tua ricetta...", "Meracik resepmu..."],
  craftingSub: [
    "Our AI is combining flavors, calculating nutrition, and perfecting instructions.",
    "Nuestra IA está combinando sabores, calculando la nutrición y puliendo los pasos.",
    "Notre IA associe les saveurs, calcule les valeurs nutritionnelles et peaufine les étapes.",
    "Nossa IA está combinando sabores, calculando a nutrição e refinando o passo a passo.",
    "Unsere KI kombiniert Aromen, berechnet Nährwerte und feilt an der Anleitung.",
    "La nostra IA sta combinando i sapori, calcolando i valori nutrizionali e perfezionando i passaggi.",
    "AI kami sedang memadukan rasa, menghitung gizi, dan menyempurnakan langkah-langkah.",
  ],

  // ── Discover ──
  generateFailedMsg: ["Failed to generate recipe: {msg}", "No se pudo generar la receta: {msg}", "Impossible de générer la recette : {msg}", "Falha ao gerar a receita: {msg}", "Rezept konnte nicht erstellt werden: {msg}", "Impossibile generare la ricetta: {msg}", "Gagal membuat resep: {msg}"],
  collection: ["Recipe Collection", "Colección de recetas", "Collection de recettes", "Coleção de receitas", "Rezeptsammlung", "Raccolta di ricette", "Koleksi resep"],
  discoverTitle: ["Discover|exceptional|dishes", "Descubre platos|excepcionales|", "Découvrez des plats|d'exception|", "Descubra pratos|excepcionais|", "Entdecke|außergewöhnliche|Gerichte", "Scopri piatti|eccezionali|", "Temukan hidangan|istimewa|"],
  discoverSub: [
    "Open any dish to get the full AI-generated recipe with ingredients, steps, and nutrition.",
    "Abre cualquier plato para ver la receta completa generada por IA, con ingredientes, pasos y nutrición.",
    "Ouvrez un plat pour obtenir la recette complète générée par l'IA : ingrédients, étapes et valeurs nutritionnelles.",
    "Abra qualquer prato para ver a receita completa gerada por IA, com ingredientes, passos e nutrição.",
    "Öffne ein Gericht für das vollständige KI-Rezept mit Zutaten, Schritten und Nährwerten.",
    "Apri un piatto per ottenere la ricetta completa generata dall'IA, con ingredienti, passaggi e valori nutrizionali.",
    "Buka hidangan apa pun untuk mendapatkan resep lengkap buatan AI dengan bahan, langkah, dan informasi gizi.",
  ],
  skill: ["Skill", "Nivel", "Niveau", "Nível", "Niveau", "Livello", "Tingkat"],
  all: ["All", "Todas", "Toutes", "Todas", "Alle", "Tutte", "Semua"],
  le30: ["≤ 30 min", "≤ 30 min", "≤ 30 min", "≤ 30 min", "≤ 30 Min.", "≤ 30 min", "≤ 30 menit"],
  le1h: ["≤ 1 hr", "≤ 1 h", "≤ 1 h", "≤ 1 h", "≤ 1 Std.", "≤ 1 h", "≤ 1 jam"],
  slowWorthIt: ["Slow & worth it", "Lento pero vale la pena", "Long mais ça vaut le coup", "Demorado, mas vale a pena", "Dauert, lohnt sich", "Lento ma ne vale la pena", "Lama tapi sepadan"],
  clearShown: ["Clear ({n} shown)", "Borrar ({n} visibles)", "Effacer ({n} affichés)", "Limpar ({n} exibidos)", "Zurücksetzen ({n} angezeigt)", "Azzera ({n} mostrate)", "Hapus filter ({n} ditampilkan)"],
  noMatch: ["No recipes match those filters", "Ninguna receta coincide con esos filtros", "Aucune recette ne correspond à ces filtres", "Nenhuma receita corresponde a esses filtros", "Keine Rezepte passen zu diesen Filtern", "Nessuna ricetta corrisponde ai filtri", "Tidak ada resep yang cocok dengan filter tersebut"],
  noMatchSub: [
    "Try clearing a filter, or use Generate to create exactly what you need.",
    "Prueba a quitar un filtro o usa Generar para crear justo lo que necesitas.",
    "Essayez de retirer un filtre ou utilisez Générer pour créer exactement ce qu'il vous faut.",
    "Tente remover um filtro ou use Gerar para criar exatamente o que precisa.",
    "Entferne einen Filter oder nutze Erstellen, um genau das zu bekommen, was du brauchst.",
    "Prova a togliere un filtro o usa Genera per creare esattamente ciò che ti serve.",
    "Coba hapus filter, atau gunakan Buat untuk membuat resep sesuai kebutuhanmu.",
  ],
  viewFull: ["View full recipe →", "Ver receta completa →", "Voir la recette →", "Ver receita completa →", "Ganzes Rezept ansehen →", "Vedi la ricetta completa →", "Lihat resep lengkap →"],
  closeRecipeDialog: ["Close recipe dialog", "Cerrar receta", "Fermer la recette", "Fechar receita", "Rezept schließen", "Chiudi ricetta", "Tutup resep"],
  craftingNamed: ["Crafting {name}…", "Preparando {name}…", "Préparation : {name}…", "Preparando {name}…", "{name} wird zubereitet …", "Preparazione: {name}…", "Meracik {name}…"],
  craftingNamedSub: [
    "Generating full recipe with ingredients, steps, and nutrition.",
    "Generando la receta completa con ingredientes, pasos y nutrición.",
    "Génération de la recette complète : ingrédients, étapes et valeurs nutritionnelles.",
    "Gerando a receita completa com ingredientes, passos e nutrição.",
    "Vollständiges Rezept mit Zutaten, Schritten und Nährwerten wird erstellt.",
    "Generazione della ricetta completa con ingredienti, passaggi e valori nutrizionali.",
    "Membuat resep lengkap dengan bahan, langkah, dan informasi gizi.",
  ],
  tryAgain: ["Try Again", "Reintentar", "Réessayer", "Tentar novamente", "Erneut versuchen", "Riprova", "Coba lagi"],

  // ── Pantry ──
  smartPantry: ["Smart Pantry", "Despensa inteligente", "Placard malin", "Despensa inteligente", "Smarter Vorrat", "Dispensa smart", "Dapur pintar"],
  pantryTitle: ["Your|pantry|", "Tu|despensa|", "Votre|placard|", "Sua|despensa|", "Dein|Vorrat|", "La tua|dispensa|", "Isi|dapurmu|"],
  addToPantryLabel: ["Add ingredient to pantry", "Añadir ingrediente a la despensa", "Ajouter un ingrédient au placard", "Adicionar ingrediente à despensa", "Zutat zum Vorrat hinzufügen", "Aggiungi ingrediente alla dispensa", "Tambah bahan ke dapur"],
  addToPantryPlaceholder: ["Add ingredient to pantry…", "Añadir ingrediente a la despensa…", "Ajouter un ingrédient au placard…", "Adicionar ingrediente à despensa…", "Zutat zum Vorrat hinzufügen …", "Aggiungi ingrediente alla dispensa…", "Tambah bahan ke dapur…"],
  add: ["Add", "Añadir", "Ajouter", "Adicionar", "Hinzufügen", "Aggiungi", "Tambah"],
  currentStock: ["Current Stock", "Existencias", "Stock actuel", "Estoque atual", "Aktueller Bestand", "Scorte attuali", "Stok saat ini"],
  pantryEmpty: ["Your pantry is empty. Add an ingredient above to get started.", "Tu despensa está vacía. Añade un ingrediente arriba para empezar.", "Votre placard est vide. Ajoutez un ingrédient ci-dessus pour commencer.", "Sua despensa está vazia. Adicione um ingrediente acima para começar.", "Dein Vorrat ist leer. Füge oben eine Zutat hinzu, um loszulegen.", "La tua dispensa è vuota. Aggiungi un ingrediente qui sopra per iniziare.", "Dapurmu kosong. Tambahkan bahan di atas untuk memulai."],
  ingredientNameAria: ["Ingredient name", "Nombre del ingrediente", "Nom de l'ingrédient", "Nome do ingrediente", "Name der Zutat", "Nome dell'ingrediente", "Nama bahan"],
  ingredientQtyAria: ["Ingredient quantity", "Cantidad", "Quantité", "Quantidade", "Menge", "Quantità", "Jumlah"],
  qty: ["qty", "cant.", "qté", "qtd.", "Menge", "q.tà", "jml"],
  stockStatus: ["Stock status: {status}. Change status.", "Estado: {status}. Cambiar estado.", "Statut du stock : {status}. Modifier.", "Status do estoque: {status}. Alterar status.", "Bestand: {status}. Status ändern.", "Stato scorte: {status}. Cambia stato.", "Status stok: {status}. Ubah status."],
  inStock: ["In Stock", "Disponible", "En stock", "Em estoque", "Vorrätig", "Disponibile", "Tersedia"],
  low: ["Low", "Poco", "Faible", "Pouco", "Knapp", "Scarso", "Menipis"],
  inStockLower: ["in stock", "disponible", "en stock", "em estoque", "vorrätig", "disponibile", "tersedia"],
  lowStock: ["low stock", "queda poco", "stock faible", "estoque baixo", "knapp", "in esaurimento", "stok menipis"],
  save: ["Save", "Guardar", "Enregistrer", "Salvar", "Speichern", "Salva", "Simpan"],
  editNamed: ["Edit {name}", "Editar {name}", "Modifier {name}", "Editar {name}", "{name} bearbeiten", "Modifica {name}", "Edit {name}"],
  generateFromPantry: ["Generate Recipe from Pantry", "Generar receta con la despensa", "Générer une recette avec le placard", "Gerar receita com a despensa", "Rezept aus dem Vorrat erstellen", "Genera ricetta dalla dispensa", "Buat resep dari stok dapur"],
  shoppingSuggestions: ["Shopping Suggestions", "Sugerencias de compra", "Suggestions de courses", "Sugestões de compras", "Einkaufsvorschläge", "Suggerimenti per la spesa", "Saran belanja"],
  nothingLow: ["Nothing is running low. Your pantry is fully stocked.", "No falta nada. Tu despensa está completa.", "Rien ne manque. Votre placard est bien rempli.", "Nada está acabando. Sua despensa está completa.", "Nichts wird knapp. Dein Vorrat ist voll.", "Non manca nulla. La tua dispensa è piena.", "Tidak ada yang menipis. Stok dapurmu lengkap."],
  runningLow: ["Running low ({qty} left)", "Queda poco ({qty})", "Bientôt épuisé ({qty} restant)", "Acabando ({qty} restante)", "Wird knapp (noch {qty})", "In esaurimento ({qty} rimasti)", "Hampir habis (sisa {qty})"],
  recipeSuggestions: ["Recipe Suggestions", "Sugerencias de recetas", "Idées de recettes", "Sugestões de receitas", "Rezeptvorschläge", "Ricette suggerite", "Saran resep"],
  pantryFriendly: ["pantry-friendly", "con tu despensa", "avec vos placards", "com a despensa", "aus dem Vorrat", "con la dispensa", "dari stok dapur"],
  oneUnit: ["1 unit", "1 unidad", "1 unité", "1 unidade", "1 Stück", "1 unità", "1 buah"],

  // ── Planner ──
  aiMealPlanner: ["AI Meal Planner", "Planificador de comidas con IA", "Planificateur de repas IA", "Planejador de refeições com IA", "KI-Essensplaner", "Pianificatore pasti IA", "Perencana menu AI"],
  plannerTitle: ["Weekly|meal plan|", "Plan de comidas|semanal|", "Menu de la|semaine|", "Cardápio da|semana|", "Dein|Wochenplan|", "Menù|settimanale|", "Rencana menu|mingguan|"],
  target: ["Target", "Objetivo", "Objectif", "Meta", "Ziel", "Obiettivo", "Target"],
  kcalPerDay: ["{n} kcal/day", "{n} kcal/día", "{n} kcal/jour", "{n} kcal/dia", "{n} kcal/Tag", "{n} kcal/giorno", "{n} kkal/hari"],
  regeneratePlan: ["Regenerate Plan", "Regenerar plan", "Régénérer le menu", "Gerar novo cardápio", "Plan neu erstellen", "Rigenera menù", "Buat ulang rencana"],
  planRegenerated: ["Meal plan regenerated", "Plan regenerado", "Menu régénéré", "Cardápio atualizado", "Essensplan neu erstellt", "Menù rigenerato", "Rencana menu dibuat ulang"],
  addedToPlan: ["Added to {day} {meal}", "Añadida: {day}, {meal}", "Ajoutée : {day}, {meal}", "Adicionada: {day}, {meal}", "Hinzugefügt: {day}, {meal}", "Aggiunta: {day}, {meal}", "Ditambahkan: {day}, {meal}"],

  // ── Saved ──
  yourCollection: ["Your Collection", "Tu colección", "Votre collection", "Sua coleção", "Deine Sammlung", "La tua raccolta", "Koleksimu"],
  savedTitle: ["Saved|recipes|", "Recetas|guardadas|", "Recettes|enregistrées|", "Receitas|salvas|", "Gespeicherte|Rezepte|", "Ricette|salvate|", "Resep|tersimpan|"],
  noSaved: ["No saved recipes yet", "Aún no hay recetas guardadas", "Aucune recette enregistrée", "Nenhuma receita salva ainda", "Noch keine gespeicherten Rezepte", "Nessuna ricetta salvata", "Belum ada resep tersimpan"],
  noSavedSub: ["Generate or discover recipes, then save your favorites here.", "Genera o descubre recetas y guarda aquí tus favoritas.", "Générez ou découvrez des recettes, puis enregistrez vos favorites ici.", "Gere ou descubra receitas e salve suas favoritas aqui.", "Erstelle oder entdecke Rezepte und speichere hier deine Favoriten.", "Genera o scopri ricette e salva qui le tue preferite.", "Buat atau jelajahi resep, lalu simpan favoritmu di sini."],
  custom: ["Custom", "Personalizada", "Personnalisée", "Personalizada", "Eigenes", "Personalizzata", "Kustom"],
  notSet: ["Not set", "Sin definir", "Non défini", "Não definido", "Nicht festgelegt", "Non impostato", "Belum diatur"],
  remove: ["Remove", "Quitar", "Retirer", "Remover", "Entfernen", "Rimuovi", "Hapus"],
  recipeRemoved: ["Recipe removed", "Receta eliminada", "Recette retirée", "Receita removida", "Rezept entfernt", "Ricetta rimossa", "Resep dihapus"],
  recipeSaved: ["Recipe saved!", "¡Receta guardada!", "Recette enregistrée !", "Receita salva!", "Rezept gespeichert!", "Ricetta salvata!", "Resep disimpan!"],

  // ── Units ──
  calUnit: ["cal", "cal", "cal", "cal", "kcal", "cal", "kal"],
  hourUnit: ["hr", "h", "h", "h", "Std.", "h", "jam"],

  // ── Errors returned by the server or the recipe parser ──
  errRateLimit: ["Too many recipes were requested recently. Please try again later.", "Se pidieron demasiadas recetas recientemente. Inténtalo más tarde.", "Trop de recettes ont été demandées récemment. Réessayez plus tard.", "Muitas receitas foram solicitadas recentemente. Tente mais tarde.", "Zu viele Rezepte in kurzer Zeit angefragt. Bitte versuch es später erneut.", "Troppe ricette richieste di recente. Riprova più tardi.", "Terlalu banyak resep diminta baru-baru ini. Coba lagi nanti."],
  errTimeout: ["The AI took too long to respond.", "La IA tardó demasiado en responder.", "L'IA a mis trop de temps à répondre.", "A IA demorou demais para responder.", "Die KI hat zu lange gebraucht.", "L'IA ha impiegato troppo a rispondere.", "AI terlalu lama merespons."],
  errAiFailed: ["The AI could not create a recipe right now.", "La IA no pudo crear una receta en este momento.", "L'IA n'a pas pu créer de recette pour le moment.", "A IA não conseguiu criar uma receita agora.", "Die KI konnte gerade kein Rezept erstellen.", "L'IA non è riuscita a creare una ricetta in questo momento.", "AI tidak dapat membuat resep saat ini."],
  errInvalid: ["The AI response was incomplete or invalid. Please try again.", "La respuesta de la IA fue incompleta o no válida. Inténtalo de nuevo.", "La réponse de l'IA était incomplète ou invalide. Veuillez réessayer.", "A resposta da IA veio incompleta ou inválida. Tente novamente.", "Die Antwort der KI war unvollständig oder ungültig. Bitte versuch es erneut.", "La risposta dell'IA era incompleta o non valida. Riprova.", "Respons AI tidak lengkap atau tidak valid. Silakan coba lagi."],
  errNotConfigured: ["The recipe service is not configured yet.", "El servicio de recetas aún no está configurado.", "Le service de recettes n'est pas encore configuré.", "O serviço de receitas ainda não está configurado.", "Der Rezeptdienst ist noch nicht eingerichtet.", "Il servizio ricette non è ancora configurato.", "Layanan resep belum dikonfigurasi."],
  errOnlyCooking: ["Culinaria can only help with recipes and cooking.", "Culinaria solo puede ayudar con recetas y cocina.", "Culinaria ne peut aider qu'avec les recettes et la cuisine.", "O Culinaria só pode ajudar com receitas e culinária.", "Culinaria hilft nur bei Rezepten und beim Kochen.", "Culinaria può aiutare solo con ricette e cucina.", "Culinaria hanya dapat membantu soal resep dan memasak."],
  errMissingParts: ["The AI recipe was missing a name, ingredients, or steps.", "A la receta de la IA le faltaba el nombre, los ingredientes o los pasos.", "Il manquait le nom, les ingrédients ou les étapes à la recette de l'IA.", "A receita da IA veio sem nome, ingredientes ou passos.", "Dem KI-Rezept fehlten Name, Zutaten oder Schritte.", "Alla ricetta dell'IA mancavano nome, ingredienti o passaggi.", "Resep AI tidak memiliki nama, bahan, atau langkah."],
  errNotAllowed: ["This request was not allowed.", "No se permitió esta solicitud.", "Cette requête n'a pas été autorisée.", "Esta solicitação não foi permitida.", "Diese Anfrage wurde nicht erlaubt.", "Questa richiesta non è consentita.", "Permintaan ini tidak diizinkan."],

  // ── PDF ──
  nutritionPerServing: ["Nutrition per serving", "Nutrición por porción", "Valeurs nutritionnelles par portion", "Nutrição por porção", "Nährwerte pro Portion", "Valori nutrizionali per porzione", "Gizi per porsi"],
  cooksNote: ["Cook's note", "Nota del chef", "Le mot du chef", "Nota do chef", "Hinweis vom Koch", "Nota dello chef", "Catatan koki"],
  perServingN: ["{n} / serving", "{n} / porción", "{n} / portion", "{n} / porção", "{n} / Portion", "{n} / porzione", "{n} / porsi"],
  pdfFooter: ["MADE FOR YOUR TABLE", "HECHO PARA TU MESA", "CONÇU POUR VOTRE TABLE", "FEITO PARA A SUA MESA", "FÜR DEINEN TISCH GEMACHT", "FATTO PER LA TUA TAVOLA", "DIBUAT UNTUK MEJAMU"],
} as const satisfies Record<string, Row>;

export type UIKey = keyof typeof UI;
export type TranslateVars = Record<string, string | number>;

// Option values, dish names and other content the app keeps in English internally.
const TERMS: Record<string, TermRow> = {
  // Cuisine regions
  "Europe": ["Europa", "Europe", "Europa", "Europa", "Europa", "Eropa"],
  "Africa": ["África", "Afrique", "África", "Afrika", "Africa", "Afrika"],
  "Middle East": ["Oriente Medio", "Moyen-Orient", "Oriente Médio", "Naher Osten", "Medio Oriente", "Timur Tengah"],
  "South & Central Asia": ["Asia meridional y central", "Asie du Sud et centrale", "Ásia Meridional e Central", "Süd- & Zentralasien", "Asia meridionale e centrale", "Asia Selatan & Tengah"],
  "East & Southeast Asia": ["Asia oriental y sudeste asiático", "Asie de l'Est et du Sud-Est", "Ásia Oriental e Sudeste Asiático", "Ost- & Südostasien", "Asia orientale e sud-orientale", "Asia Timur & Tenggara"],
  "Americas": ["Américas", "Amériques", "Américas", "Amerika", "Americhe", "Amerika"],
  "Broad": ["Generales", "Générales", "Gerais", "Übergreifend", "Generali", "Umum"],

  // Cuisines
  "Any Cuisine": ["Cualquier cocina", "Toutes cuisines", "Qualquer cozinha", "Jede Küche", "Qualsiasi cucina", "Semua masakan"],
  "Italian": ["Italiana", "Italienne", "Italiana", "Italienisch", "Italiana", "Italia"],
  "French": ["Francesa", "Française", "Francesa", "Französisch", "Francese", "Prancis"],
  "Spanish": ["Española", "Espagnole", "Espanhola", "Spanisch", "Spagnola", "Spanyol"],
  "Greek": ["Griega", "Grecque", "Grega", "Griechisch", "Greca", "Yunani"],
  "Portuguese": ["Portuguesa", "Portugaise", "Portuguesa", "Portugiesisch", "Portoghese", "Portugis"],
  "German": ["Alemana", "Allemande", "Alemã", "Deutsch", "Tedesca", "Jerman"],
  "Polish": ["Polaca", "Polonaise", "Polonesa", "Polnisch", "Polacca", "Polandia"],
  "British": ["Británica", "Britannique", "Britânica", "Britisch", "Britannica", "Inggris"],
  "Ethiopian": ["Etíope", "Éthiopienne", "Etíope", "Äthiopisch", "Etiope", "Etiopia"],
  "Nigerian": ["Nigeriana", "Nigériane", "Nigeriana", "Nigerianisch", "Nigeriana", "Nigeria"],
  "West African": ["De África occidental", "Ouest-africaine", "Da África Ocidental", "Westafrikanisch", "Dell'Africa occidentale", "Afrika Barat"],
  "Moroccan": ["Marroquí", "Marocaine", "Marroquina", "Marokkanisch", "Marocchina", "Maroko"],
  "Egyptian": ["Egipcia", "Égyptienne", "Egípcia", "Ägyptisch", "Egiziana", "Mesir"],
  "South African": ["Sudafricana", "Sud-africaine", "Sul-africana", "Südafrikanisch", "Sudafricana", "Afrika Selatan"],
  "Lebanese": ["Libanesa", "Libanaise", "Libanesa", "Libanesisch", "Libanese", "Lebanon"],
  "Turkish": ["Turca", "Turque", "Turca", "Türkisch", "Turca", "Turki"],
  "Persian": ["Persa", "Persane", "Persa", "Persisch", "Persiana", "Persia"],
  "Israeli": ["Israelí", "Israélienne", "Israelense", "Israelisch", "Israeliana", "Israel"],
  "Middle Eastern": ["De Oriente Medio", "Moyen-orientale", "Do Oriente Médio", "Nahöstlich", "Mediorientale", "Timur Tengah"],
  "Indian": ["India", "Indienne", "Indiana", "Indisch", "Indiana", "India"],
  "Pakistani": ["Pakistaní", "Pakistanaise", "Paquistanesa", "Pakistanisch", "Pakistana", "Pakistan"],
  "Sri Lankan": ["Esrilanquesa", "Sri-lankaise", "Cingalesa", "Sri-lankisch", "Singalese", "Sri Lanka"],
  "Afghan": ["Afgana", "Afghane", "Afegã", "Afghanisch", "Afghana", "Afganistan"],
  "Japanese": ["Japonesa", "Japonaise", "Japonesa", "Japanisch", "Giapponese", "Jepang"],
  "Chinese": ["China", "Chinoise", "Chinesa", "Chinesisch", "Cinese", "Tiongkok"],
  "Korean": ["Coreana", "Coréenne", "Coreana", "Koreanisch", "Coreana", "Korea"],
  "Thai": ["Tailandesa", "Thaïlandaise", "Tailandesa", "Thailändisch", "Thailandese", "Thailand"],
  "Vietnamese": ["Vietnamita", "Vietnamienne", "Vietnamita", "Vietnamesisch", "Vietnamita", "Vietnam"],
  "Filipino": ["Filipina", "Philippine", "Filipina", "Philippinisch", "Filippina", "Filipina"],
  "Indonesian": ["Indonesia", "Indonésienne", "Indonésia", "Indonesisch", "Indonesiana", "Indonesia"],
  "Malaysian": ["Malasia", "Malaisienne", "Malaia", "Malaysisch", "Malese", "Malaysia"],
  "Mexican": ["Mexicana", "Mexicaine", "Mexicana", "Mexikanisch", "Messicana", "Meksiko"],
  "Peruvian": ["Peruana", "Péruvienne", "Peruana", "Peruanisch", "Peruviana", "Peru"],
  "Brazilian": ["Brasileña", "Brésilienne", "Brasileira", "Brasilianisch", "Brasiliana", "Brasil"],
  "Argentinian": ["Argentina", "Argentine", "Argentina", "Argentinisch", "Argentina", "Argentina"],
  "Colombian": ["Colombiana", "Colombienne", "Colombiana", "Kolumbianisch", "Colombiana", "Kolombia"],
  "Caribbean": ["Caribeña", "Caribéenne", "Caribenha", "Karibisch", "Caraibica", "Karibia"],
  "Jamaican": ["Jamaicana", "Jamaïcaine", "Jamaicana", "Jamaikanisch", "Giamaicana", "Jamaika"],
  "Cuban": ["Cubana", "Cubaine", "Cubana", "Kubanisch", "Cubana", "Kuba"],
  "American": ["Estadounidense", "Américaine", "Americana", "Amerikanisch", "Americana", "Amerika"],
  "Southern / Soul Food": ["Sureña / soul food", "Du Sud / soul food", "Sulista / soul food", "Südstaaten / Soul Food", "Del Sud / soul food", "Selatan AS / soul food"],
  "Cajun & Creole": ["Cajún y criolla", "Cajun et créole", "Cajun e crioula", "Cajun & Kreolisch", "Cajun e creola", "Cajun & Kreol"],
  "Hawaiian": ["Hawaiana", "Hawaïenne", "Havaiana", "Hawaiianisch", "Hawaiana", "Hawaii"],
  "Mediterranean": ["Mediterránea", "Méditerranéenne", "Mediterrânea", "Mediterran", "Mediterranea", "Mediterania"],
  "Fusion": ["Fusión", "Fusion", "Fusão", "Fusion", "Fusion", "Fusion"],

  // Diet groups and diets
  "Lifestyle": ["Estilo de vida", "Mode de vie", "Estilo de vida", "Lebensstil", "Stile di vita", "Gaya hidup"],
  "Health Conditions": ["Condiciones de salud", "Problèmes de santé", "Condições de saúde", "Gesundheit", "Condizioni di salute", "Kondisi kesehatan"],
  "Allergies & Intolerances": ["Alergias e intolerancias", "Allergies et intolérances", "Alergias e intolerâncias", "Allergien & Unverträglichkeiten", "Allergie e intolleranze", "Alergi & intoleransi"],
  "Religious & Cultural": ["Religiosas y culturales", "Religieux et culturel", "Religiosas e culturais", "Religiös & kulturell", "Religiose e culturali", "Agama & budaya"],
  "Vegetarian": ["Vegetariana", "Végétarien", "Vegetariana", "Vegetarisch", "Vegetariana", "Vegetarian"],
  "Vegan": ["Vegana", "Végétalien", "Vegana", "Vegan", "Vegana", "Vegan"],
  "Pescatarian": ["Pescetariana", "Pescétarien", "Pescetariana", "Pescetarisch", "Pescetariana", "Pescatarian"],
  "Flexitarian": ["Flexitariana", "Flexitarien", "Flexitariana", "Flexitarisch", "Flexitariana", "Fleksitarian"],
  "Keto": ["Keto", "Cétogène", "Cetogênica", "Keto", "Chetogenica", "Keto"],
  "Paleo": ["Paleo", "Paléo", "Paleo", "Paleo", "Paleo", "Paleo"],
  "Low-Carb": ["Baja en carbohidratos", "Pauvre en glucides", "Low carb", "Low Carb", "Low carb", "Rendah karbohidrat"],
  "High-Protein": ["Alta en proteínas", "Riche en protéines", "Rica em proteínas", "Proteinreich", "Iperproteica", "Tinggi protein"],
  "Mediterranean Diet": ["Dieta mediterránea", "Régime méditerranéen", "Dieta mediterrânea", "Mittelmeerdiät", "Dieta mediterranea", "Diet Mediterania"],
  "Diabetic-Friendly": ["Apta para diabéticos", "Adapté aux diabétiques", "Para diabéticos", "Diabetikerfreundlich", "Adatta ai diabetici", "Ramah diabetes"],
  "Heart-Healthy": ["Cardiosaludable", "Bon pour le cœur", "Saudável para o coração", "Herzgesund", "Salutare per il cuore", "Sehat jantung"],
  "Low-Sodium": ["Baja en sodio", "Pauvre en sodium", "Baixo sódio", "Natriumarm", "Povera di sodio", "Rendah natrium"],
  "Low-Cholesterol": ["Baja en colesterol", "Pauvre en cholestérol", "Baixo colesterol", "Cholesterinarm", "Povera di colesterolo", "Rendah kolesterol"],
  "Kidney-Friendly (Renal)": ["Apta para riñones (renal)", "Adapté aux reins (rénal)", "Para os rins (renal)", "Nierenfreundlich (renal)", "Adatta ai reni (renale)", "Ramah ginjal (renal)"],
  "Low-FODMAP": ["Baja en FODMAP", "Pauvre en FODMAP", "Baixo FODMAP", "FODMAP-arm", "Povera di FODMAP", "Rendah FODMAP"],
  "GERD / Reflux-Friendly": ["Apta para reflujo (ERGE)", "Adapté au reflux (RGO)", "Para refluxo (DRGE)", "Refluxfreundlich (GERD)", "Adatta al reflusso (MRGE)", "Ramah GERD / refluks"],
  "Anti-Inflammatory": ["Antiinflamatoria", "Anti-inflammatoire", "Anti-inflamatória", "Entzündungshemmend", "Antinfiammatoria", "Anti-inflamasi"],
  "Low-Purine (Gout)": ["Baja en purinas (gota)", "Pauvre en purines (goutte)", "Baixa em purinas (gota)", "Purinarm (Gicht)", "Povera di purine (gotta)", "Rendah purin (asam urat)"],
  "Low-Histamine": ["Baja en histamina", "Pauvre en histamine", "Baixa histamina", "Histaminarm", "Povera di istamina", "Rendah histamin"],
  "Low-Fiber / Low-Residue": ["Baja en fibra / residuos", "Pauvre en fibres / résidus", "Baixa em fibras / resíduos", "Ballaststoffarm", "Povera di fibre / scorie", "Rendah serat / residu"],
  "High-Fiber": ["Alta en fibra", "Riche en fibres", "Rica em fibras", "Ballaststoffreich", "Ricca di fibre", "Tinggi serat"],
  "Low-Sugar": ["Baja en azúcar", "Pauvre en sucre", "Baixo açúcar", "Zuckerarm", "Povera di zuccheri", "Rendah gula"],
  "Iron-Rich (Anemia)": ["Rica en hierro (anemia)", "Riche en fer (anémie)", "Rica em ferro (anemia)", "Eisenreich (Anämie)", "Ricca di ferro (anemia)", "Kaya zat besi (anemia)"],
  "Pregnancy-Safe": ["Apta para el embarazo", "Adapté à la grossesse", "Segura na gravidez", "Schwangerschaftsgeeignet", "Adatta in gravidanza", "Aman untuk kehamilan"],
  "Gluten-Free": ["Sin gluten", "Sans gluten", "Sem glúten", "Glutenfrei", "Senza glutine", "Bebas gluten"],
  "Dairy-Free": ["Sin lácteos", "Sans produits laitiers", "Sem laticínios", "Milchfrei", "Senza latticini", "Bebas susu"],
  "Lactose-Free": ["Sin lactosa", "Sans lactose", "Sem lactose", "Laktosefrei", "Senza lattosio", "Bebas laktosa"],
  "Nut-Free": ["Sin frutos secos", "Sans fruits à coque", "Sem oleaginosas", "Nussfrei", "Senza frutta a guscio", "Bebas kacang-kacangan"],
  "Peanut-Free": ["Sin cacahuate", "Sans arachides", "Sem amendoim", "Erdnussfrei", "Senza arachidi", "Bebas kacang tanah"],
  "Shellfish-Free": ["Sin mariscos", "Sans crustacés", "Sem frutos do mar", "Ohne Schalentiere", "Senza crostacei", "Bebas kerang"],
  "Fish-Free": ["Sin pescado", "Sans poisson", "Sem peixe", "Fischfrei", "Senza pesce", "Bebas ikan"],
  "Egg-Free": ["Sin huevo", "Sans œufs", "Sem ovo", "Eifrei", "Senza uova", "Bebas telur"],
  "Soy-Free": ["Sin soya", "Sans soja", "Sem soja", "Sojafrei", "Senza soia", "Bebas kedelai"],
  "Sesame-Free": ["Sin sésamo", "Sans sésame", "Sem gergelim", "Sesamfrei", "Senza sesamo", "Bebas wijen"],
  "Corn-Free": ["Sin maíz", "Sans maïs", "Sem milho", "Maisfrei", "Senza mais", "Bebas jagung"],
  "Nightshade-Free": ["Sin solanáceas", "Sans solanacées", "Sem solanáceas", "Ohne Nachtschattengewächse", "Senza solanacee", "Bebas terung-terungan"],
  "Kosher": ["Kosher", "Casher", "Kosher", "Koscher", "Kosher", "Kosher"],
  "Hindu Vegetarian": ["Vegetariana hindú", "Végétarien hindou", "Vegetariana hindu", "Hinduistisch vegetarisch", "Vegetariana indù", "Vegetarian Hindu"],
  "Jain": ["Jainista", "Jaïn", "Jainista", "Jainistisch", "Giainista", "Jain"],
  "Buddhist Vegetarian": ["Vegetariana budista", "Végétarien bouddhiste", "Vegetariana budista", "Buddhistisch vegetarisch", "Vegetariana buddista", "Vegetarian Buddha"],
  "No Pork": ["Sin cerdo", "Sans porc", "Sem porco", "Ohne Schwein", "Senza maiale", "Tanpa babi"],
  "No Beef": ["Sin res", "Sans bœuf", "Sem carne bovina", "Ohne Rind", "Senza manzo", "Tanpa sapi"],
  "No Alcohol": ["Sin alcohol", "Sans alcool", "Sem álcool", "Ohne Alkohol", "Senza alcol", "Tanpa alkohol"],
  "Lent / Fasting-Friendly": ["Apta para Cuaresma / ayuno", "Carême / jeûne", "Quaresma / jejum", "Fastenzeit-geeignet", "Quaresima / digiuno", "Ramah puasa"],
  "Halal-Friendly": ["Apta halal", "Compatible halal", "Compatível com halal", "Halal-geeignet", "Adatta halal", "Ramah halal"],
  "Soft-Friendly": ["Textura suave", "Texture tendre", "Textura macia", "Weiche Kost", "Consistenza morbida", "Tekstur lembut"],

  // Texture, time, skill, calories
  "Any Texture": ["Cualquier textura", "Toute texture", "Qualquer textura", "Jede Konsistenz", "Qualsiasi consistenza", "Semua tekstur"],
  "Regular": ["Normal", "Normale", "Normal", "Normal", "Normale", "Biasa"],
  "Soft Foods (easy-chew)": ["Alimentos blandos (fáciles de masticar)", "Aliments tendres (faciles à mâcher)", "Alimentos macios (fáceis de mastigar)", "Weiche Kost (leicht zu kauen)", "Cibi morbidi (facili da masticare)", "Makanan lunak (mudah dikunyah)"],
  "Minced & Moist": ["Picado y húmedo", "Haché et moelleux", "Picado e úmido", "Fein gehackt & saftig", "Tritato e umido", "Cincang & lembap"],
  "Puréed": ["Puré", "En purée", "Em purê", "Püriert", "Frullato", "Dihaluskan"],
  "Smooth / Liquid": ["Suave / líquido", "Lisse / liquide", "Liso / líquido", "Glatt / flüssig", "Liscio / liquido", "Halus / cair"],
  "Any Time": ["Cualquier tiempo", "Toute durée", "Qualquer tempo", "Beliebige Dauer", "Qualsiasi durata", "Semua durasi"],
  "Under 15 min": ["Menos de 15 min", "Moins de 15 min", "Menos de 15 min", "Unter 15 Min.", "Meno di 15 min", "Kurang dari 15 menit"],
  "Under 30 min": ["Menos de 30 min", "Moins de 30 min", "Menos de 30 min", "Unter 30 Min.", "Meno di 30 min", "Kurang dari 30 menit"],
  "Under 1 hour": ["Menos de 1 hora", "Moins d'1 heure", "Menos de 1 hora", "Unter 1 Stunde", "Meno di 1 ora", "Kurang dari 1 jam"],
  "1-2 hours": ["1-2 horas", "1-2 heures", "1-2 horas", "1-2 Stunden", "1-2 ore", "1-2 jam"],
  "Any Level": ["Cualquier nivel", "Tous niveaux", "Qualquer nível", "Jedes Niveau", "Qualsiasi livello", "Semua tingkat"],
  "Beginner": ["Principiante", "Débutant", "Iniciante", "Anfänger", "Principiante", "Pemula"],
  "Easy": ["Fácil", "Facile", "Fácil", "Einfach", "Facile", "Mudah"],
  "Intermediate": ["Intermedio", "Intermédiaire", "Intermediário", "Mittel", "Intermedio", "Menengah"],
  "Advanced": ["Avanzado", "Avancé", "Avançado", "Fortgeschritten", "Avanzato", "Mahir"],
  "Any Calories": ["Cualquier cantidad de calorías", "Toutes calories", "Qualquer caloria", "Beliebige Kalorien", "Qualsiasi apporto calorico", "Semua kalori"],
  "Under 300 cal": ["Menos de 300 cal", "Moins de 300 cal", "Menos de 300 cal", "Unter 300 kcal", "Meno di 300 cal", "Kurang dari 300 kal"],
  "300-500 cal": ["300-500 cal", "300-500 cal", "300-500 cal", "300-500 kcal", "300-500 cal", "300-500 kal"],
  "500-700 cal": ["500-700 cal", "500-700 cal", "500-700 cal", "500-700 kcal", "500-700 cal", "500-700 kal"],
  "700+ cal": ["700+ cal", "700+ cal", "700+ cal", "700+ kcal", "700+ cal", "700+ kal"],

  // Quick adjustments
  "Make it vegetarian": ["Hazla vegetariana", "Version végétarienne", "Deixar vegetariana", "Vegetarisch machen", "Rendila vegetariana", "Jadikan vegetarian"],
  "Reduce calories by 30%": ["Reduce las calorías un 30%", "Réduire les calories de 30 %", "Reduzir as calorias em 30%", "30 % weniger Kalorien", "Riduci le calorie del 30%", "Kurangi kalori 30%"],
  "Make it high protein": ["Más proteína", "Plus de protéines", "Mais proteína", "Mehr Eiweiß", "Più proteica", "Tinggikan protein"],
  "Turn into meal prep": ["Convertir en meal prep", "Préparer à l'avance", "Transformar em marmita", "Für Meal Prep anpassen", "Adatta al meal prep", "Jadikan meal prep"],
  "Make it keto": ["Hazla keto", "Version cétogène", "Deixar cetogênica", "Keto machen", "Rendila chetogenica", "Jadikan keto"],
  "Add more vegetables": ["Añade más verduras", "Ajouter plus de légumes", "Adicionar mais vegetais", "Mehr Gemüse", "Aggiungi più verdure", "Tambah sayuran"],
  "Make it spicier": ["Más picante", "Plus épicé", "Mais picante", "Schärfer machen", "Più piccante", "Lebih pedas"],
  "Reduce cooking time": ["Reduce el tiempo de cocción", "Réduire le temps de cuisson", "Reduzir o tempo de preparo", "Kochzeit verkürzen", "Riduci i tempi di cottura", "Persingkat waktu masak"],
  "Make it dairy-free": ["Sin lácteos", "Sans produits laitiers", "Sem laticínios", "Milchfrei machen", "Senza latticini", "Jadikan bebas susu"],
  "Lower the sodium": ["Menos sodio", "Moins de sodium", "Menos sódio", "Weniger Natrium", "Meno sodio", "Kurangi natrium"],
  "Make it diabetic-friendly": ["Apta para diabéticos", "Adaptée aux diabétiques", "Adequada para diabéticos", "Diabetikerfreundlich machen", "Adatta ai diabetici", "Jadikan ramah diabetes"],
  "Make it soft-texture friendly (no soup)": ["Textura suave (sin sopa)", "Texture tendre (sans soupe)", "Textura macia (sem sopa)", "Weiche Konsistenz (keine Suppe)", "Consistenza morbida (niente zuppa)", "Tekstur lembut (bukan sup)"],
  "Make it halal": ["Hazla halal", "Version halal", "Deixar halal", "Halal machen", "Rendila halal", "Jadikan halal"],
  "Use budget ingredients": ["Ingredientes económicos", "Ingrédients économiques", "Ingredientes baratos", "Günstige Zutaten", "Ingredienti economici", "Bahan hemat"],
  "Add a flavor twist": ["Dale un giro de sabor", "Ajouter une touche originale", "Dar um toque especial", "Mit Geschmackstwist", "Aggiungi un tocco di sapore", "Tambah sentuhan rasa"],

  // Discover dishes
  "Roasted Garlic Pasta al Limone": ["Pasta al limone con ajo asado", "Pasta al limone à l'ail rôti", "Pasta al limone com alho assado", "Pasta al limone mit geröstetem Knoblauch", "Pasta al limone con aglio arrostito", "Pasta al limone bawang putih panggang"],
  "Miso-Glazed Salmon Bowl": ["Bowl de salmón glaseado con miso", "Bol de saumon laqué au miso", "Bowl de salmão glaceado com missô", "Bowl mit Miso-glasiertem Lachs", "Bowl di salmone glassato al miso", "Mangkuk salmon glasir miso"],
  "Smoky Black Bean Tacos": ["Tacos de frijoles negros ahumados", "Tacos aux haricots noirs fumés", "Tacos de feijão-preto defumado", "Tacos mit rauchigen schwarzen Bohnen", "Tacos ai fagioli neri affumicati", "Taco kacang hitam asap"],
  "Saffron Chicken Tagine": ["Tajín de pollo al azafrán", "Tajine de poulet au safran", "Tagine de frango com açafrão", "Hähnchen-Tajine mit Safran", "Tajine di pollo allo zafferano", "Tagine ayam safron"],
  "Thai Basil Fried Rice": ["Arroz frito tailandés con albahaca", "Riz frit thaï au basilic", "Arroz frito tailandês com manjericão", "Thai-Bratreis mit Basilikum", "Riso fritto thai al basilico", "Nasi goreng kemangi ala Thailand"],
  "Shakshuka with Feta": ["Shakshuka con feta", "Shakshuka à la feta", "Shakshuka com feta", "Shakshuka mit Feta", "Shakshuka con feta", "Shakshuka dengan feta"],
  "Beef Bulgogi Bibimbap": ["Bibimbap de bulgogi de res", "Bibimbap au bœuf bulgogi", "Bibimbap de bulgogi bovino", "Bibimbap mit Rinder-Bulgogi", "Bibimbap con bulgogi di manzo", "Bibimbap bulgogi sapi"],
  "Pesto Gnocchi with Burrata": ["Ñoquis al pesto con burrata", "Gnocchis au pesto et burrata", "Nhoque ao pesto com burrata", "Pesto-Gnocchi mit Burrata", "Gnocchi al pesto con burrata", "Gnocchi pesto dengan burrata"],
  "Harissa Roasted Cauliflower": ["Coliflor asada con harissa", "Chou-fleur rôti à la harissa", "Couve-flor assada com harissa", "Gerösteter Blumenkohl mit Harissa", "Cavolfiore arrosto alla harissa", "Kembang kol panggang harissa"],
  "Duck Confit with Cherry Jus": ["Confit de pato con jugo de cereza", "Confit de canard, jus de cerise", "Confit de pato com molho de cereja", "Entenconfit mit Kirschjus", "Anatra confit con fondo di ciliegie", "Confit bebek dengan saus ceri"],
  "Avocado Tuna Poke Bowl": ["Poke bowl de atún y aguacate", "Poke bowl thon-avocat", "Poke de atum com abacate", "Poke Bowl mit Thunfisch & Avocado", "Poke bowl tonno e avocado", "Poke bowl tuna alpukat"],
  "Jollof Rice with Chicken": ["Arroz jollof con pollo", "Riz jollof au poulet", "Arroz jollof com frango", "Jollof-Reis mit Hähnchen", "Riso jollof con pollo", "Nasi jollof dengan ayam"],
  "Doro Wat with Injera": ["Doro wat con injera", "Doro wat et injera", "Doro wat com injera", "Doro Wat mit Injera", "Doro wat con injera", "Doro wat dengan injera"],
  "Phở Gà (Chicken Pho)": ["Phở gà (pho de pollo)", "Phở gà (pho au poulet)", "Phở gà (pho de frango)", "Phở gà (Hühner-Pho)", "Phở gà (pho di pollo)", "Phở gà (pho ayam)"],
  "Chicken Adobo": ["Adobo de pollo", "Adobo de poulet", "Adobo de frango", "Hähnchen-Adobo", "Adobo di pollo", "Adobo ayam"],
  "Jerk Chicken with Rice & Peas": ["Pollo jerk con arroz y frijoles", "Poulet jerk, riz et pois", "Frango jerk com arroz e feijão", "Jerk Chicken mit Reis & Bohnen", "Pollo jerk con riso e fagioli", "Ayam jerk dengan nasi & kacang merah"],
  "Mujadara (Lentils & Rice)": ["Mujadara (lentejas y arroz)", "Mujadara (lentilles et riz)", "Mujadara (lentilha e arroz)", "Mujadara (Linsen & Reis)", "Mujadara (lenticchie e riso)", "Mujadara (lentil & nasi)"],
  "Shrimp & Grits": ["Camarones con sémola de maíz", "Crevettes et gruau de maïs", "Camarão com canjiquinha", "Garnelen mit Maisgrieß", "Gamberi con grits di mais", "Udang & bubur jagung"],
  "İmam Bayıldı (Stuffed Eggplant)": ["İmam bayıldı (berenjena rellena)", "İmam bayıldı (aubergines farcies)", "İmam bayıldı (berinjela recheada)", "İmam bayıldı (gefüllte Aubergine)", "İmam bayıldı (melanzane ripiene)", "İmam bayıldı (terung isi)"],
  "Feijoada Vegetariana": ["Feijoada vegetariana", "Feijoada végétarienne", "Feijoada vegetariana", "Vegetarische Feijoada", "Feijoada vegetariana", "Feijoada vegetarian"],
  "Gumbo with Okra": ["Gumbo con quimbombó", "Gumbo au gombo", "Gumbo com quiabo", "Gumbo mit Okra", "Gumbo con okra", "Gumbo dengan okra"],

  // Meal plan dishes
  "Greek Yogurt Parfait": ["Parfait de yogur griego", "Parfait au yaourt grec", "Parfait de iogurte grego", "Griechischer Joghurt-Parfait", "Parfait allo yogurt greco", "Parfait yogurt Yunani"],
  "Avocado Toast": ["Tostada de aguacate", "Toast à l'avocat", "Torrada de abacate", "Avocado-Toast", "Toast all'avocado", "Roti panggang alpukat"],
  "Overnight Oats": ["Avena nocturna", "Overnight oats", "Aveia dormida", "Overnight Oats", "Overnight oats", "Overnight oats"],
  "Eggs Benedict": ["Huevos benedictinos", "Œufs Bénédicte", "Ovos Benedict", "Eier Benedict", "Uova alla Benedict", "Telur Benedict"],
  "French Toast": ["Pan francés", "Pain perdu", "Rabanada", "Arme Ritter", "French toast", "Roti panggang Prancis"],
  "Chicken Caesar Wrap": ["Wrap César de pollo", "Wrap César au poulet", "Wrap Caesar de frango", "Hähnchen-Caesar-Wrap", "Wrap Caesar con pollo", "Wrap Caesar ayam"],
  "Lentil Soup": ["Sopa de lentejas", "Soupe de lentilles", "Sopa de lentilha", "Linsensuppe", "Zuppa di lenticchie", "Sup lentil"],
  "Caprese Salad": ["Ensalada caprese", "Salade caprese", "Salada caprese", "Caprese-Salat", "Insalata caprese", "Salad caprese"],
  "Turkey Panini": ["Panini de pavo", "Panini à la dinde", "Panini de peru", "Truthahn-Panini", "Panino al tacchino", "Panini kalkun"],
  "Caesar Salad": ["Ensalada César", "Salade César", "Salada Caesar", "Caesar Salad", "Insalata Caesar", "Salad Caesar"],
  "Mezze Platter": ["Tabla de mezze", "Assiette de mezzé", "Tábua de mezze", "Mezze-Platte", "Piatto di mezze", "Piring mezze"],
  "Salmon Teriyaki": ["Salmón teriyaki", "Saumon teriyaki", "Salmão teriyaki", "Lachs Teriyaki", "Salmone teriyaki", "Salmon teriyaki"],
  "Beef Stir Fry": ["Salteado de res", "Sauté de bœuf", "Carne salteada", "Rindfleisch aus dem Wok", "Manzo saltato", "Tumis daging sapi"],
  "Chicken Tikka": ["Pollo tikka", "Poulet tikka", "Frango tikka", "Chicken Tikka", "Pollo tikka", "Ayam tikka"],
  "Margherita Pizza": ["Pizza margarita", "Pizza margherita", "Pizza margherita", "Pizza Margherita", "Pizza margherita", "Pizza margherita"],
  "BBQ Ribs": ["Costillas BBQ", "Travers de porc BBQ", "Costela BBQ", "BBQ-Rippchen", "Costine BBQ", "Iga BBQ"],
  "Roast Chicken": ["Pollo asado", "Poulet rôti", "Frango assado", "Brathähnchen", "Pollo arrosto", "Ayam panggang"],
  "Chicken Piccata": ["Pollo piccata", "Poulet piccata", "Frango à piccata", "Hähnchen-Piccata", "Piccata di pollo", "Ayam piccata"],
  "Lemon Pasta": ["Pasta al limón", "Pâtes au citron", "Macarrão ao limão", "Zitronen-Pasta", "Pasta al limone", "Pasta lemon"],

  // Pantry defaults
  "Chicken Breast": ["Pechuga de pollo", "Blanc de poulet", "Peito de frango", "Hähnchenbrust", "Petto di pollo", "Dada ayam"],
  "Garlic": ["Ajo", "Ail", "Alho", "Knoblauch", "Aglio", "Bawang putih"],
  "Cherry Tomatoes": ["Tomates cherry", "Tomates cerises", "Tomates-cereja", "Kirschtomaten", "Pomodorini", "Tomat ceri"],
  "Pasta (spaghetti)": ["Pasta (espagueti)", "Pâtes (spaghetti)", "Macarrão (espaguete)", "Nudeln (Spaghetti)", "Pasta (spaghetti)", "Pasta (spageti)"],
  "Olive Oil": ["Aceite de oliva", "Huile d'olive", "Azeite", "Olivenöl", "Olio d'oliva", "Minyak zaitun"],
  "Parmesan": ["Parmesano", "Parmesan", "Parmesão", "Parmesan", "Parmigiano", "Parmesan"],
  "Lemon": ["Limón", "Citron", "Limão", "Zitrone", "Limone", "Lemon"],
  "Eggs": ["Huevos", "Œufs", "Ovos", "Eier", "Uova", "Telur"],
  "1 bulb": ["1 cabeza", "1 tête", "1 cabeça", "1 Knolle", "1 testa", "1 bonggol"],
  "1 unit": ["1 unidad", "1 unité", "1 unidade", "1 Stück", "1 unità", "1 buah"],

  // Generator ingredient chips
  "chicken": ["pollo", "poulet", "frango", "Hähnchen", "pollo", "ayam"],
  "garlic": ["ajo", "ail", "alho", "Knoblauch", "aglio", "bawang putih"],
  "tomatoes": ["tomates", "tomates", "tomates", "Tomaten", "pomodori", "tomat"],
  "lemon": ["limón", "citron", "limão", "Zitrone", "limone", "lemon"],
  "pasta": ["pasta", "pâtes", "macarrão", "Nudeln", "pasta", "pasta"],
  "onion": ["cebolla", "oignon", "cebola", "Zwiebel", "cipolla", "bawang bombai"],
  "ginger": ["jengibre", "gingembre", "gengibre", "Ingwer", "zenzero", "jahe"],
  "rice": ["arroz", "riz", "arroz", "Reis", "riso", "beras"],
  "eggs": ["huevos", "œufs", "ovos", "Eier", "uova", "telur"],
  "cheese": ["queso", "fromage", "queijo", "Käse", "formaggio", "keju"],
};

export function translate(lang: LanguageCode, key: UIKey, vars?: TranslateVars): string {
  const row: Row = UI[key];
  let text = row[LANGUAGE_INDEX[lang]] || row[0];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}

/** Translates an English option value or dish name; unknown text is returned unchanged. */
export function translateTerm(lang: LanguageCode, english: string): string {
  if (lang === "en") return english;
  const row = TERMS[english];
  return row ? row[LANGUAGE_INDEX[lang] - 1] || english : english;
}

const SERVER_ERRORS: Record<string, UIKey> = {
  "Too many recipes were requested recently. Please try again later.": "errRateLimit",
  "AI request timed out.": "errTimeout",
  "AI generation failed.": "errAiFailed",
  "Claude API key is not configured.": "errNotConfigured",
  "This request was not allowed.": "errNotAllowed",
  "Prompt is too large.": "errInvalid",
  "The AI response did not include a JSON object.": "errInvalid",
  "The AI response was incomplete or invalid. Please try again.": "errInvalid",
  "The AI response was not a recipe object.": "errInvalid",
  "The AI response was not in the expected format.": "errInvalid",
  "The AI returned an invalid recipe.": "errInvalid",
  "The AI returned an invalid recipe. Please try again.": "errInvalid",
  "The AI recipe was missing a name, ingredients, or steps.": "errMissingParts",
  "Culinaria can only help with recipes and cooking.": "errOnlyCooking",
  "Please share at least a few words.": "fbTooShort",
  "Please enter a valid reply email.": "fbInvalidEmail",
  "Private feedback is not configured yet.": "fbNotConfigured",
  "Too many notes were sent recently. Please try again later.": "fbTooMany",
  "Feedback could not be delivered. Please try again.": "fbFailed",
  "Feedback could not be sent. Please try again.": "fbFailed",
};

/** Shows known English server/parser errors in the visitor's language. */
export function localizeError(lang: LanguageCode, message: string): string {
  const key = SERVER_ERRORS[message.trim()];
  if (key) return translate(lang, key);
  if (/^API error: \d+/.test(message)) return translate(lang, "errAiFailed");
  return message;
}

export function formatNumber(lang: LanguageCode, value: number): string {
  return new Intl.NumberFormat(getLanguage(lang).locale).format(value);
}

/** "25 min", "1.5 hr" (English) or "1,5 h" style durations. */
export function formatMinutes(lang: LanguageCode, minutes: number): string {
  if (minutes < 60) return `${minutes} ${lang === "id" ? "menit" : lang === "de" ? "Min." : "min"}`;
  return `${formatNumber(lang, Math.round((minutes / 60) * 10) / 10)} ${translate(lang, "hourUnit")}`;
}

const WEEKDAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Localized short weekday name for the planner's Mon…Sun keys. */
export function weekdayLabel(lang: LanguageCode, dayKey: string): string {
  const index = WEEKDAY_KEYS.indexOf(dayKey);
  if (index === -1 || lang === "en") return dayKey;
  // 1 January 2024 was a Monday.
  const label = new Intl.DateTimeFormat(getLanguage(lang).locale, { weekday: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(2024, 0, 1 + index)));
  return label.charAt(0).toLocaleUpperCase(getLanguage(lang).locale) + label.slice(1);
}

/** Instruction appended to AI prompts so recipes come back in the visitor's language. */
export function aiLanguageInstruction(lang: LanguageCode): string {
  if (lang === "en") return "";
  const language = getLanguage(lang);
  return `\n\nLanguage: write every human-readable value in the JSON (name, cuisine, description, time, ingredient amounts and names, steps, and tips) in ${language.name} (${language.native}). Keep the JSON keys in English, and keep "difficulty" exactly one of Easy, Intermediate, or Advanced in English.`;
}
