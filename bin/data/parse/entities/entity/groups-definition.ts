import { Property } from '../../../../../types/property';

// header and table are whitelists
// text is just for sorting, header values are blacklist for text group

export type Group = 'header' | 'table' | 'body' | 'infobox';
export type Groups = Record<Group, Property[] | any[]>;

export const defaultGroupsDefinition: Groups = {
     header: [
          Property['definition'],
          // Property['STA-Notation'], // staNotationLabel gets injected by static data
          Property['Implementation-in-the-GND'],
          Property['Link-(Item)'],
          Property.Scope,
          // Property.Annotation,
     ],
     table: [
          Property['entity-type-domain'],
          Property['WEMI-level'],
          Property['Recording-method'],
          Property['Standardised-vocabulary-of-Doc:-RDA-property'],
          Property['RDA-Reference'],
          Property.Status,
          Property['Repetition'],
          Property.Encoding,
          Property['Relationships-to-other-elements-of-Doc:-RDA-property'],
     ],
     body: [
          //=== alle Seiten: Vorspann ===
          'P631', // Geltungsbereich/Erklärung
          'P659', // Allgemeines
          'P665', // Definition / Abgrenzung | Doku: STA-Eigenschaft
          'P402', // Informationsquellen
          'P401', // Übergeordnet | Eigenschaft
          'P664', // Übergeordnet | Element
          'P379', // Übergeordnet | Item
          'P380', // Untergeordnet | Item
          'P7', // Beschreibung
          //== GND-Dokumentation ==
          //=== GND-Beispiele ===
          'P928', // Leader (Alma) | GND-Datenfeld --> PICA:000 --> Alma:000 --> Aleph:000
          'P930', // Identifikationsnummer des Normdatensatzes (Aleph) | GND-Datenfeld --> PICA:000 --> Alma:000 --> Aleph:001
          'P325', // Datum der Ersterfassung (PICA, Aleph) | GND-Datenfeld --> PICA:001 --> Alma:000 --> Aleph:092
          'P962', // Kontrollnummer (Alma) | GND-Datenfeld --> PICA:000 --> Alma:001 --> Aleph:000
          'P326', // Datum der letzten Änderung | GND-Datenfeld --> PICA:002 --> Alma:005 --> Aleph:005
          'P327', // Quelle und Datum der letzten Statusvergabe (PICA) | GND-Datenfeld --> PICA:003 --> Alma:000 --> Aleph:000
          'P931', // Kontrollnummer-Identifier (Alma) | GND-Datenfeld --> PICA:000 --> Alma:003 --> Aleph:000
          'P53', // Satzart (PICA) | GND-Datenfeld --> PICA:005 --> Alma:000 --> Aleph:000
          'P295', // GND-Identifier (PICA) | GND-Datenfeld --> PICA:006 --> Alma:000 --> Aleph:000
          'P929', // Datenelemente mit fester Länge (Alma) | GND-Datenfeld --> PICA:000 --> Alma:008 --> Aleph:000
          'P63', // Entitätencodierung (PICA, Aleph) | GND-Datenfeld --> PICA:008 --> Alma:000 --> Aleph:093
          'P301', // Änderungskennzeichnung von Datensätzen (PICA) | GND-Datenfeld --> PICA:010 --> Alma:000 --> Aleph:000
          'P108', // Teilbestandskennzeichen (PICA, Aleph) | GND-Datenfeld --> PICA:011 --> Alma:000 --> Aleph:098
          'P328', // Nutzungskennzeichen (PICA, Aleph) | GND-Datenfeld --> PICA:012 --> Alma:000 --> Aleph:096
          'P332', // SWD-Nr. im GKD-Satz (PICA) | GND-Datenfeld --> PICA:023 --> Alma:000 --> Aleph:000
          'P334', // Sonstige Standardnummern (PICA) | GND-Datenfeld --> PICA:024 --> Alma:000 --> Aleph:000
          'P972', // GND-Identifier und sonstige Standardnummern (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:024 --> Aleph:024
          'P333', // GKD-Nr. im SWD-Satz (PICA) | GND-Datenfeld --> PICA:028 --> Alma:000 --> Aleph:000
          'P133', // Geografische Koordinaten | GND-Datenfeld --> PICA:034 --> Alma:034 --> Aleph:034
          'P101', // GND-Nummer | GND-Datenfeld --> PICA:035 --> Alma:035 --> Aleph:035
          'P245', // Alte Normnummer | GND-Datenfeld --> PICA:039 --> Alma:035 --> Aleph:039
          'P344', // Katalogisierungsquelle (PICA, Alma) | GND-Datenfeld --> PICA:040 --> Alma:040 --> Aleph:667
          'P916', // Katalogisierungslevel (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:042 --> Aleph:095
          'P336', // Ländercode | GND-Datenfeld --> PICA:043 --> Alma:043 --> Aleph:043
          'P340', // GND-Systematik | GND-Datenfeld --> PICA:065 --> Alma:065 --> Aleph:065
          'P865', // Satztyp und Entitätencode (Alma) | GND-Datenfeld --> PICA:000 --> Alma:075 --> Aleph:000
          'P863', // Normdatenspezifische Codierungen (Alma) | GND-Datenfeld --> PICA:000 --> Alma:079 --> Aleph:000
          'P65', // DDC-Notation | GND-Datenfeld --> PICA:083 --> Alma:083 --> Aleph:083
          'P339', // DDC-Notation (veraltet) | GND-Datenfeld --> PICA:089 --> Alma:089 --> Aleph:089
          'P918', // Nutzungseinschränkung: Hinweissatz (Aleph) | GND-Datenfeld --> PICA:000 --> Alma:000 --> Aleph:094
          'P866', // Satztyp (Aleph) | GND-Datenfeld --> PICA:000 --> Alma:000 --> Aleph:097
          'P58', // Bevorzugter Name: Person oder Familie | GND-Datenfeld --> PICA:100 --> Alma:100 --> Aleph:100
          'P900', // Bevorzugter Titel: Werk mit geistigem Schöpfer - Person oder Familie (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:100 --> Aleph:100
          'P90', // Bevorzugter Name: Körperschaft | GND-Datenfeld --> PICA:110 --> Alma:110 --> Aleph:110
          'P901', // Bevorzugter Titel: Werk mit geistigem Schöpfer - Körperschaft (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:110 --> Aleph:110
          'P391', // Bevorzugter Name: Konferenz | GND-Datenfeld --> PICA:111 --> Alma:111 --> Aleph:111
          'P902', // Bevorzugter Titel: Werk mit geistigem Schöpfer - Konferenz (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:111 --> Aleph:111
          'P919', // Bevorzugter Titel: Werk ohne geistigen Schöpfer | GND-Datenfeld --> PICA:130 --> Alma:130 --> Aleph:130
          'P91', // Bevorzugter Titel: Werk mit geistigem Schöpfer (PICA) | GND-Datenfeld --> PICA:130 --> Alma:000 --> Aleph:000
          'P93', // Bevorzugte Benennung: Sachbegriff | GND-Datenfeld --> PICA:150 --> Alma:150 --> Aleph:150
          'P94', // Bevorzugter Name: Geografikum | GND-Datenfeld --> PICA:151 --> Alma:151 --> Aleph:151
          'P349', // Matching Informationen | GND-Datenfeld --> PICA:169 --> Alma:885 --> Aleph:885
          'P351', // Zu verknüpfende Schlagwörter in Hinweissätzen | GND-Datenfeld --> PICA:260 --> Alma:260 --> Aleph:260
          'P68', // Inhaltstyp | GND-Datenfeld --> PICA:336 --> Alma:336 --> Aleph:336
          'P352', // Medientyp | GND-Datenfeld --> PICA:337 --> Alma:000 --> Aleph:000
          'P353', // Datenträgertyp | GND-Datenfeld --> PICA:338 --> Alma:000 --> Aleph:000
          'P300', // Geschlecht | GND-Datenfeld --> PICA:375 --> Alma:375 --> Aleph:375
          'P309', // Sprachencode nach ISO 639-2/B | GND-Datenfeld --> PICA:377 --> Alma:377 --> Aleph:377
          'P310', // Form des Werks | GND-Datenfeld --> PICA:380 --> Alma:380 --> Aleph:380
          'P316', // Besetzung | GND-Datenfeld --> PICA:382 --> Alma:382 --> Aleph:382
          'P320', // Numerische Kennzeichnung eines Musikwerks | GND-Datenfeld --> PICA:383 --> Alma:383 --> Aleph:383
          'P322', // Tonart | GND-Datenfeld --> PICA:384 --> Alma:384 --> Aleph:384
          'P59', // Abweichender Name: Person oder Familie | GND-Datenfeld --> PICA:400 --> Alma:400 --> Aleph:400
          'P907', // Abweichender Titel: Werk mit geistigem Schöpfer - Person oder Familie (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:400 --> Aleph:400
          'P96', // Abweichender Name: Körperschaft | GND-Datenfeld --> PICA:410 --> Alma:410 --> Aleph:410
          'P906', // Abweichender Titel: Werk mit geistigem Schöpfer - Körperschaft (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:410 --> Aleph:410
          'P95', // Abweichender Name: Konferenz | GND-Datenfeld --> PICA:411 --> Alma:411 --> Aleph:411
          'P905', // Abweichender Titel: Werk mit geistigem Schöpfer - Konferenz (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:411 --> Aleph:411
          'P988', // Abweichender Titel: Werk ohne geistigen Schöpfer | GND-Datenfeld --> PICA:430 --> Alma:430 --> Aleph:430
          'P97', // Abweichender Titel: Werk mit geistigem Schöpfer (PICA) | GND-Datenfeld --> PICA:430 --> Alma:000 --> Aleph:000
          'P99', // Abweichende Benennung: Sachbegriff | GND-Datenfeld --> PICA:450 --> Alma:450 --> Aleph:450
          'P98', // Abweichender Name: Geografikum | GND-Datenfeld --> PICA:451 --> Alma:451 --> Aleph:451
          'P55', // Beziehung zu einer Person oder Familie | GND-Datenfeld --> PICA:500 --> Alma:500 --> Aleph:500
          'P908', // Beziehung zu einem Werk mit geistigem Schöpfer - Person oder Familie (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:500 --> Aleph:500
          'P56', // Beziehung zu einer Körperschaft | GND-Datenfeld --> PICA:510 --> Alma:510 --> Aleph:510
          'P909', // Beziehung zu einem Werk mit geistigem Schöpfer - Körperschaft (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:510 --> Aleph:510
          'P70', // Beziehung zu einer Konferenz | GND-Datenfeld --> PICA:511 --> Alma:511 --> Aleph:511
          'P910', // Beziehung zu einem Werk mit geistigem Schöpfer - Konferenz (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:511 --> Aleph:511
          'P989', // Beziehung zu einem Werk ohne geistigen Schöpfer | GND-Datenfeld --> PICA:530 --> Alma:530 --> Aleph:530
          'P71', // Beziehung zu einem Werk mit geistigem Schöpfer (PICA) | GND-Datenfeld --> PICA:530 --> Alma:000 --> Aleph:000
          'P89', // Zeitliche Einordnung | GND-Datenfeld --> PICA:548 --> Alma:548 --> Aleph:548
          'P72', // Beziehung zu einem Sachbegriff | GND-Datenfeld --> PICA:550 --> Alma:550 --> Aleph:550
          'P73', // Beziehung zu einem Geografikum | GND-Datenfeld --> PICA:551 --> Alma:551 --> Aleph:551
          'P80', // Redaktionelle Bemerkungen | GND-Datenfeld --> PICA:667 --> Alma:667 --> Aleph:667
          'P81', // Quellenangaben | GND-Datenfeld --> PICA:670 --> Alma:670 --> Aleph:670
          'P358', // Titel in Beziehung zur Entität | GND-Datenfeld --> PICA:672 --> Alma:672 --> Aleph:672
          'P83', // Negativ eingesehene Quellen | GND-Datenfeld --> PICA:675 --> Alma:675 --> Aleph:675
          'P84', // Definitionen | GND-Datenfeld --> PICA:677 --> Alma:677 --> Aleph:677
          'P85', // Biografische, historische und andere Angaben | GND-Datenfeld --> PICA:678 --> Alma:678 --> Aleph:678
          'P86', // Benutzungshinweise | GND-Datenfeld --> PICA:680 --> Alma:680 --> Aleph:680
          'P354', // Zieldatensatz für Umlenkung (PICA) | GND-Datenfeld --> PICA:682 --> Alma:000 --> Aleph:000
          'P926', // Änderungskennzeichnung von Datensätzen (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:682 --> Aleph:682
          'P355', // Zieldatensatz für Aufspaltung (PICA) | GND-Datenfeld --> PICA:689 --> Alma:000 --> Aleph:000
          'P107', // Bevorzugter Name in einem anderen Datenbestand oder in nicht-lateinischer Schrift: Person oder Familie | GND-Datenfeld --> PICA:700 --> Alma:700 --> Aleph:700
          'P915', // Bevorzugter Titel in einem anderen Datenbestand oder originalschriftliche Form: Werk mit geistigem Schöpfer - Person oder Familie (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:700 --> Aleph:700
          'P104', // Bevorzugter Name in einem anderen Datenbestand oder in nicht-lateinischer Schrift: Körperschaft | GND-Datenfeld --> PICA:710 --> Alma:710 --> Aleph:710
          'P913', // Bevorzugter Titel in einem anderen Datenbestand oder originalschriftliche Form: Werk mit geistigem Schöpfer - Körperschaft (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:710 --> Aleph:710
          'P105', // Bevorzugter Name in einem anderen Datenbestand oder in nicht-lateinischer Schrift: Konferenz | GND-Datenfeld --> PICA:711 --> Alma:711 --> Aleph:711
          'P914', // Bevorzugter Titel in einem anderen Datenbestand oder originalschriftliche Form: Werk mit geistigem Schöpfer - Konferenz (Alma, Aleph) | GND-Datenfeld --> PICA:000 --> Alma:711 --> Aleph:711
          'P990', // Bevorzugter Titel in einem anderen Datenbestand oder originalschriftliche Form: Werk ohne geistigen Schöpfer | GND-Datenfeld --> PICA:730 --> Alma:730 --> Aleph:730
          'P103', // Bevorzugte Benennung in einem anderen Datenbestand: Sachbegriff | GND-Datenfeld --> PICA:750 --> Alma:750 --> Aleph:750
          'P106', // Bevorzugter Name in einem anderen Datenbestand oder in nicht-lateinischer Schrift: Geografikum | GND-Datenfeld --> PICA:751 --> Alma:751 --> Aleph:751
          'P360', // Interne Identifikationsnummer (PPN) | GND-Datenfeld --> PICA:797 --> Alma:000 --> Aleph:000
          'P364', // Mailbox | GND-Datenfeld --> PICA:901 --> Alma:912 --> Aleph:901
          'P367', // Katalogisierende Institution | GND-Datenfeld --> PICA:903 --> Alma:000 --> Aleph:903
          'P375', // Alte Ansetzungsform (PND, GKD, SWD, DMA-EST) | GND-Datenfeld --> PICA:913 --> Alma:913 --> Aleph:990
          'P378', // Sortiername im Deutschen Exilarchiv (PICA) | GND-Datenfeld --> PICA:980 --> Alma:000 --> Aleph:000
          'P370', // Fehlermeldungen aus der maschinellen Relationierung | GND-Datenfeld --> PICA:999 --> Alma:000 --> Aleph:000
          //=== GND-Datenfelder ===
          'P10', // Ausführungsbestimmungen
          'P15', // Unterfelder
          'P9', // Validierung
          'P16', // Befugnisse
          'P13', // zulässig in Satztyp
          //=== GND-Entitätstypen ===
          'P849', // Sucheinstiege | Doku: STA-Eigenschaft
          'P854', // Sonstige Merkmale | Doku: STA-Eigenschaft
          //=== GND-Satztypen ===
          'P14', // Datenfelder
          //=== GND-Unterfelder ===
          'P60', // Verwendung in Datenfeld | Doku: GND-Eigenschaft
          //== RDA ==
          //=== RDA-Beispiele ===
          'P669', // Status der Identifizierung | RDA-Eigenschaft --> RDA-E-A005
          'P670', // Indikator für nicht individualisierte Namen | RDA-Eigenschaft --> RDA-E-A010
          'P671', // Konsultierte Quelle | RDA-Eigenschaft --> RDA-E-A015
          'P672', // Anmerkung zum Metadatenwerk | RDA-Eigenschaft --> RDA-E-A020
          'P531', // Inhaltstyp | RDA-Eigenschaft --> RDA-E-E005
          'P592', // Sprache einer Expression | RDA-Eigenschaft --> RDA-E-E010
          'P598', // Tonart einer Expression | RDA-Eigenschaft --> RDA-E-E015
          'P627', // Zusammenfassung eines Inhalts | RDA-Eigenschaft --> RDA-E-E020
          'P529', // Information zur Aufzeichnung | RDA-Eigenschaft --> RDA-E-E025
          'P460', // Aufzeichnungsort | RDA-Eigenschaft --> RDA-E-E030
          'P458', // Aufzeichnungsdatum | RDA-Eigenschaft --> RDA-E-E035
          'P451', // Anmerkung zur Aufzeichnung | RDA-Eigenschaft --> RDA-E-E040
          'P510', // Form einer Notation | RDA-Eigenschaft --> RDA-E-E045
          'P587', // Schrift | RDA-Eigenschaft --> RDA-E-E050
          'P509', // Form einer Musiknotation | RDA-Eigenschaft --> RDA-E-E055
          'P511', // Form einer taktilen Notation | RDA-Eigenschaft --> RDA-E-E060
          'P467', // Barrierefreier Inhalt | RDA-Eigenschaft --> RDA-E-E065
          'P527', // Illustrierender Inhalt | RDA-Eigenschaft --> RDA-E-E070
          'P496', // Ergänzender Inhalt | RDA-Eigenschaft --> RDA-E-E075
          'P507', // Farbinhalt | RDA-Eigenschaft --> RDA-E-E080
          'P471', // Bildseitenverhältnis | RDA-Eigenschaft --> RDA-E-E085
          'P474', // Bezeichnung eines Bildseitenverhältnisses | RDA-Eigenschaft --> RDA-E-E090
          'P557', // Musikalische Ausgabeform | RDA-Eigenschaft --> RDA-E-E095
          'P468', // Besetzung für musikalischen Inhalt | RDA-Eigenschaft --> RDA-E-E100
          'P485', // Dauer | RDA-Eigenschaft --> RDA-E-E105
          'P548', // Maßstab | RDA-Eigenschaft --> RDA-E-E110
          'P549', // Maßstab eines unbewegten Bilds oder einer dreidimensionalen Form | RDA-Eigenschaft --> RDA-E-E115
          'P524', // Horizontaler Maßstab bei kartografischem Inhalt | RDA-Eigenschaft --> RDA-E-E120
          'P614', // Vertikaler Maßstab bei kartografischem Inhalt | RDA-Eigenschaft --> RDA-E-E125
          'P628', // Zusätzliche Informationen zu einem Maßstab | RDA-Eigenschaft --> RDA-E-E130
          'P550', // Maßstabsbezeichnung | RDA-Eigenschaft --> RDA-E-E135
          'P582', // Projektion von kartografischem Inhalt | RDA-Eigenschaft --> RDA-E-E140
          'P486', // Details zu kartografischem Inhalt | RDA-Eigenschaft --> RDA-E-E145
          'P464', // Auszeichnung | RDA-Eigenschaft --> RDA-E-E150
          'P452', // Anmerkung zur Expression | RDA-Eigenschaft --> RDA-E-E155
          'P450', // Anmerkung zu Änderungen von Inhaltseigenschaften | RDA-Eigenschaft --> RDA-E-E160
          'P556', // Mitwirkende/Mitwirkender| RDA-Eigenschaft (Akteur) --> RDA-E-E165
          'P553', // Mit Expression in Beziehung stehende Expression | RDA-Eigenschaft --> RDA-E-E170
          'P421', // Name einer Familie | RDA-Eigenschaft --> RDA-E-F005
          'P417', // Bevorzugter Name einer Familie | RDA-Eigenschaft --> RDA-E-F010
          'P415', // Abweichender Name einer Familie | RDA-Eigenschaft --> RDA-E-F015
          'P418', // Kategorie einer Familie | RDA-Eigenschaft --> RDA-E-F020
          'P419', // Mit Familie in Beziehung stehender Zeitraum | RDA-Eigenschaft --> RDA-E-F025
          'P420', // Mit Familie in Beziehung stehendes Geografikum | RDA-Eigenschaft --> RDA-E-F030
          'P416', // Bedeutendes Familienmitglied | RDA-Eigenschaft --> RDA-E-F035
          'P646', // Erbtitel | RDA-Eigenschaft --> RDA-E-F040
          'P684', // Sprache einer Familie | RDA-Eigenschaft --> RDA-E-F045
          'P685', // Familiengeschichte | RDA-Eigenschaft --> RDA-E-F050
          'P686', // Identifikator für eine Familie | RDA-Eigenschaft --> RDA-E-F055
          'P695', // Mit Familie in Beziehung stehende Familie | RDA-Eigenschaft --> RDA-E-F060
          'P649', // Name eines Geografikums | RDA-Eigenschaft --> RDA-E-G005
          'P648', // Bevorzugter Name eines Geografikums | RDA-Eigenschaft --> RDA-E-G010
          'P647', // Abweichender Name eines Geografikums | RDA-Eigenschaft --> RDA-E-G015
          'P692', // Identifikator für ein Geografikum | RDA-Eigenschaft --> RDA-E-G020
          'P430', // Name einer Körperschaft | RDA-Eigenschaft --> RDA-E-K005
          'P423', // Bevorzugter Name einer Körperschaft | RDA-Eigenschaft --> RDA-E-K010
          'P412', // Abweichender Name einer Körperschaft | RDA-Eigenschaft --> RDA-E-K015
          'P429', // Mit Körperschaft in Beziehung stehendes Geografikum | RDA-Eigenschaft --> RDA-E-K020
          'P431', // Ort einer Konferenz | RDA-Eigenschaft --> RDA-E-K025
          'P428', // Mit Körperschaft in Beziehung stehender Zeitraum | RDA-Eigenschaft --> RDA-E-K035
          'P424', // Datum einer Konferenz | RDA-Eigenschaft --> RDA-E-K040
          'P426', // Gründungsdatum | RDA-Eigenschaft --> RDA-E-K045
          'P422', // Auflösungsdatum | RDA-Eigenschaft --> RDA-E-K050
          'P432', // Wirkungszeitraum einer Körperschaft | RDA-Eigenschaft --> RDA-E-K055
          'P427', // Mit Körperschaft in Beziehung stehende Körperschaft | RDA-Eigenschaft --> RDA-E-K060
          'P433', // Zählung einer Konferenz | RDA-Eigenschaft --> RDA-E-K065
          'P499', // Kategorie einer Körperschaft | RDA-Eigenschaft --> RDA-E-K070
          'P498', // Kategorie einer Gebietskörperschaft | RDA-Eigenschaft --> RDA-E-K075
          'P687', // Sprache einer Körperschaft | RDA-Eigenschaft --> RDA-E-K085
          'P688', // Adresse einer Körperschaft | RDA-Eigenschaft --> RDA-E-K090
          'P689', // Betätigungsfeld einer Körperschaft | RDA-Eigenschaft --> RDA-E-K095
          'P690', // Geschichte einer Körperschaft | RDA-Eigenschaft --> RDA-E-K100
          'P691', // Identifikator für eine Körperschaft | RDA-Eigenschaft --> RDA-E-K105
          'P593', // Titel einer Manifestation | RDA-Eigenschaft --> RDA-E-M003
          'P518', // Haupttitel | RDA-Eigenschaft --> RDA-E-M005
          'P577', // Paralleltitel | RDA-Eigenschaft --> RDA-E-M010
          'P596', // Titelzusatz | RDA-Eigenschaft --> RDA-E-M015
          'P568', // Paralleler Titelzusatz | RDA-Eigenschaft --> RDA-E-M020
          'P441', // Abweichender Titel einer Manifestation | RDA-Eigenschaft --> RDA-E-M025
          'P512', // Früherer Haupttitel | RDA-Eigenschaft --> RDA-E-M030
          'P536', // Key Title | RDA-Eigenschaft --> RDA-E-M035
          'P541', // Kurztitel | RDA-Eigenschaft --> RDA-E-M040
          'P610', // Verantwortlichkeitsangabe | RDA-Eigenschaft --> RDA-E-M045
          'P608', // Verantwortlichkeitsangabe, die sich auf einen Haupttitel bezieht | RDA-Eigenschaft --> RDA-E-M050
          'P575', // Parallele Verantwortlichkeitsangabe, die sich auf einen Haupttitel bezieht | RDA-Eigenschaft --> RDA-E-M055
          'P463', // Ausgabevermerk | RDA-Eigenschaft --> RDA-E-M060
          'P461', // Ausgabebezeichnung | RDA-Eigenschaft --> RDA-E-M065
          'P561', // Parallele Ausgabebezeichnung | RDA-Eigenschaft --> RDA-E-M070
          'P606', // Verantwortlichkeitsangabe, die sich auf eine Ausgabe bezieht | RDA-Eigenschaft --> RDA-E-M075
          'P573', // Parallele Verantwortlichkeitsangabe, die sich auf eine Ausgabe bezieht | RDA-Eigenschaft --> RDA-E-M080
          'P462', // Ausgabebezeichnung einer näher erläuterten Überarbeitung | RDA-Eigenschaft --> RDA-E-M085
          'P562', // Parallele Ausgabebezeichnung einer näher erläuterten Überarbeitung | RDA-Eigenschaft --> RDA-E-M090
          'P607', // Verantwortlichkeitsangabe, die sich auf eine näher erläuterte Überarbeitung einer Ausgabe bezieht | RDA-Eigenschaft --> RDA-E-M095
          'P574', // Parallele Verantwortlichkeitsangabe, die sich auf eine näher erläuterte Überarbeitung einer Ausgabe bezieht | RDA-Eigenschaft --> RDA-E-M100
          'P623', // Zählung einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M105
          'P444', // Alphanumerische Bezeichnung der ersten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M110
          'P478', // Chronologische Bezeichnung der ersten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M115
          'P445', // Alphanumerische Bezeichnung der letzten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M120
          'P479', // Chronologische Bezeichnung der letzten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M125
          'P446', // Alternative alphanumerische Bezeichnung der ersten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M130
          'P448', // Alternative chronologische Bezeichnung der ersten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M135
          'P447', // Alternative alphanumerische Bezeichnung der letzten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M140
          'P449', // Alternative chronologische Bezeichnung der letzten Ausgabe einer fortlaufenden Ressource | RDA-Eigenschaft --> RDA-E-M145
          'P491', // Entstehungsangabe | RDA-Eigenschaft --> RDA-E-M150
          'P494', // Entstehungsort | RDA-Eigenschaft --> RDA-E-M155
          'P563', // Paralleler Entstehungsort | RDA-Eigenschaft --> RDA-E-M160
          'P506', // Erzeugername | RDA-Eigenschaft --> RDA-E-M165
          'P565', // Paralleler Erzeugername | RDA-Eigenschaft --> RDA-E-M170
          'P492', // Entstehungsdatum | RDA-Eigenschaft --> RDA-E-M175
          'P613', // Veröffentlichungsangabe | RDA-Eigenschaft --> RDA-E-M180
          'P504', // Erscheinungsort | RDA-Eigenschaft --> RDA-E-M185
          'P564', // Paralleler Erscheinungsort | RDA-Eigenschaft --> RDA-E-M190
          'P612', // Verlagsname | RDA-Eigenschaft --> RDA-E-M195
          'P570', // Paralleler Verlagsname | RDA-Eigenschaft --> RDA-E-M200
          'P502', // Erscheinungsdatum | RDA-Eigenschaft --> RDA-E-M205
          'P615', // Vertriebsangabe | RDA-Eigenschaft --> RDA-E-M210
          'P618', // Vertriebsort | RDA-Eigenschaft --> RDA-E-M215
          'P572', // Paralleler Vertriebsort | RDA-Eigenschaft --> RDA-E-M220
          'P617', // Vertriebsname | RDA-Eigenschaft --> RDA-E-M225
          'P571', // Paralleler Vertriebsname | RDA-Eigenschaft --> RDA-E-M230
          'P616', // Vertriebsdatum | RDA-Eigenschaft --> RDA-E-M235
          'P520', // Herstellungsangabe | RDA-Eigenschaft --> RDA-E-M240
          'P522', // Herstellungsort | RDA-Eigenschaft --> RDA-E-M245
          'P567', // Paralleler Herstellungsort | RDA-Eigenschaft --> RDA-E-M250
          'P519', // Herstellername | RDA-Eigenschaft --> RDA-E-M255
          'P566', // Paralleler Herstellername | RDA-Eigenschaft --> RDA-E-M260
          'P521', // Herstellungsdatum | RDA-Eigenschaft --> RDA-E-M265
          'P480', // Copyright-Datum | RDA-Eigenschaft --> RDA-E-M270
          'P515', // Gesamttitelangabe | RDA-Eigenschaft --> RDA-E-M275
          'P594', // Titel einer Reihe | RDA-Eigenschaft --> RDA-E-M280
          'P578', // Paralleltitel einer Reihe | RDA-Eigenschaft --> RDA-E-M285
          'P597', // Titelzusatz einer Reihe | RDA-Eigenschaft --> RDA-E-M290
          'P569', // Paralleler Titelzusatz einer Reihe | RDA-Eigenschaft --> RDA-E-M295
          'P609', // Verantwortlichkeitsangabe, die sich auf eine Reihe bezieht | RDA-Eigenschaft --> RDA-E-M300
          'P576', // Parallele Verantwortlichkeitsangabe, die sich auf eine Reihe bezieht | RDA-Eigenschaft --> RDA-E-M305
          'P532', // ISSN einer Reihe | RDA-Eigenschaft --> RDA-E-M310
          'P624', // Zählung innerhalb einer Reihe | RDA-Eigenschaft --> RDA-E-M315
          'P505', // Erscheinungsweise | RDA-Eigenschaft --> RDA-E-M320
          'P503', // Erscheinungsfrequenz | RDA-Eigenschaft --> RDA-E-M325
          'P525', // Identifikator für eine Manifestation | RDA-Eigenschaft --> RDA-E-M330
          'P558', // Noten-Bestellnummer | RDA-Eigenschaft --> RDA-E-M335
          'P488', // Druckplattennummer für Noten | RDA-Eigenschaft --> RDA-E-M340
          'P508', // Fingerprint | RDA-Eigenschaft --> RDA-E-M345
          'P453', // Anmerkung zur Manifestation | RDA-Eigenschaft --> RDA-E-M350
          'P552', // Medientyp | RDA-Eigenschaft --> RDA-E-M360
          'P483', // Datenträgertyp | RDA-Eigenschaft --> RDA-E-M365
          'P603', // Umfang einer Manifestation | RDA-Eigenschaft --> RDA-E-M370
          'P545', // Maße | RDA-Eigenschaft --> RDA-E-M375
          'P546', // Maße eines kartografischen Bilds | RDA-Eigenschaft --> RDA-E-M380
          'P547', // Maße eines unbewegten Bilds | RDA-Eigenschaft --> RDA-E-M385
          'P551', // Material | RDA-Eigenschaft --> RDA-E-M390
          'P602', // Trägermaterial | RDA-Eigenschaft --> RDA-E-M395
          'P456', // Aufgebrachtes Material | RDA-Eigenschaft --> RDA-E-M400
          'P490', // Emulsionsschicht auf Mikrofilm und Mikrofiche | RDA-Eigenschaft --> RDA-E-M405
          'P517', // Halterung | RDA-Eigenschaft --> RDA-E-M410
          'P493', // Entstehungsmethode | RDA-Eigenschaft --> RDA-E-M415
          'P540', // Kopiengeneration | RDA-Eigenschaft --> RDA-E-M420
          'P544', // Layout | RDA-Eigenschaft --> RDA-E-M425
          'P477', // Bibliografisches Format | RDA-Eigenschaft --> RDA-E-M430
          'P588', // Schriftgröße | RDA-Eigenschaft --> RDA-E-M435
          'P579', // Polarität | RDA-Eigenschaft --> RDA-E-M440
          'P611', // Verkleinerungsfaktor | RDA-Eigenschaft --> RDA-E-M445
          'P600', // Toninhalt | RDA-Eigenschaft --> RDA-E-M450
          'P475', // Bezeichnung eines Verkleinerungsfaktors | RDA-Eigenschaft --> RDA-E-M455
          'P599', // Toneigenschaft | RDA-Eigenschaft --> RDA-E-M460
          'P455', // Art einer Aufnahme | RDA-Eigenschaft --> RDA-E-M465
          'P459', // Aufzeichnungsmedium | RDA-Eigenschaft --> RDA-E-M470
          'P439', // Abspielgeschwindigkeit | RDA-Eigenschaft --> RDA-E-M475
          'P586', // Rilleneigenschaft | RDA-Eigenschaft --> RDA-E-M480
          'P601', // Tonspurlage | RDA-Eigenschaft --> RDA-E-M485
          'P465', // Bandkonfiguration | RDA-Eigenschaft --> RDA-E-M490
          'P538', // Konfiguration von Wiedergabekanälen | RDA-Eigenschaft --> RDA-E-M495
          'P469', // Besondere Wiedergabeeigenschaft | RDA-Eigenschaft --> RDA-E-M500
          'P580', // Projektionseigenschaft von Filmen | RDA-Eigenschaft --> RDA-E-M505
          'P622', // Wiedergabeformat | RDA-Eigenschaft --> RDA-E-M510
          'P581', // Projektionsgeschwindigkeit | RDA-Eigenschaft --> RDA-E-M515
          'P619', // Video-Eigenschaft | RDA-Eigenschaft --> RDA-E-M520
          'P620', // Videoformat | RDA-Eigenschaft --> RDA-E-M525
          'P589', // Sendestandard | RDA-Eigenschaft --> RDA-E-M530
          'P489', // Eigenschaft einer digitalen Datei | RDA-Eigenschaft --> RDA-E-M535
          'P482', // Dateityp | RDA-Eigenschaft --> RDA-E-M540
          'P537', // Kodierungsformat | RDA-Eigenschaft --> RDA-E-M545
          'P481', // Dateigröße | RDA-Eigenschaft --> RDA-E-M550
          'P457', // Auflösung | RDA-Eigenschaft --> RDA-E-M555
          'P583', // Regionalcode | RDA-Eigenschaft --> RDA-E-M560
          'P472', // Bitrate | RDA-Eigenschaft --> RDA-E-M565
          'P487', // Digitale Darstellung von kartografischem Inhalt | RDA-Eigenschaft --> RDA-E-M570
          'P534', // Kartografischer Datentyp | RDA-Eigenschaft --> RDA-E-M575
          'P514', // Geräte- oder Systemanforderung | RDA-Eigenschaft --> RDA-E-M580
          'P476', // Bezugsbedingung | RDA-Eigenschaft --> RDA-E-M585
          'P626', // Zugangsbedingung einer Manifestation | RDA-Eigenschaft --> RDA-E-M590
          'P466', // Benutzungsbedingung einer Manifestation | RDA-Eigenschaft --> RDA-E-M595
          'P604', // Uniform Resource Locator | RDA-Eigenschaft --> RDA-E-M600
          'P625', // Zielgruppe | RDA-Eigenschaft --> RDA-E-M605
          'P442', // Mit Manifestation in Beziehung stehender Akteur | RDA-Eigenschaft --> RDA-E-M610
          'P554', // Mit Manifestation in Beziehung stehende Manifestation | RDA-Eigenschaft --> RDA-E-M615
          'P653', // In einer Manifestation verkörperte Expression | RDA-Eigenschaft --> RDA-E-M620
          'P528', // In einer Manifestation verkörpertes Werk | RDA-Eigenschaft --> RDA-E-M625
          'P399', // Name einer Person | RDA-Eigenschaft --> RDA-E-'P005'
          'P395', // Bevorzugter Name einer Person | RDA-Eigenschaft --> RDA-E-'P010'
          'P400', // Abweichender Name einer Person | RDA-Eigenschaft --> RDA-E-'P015'
          'P435', // Mit Person in Beziehung stehender Zeitraum | RDA-Eigenschaft --> RDA-E-'P020'
          'P434', // Geburtsdatum | RDA-Eigenschaft --> RDA-E-'P025'
          'P437', // Sterbedatum | RDA-Eigenschaft --> RDA-E-'P030'
          'P500', // Wirkungszeitraum einer Person | RDA-Eigenschaft --> RDA-E-'P035'
          'P436', // Rang-, Ehren- oder Amtsbezeichnung | RDA-Eigenschaft --> RDA-E-'P040'
          'P651', // Sonstige zur Person gehörende Kennzeichnung | RDA-Eigenschaft --> RDA-E-'P045'
          'P673', // Geschlecht | RDA-Eigenschaft --> RDA-E-'P050'
          'P674', // Geburtsort | RDA-Eigenschaft --> RDA-E-'P055'
          'P675', // Sterbeort | RDA-Eigenschaft --> RDA-E-'P060'
          'P676', // Land, das mit einer Person in Verbindung steht | RDA-Eigenschaft --> RDA-E-'P065'
          'P677', // Wirkungsort | RDA-Eigenschaft --> RDA-E-'P070'
          'P678', // Adresse einer Person | RDA-Eigenschaft --> RDA-E-'P075'
          'P679', // Mit Person in Beziehung stehende Körperschaft | RDA-Eigenschaft --> RDA-E-'P080'
          'P680', // Sprache einer Person | RDA-Eigenschaft --> RDA-E-'P085'
          'P681', // Betätigungsfeld einer Person | RDA-Eigenschaft --> RDA-E-'P090'
          'P650', // Beruf oder Tätigkeit | RDA-Eigenschaft --> RDA-E-'P095'
          'P682', // Biografische Angaben | RDA-Eigenschaft --> RDA-E-'P100'
          'P683', // Identifikator für eine Person | RDA-Eigenschaft --> RDA-E-'P105'
          'P694', // Mit Person in Beziehung stehende Person | RDA-Eigenschaft --> RDA-E-'P110'
          'P595', // Titel eines Werks | RDA-Eigenschaft --> RDA-E-W005
          'P470', // Bevorzugter Titel eines Werks | RDA-Eigenschaft --> RDA-E-W010
          'P443', // Abweichender Titel eines Werks | RDA-Eigenschaft --> RDA-E-W015
          'P535', // Kategorie eines Werks | RDA-Eigenschaft --> RDA-E-W020
          'P484', // Datum eines Werks | RDA-Eigenschaft --> RDA-E-W025
          'P605', // Ursprungsort eines Werks | RDA-Eigenschaft --> RDA-E-W030
          'P591', // Sonstige unterscheidende Eigenschaft eines Werks | RDA-Eigenschaft --> RDA-E-W035
          'P526', // Identifikator für ein Werk | RDA-Eigenschaft --> RDA-E-W040
          'P662', // Besetzung für musikalischen Inhalt einer repräsentativen Expression | RDA-Eigenschaft --> RDA-E-W045
          'P654', // Tonart einer repräsentativen Expression | RDA-Eigenschaft --> RDA-E-W050
          'P559', // Numerische Bezeichnung eines Musikwerks | RDA-Eigenschaft --> RDA-E-W055
          'P543', // Laufende Nummer eines Musikwerks | RDA-Eigenschaft --> RDA-E-W060
          'P560', // Opus-Nummer | RDA-Eigenschaft --> RDA-E-W065
          'P621', // Werkverzeichnisnummer | RDA-Eigenschaft --> RDA-E-W070
          'P409', // Art des Inhalts | RDA-Eigenschaft --> RDA-E-W075
          'P530', // Inhaltlicher Bezugsrahmen | RDA-Eigenschaft --> RDA-E-W080
          'P539', // Koordinaten von kartografischem Inhalt | RDA-Eigenschaft --> RDA-E-W085
          'P542', // Längengrad und Breitengrad | RDA-Eigenschaft --> RDA-E-W090
          'P584', // Reihen von Koordinatenpaaren | RDA-Eigenschaft --> RDA-E-W095
          'P585', // Rektaszension und Deklination | RDA-Eigenschaft --> RDA-E-W100
          'P454', // Äquinoktium | RDA-Eigenschaft --> RDA-E-W105
          'P495', // Epoche | RDA-Eigenschaft --> RDA-E-W110
          'P523', // Hochschulschriftenvermerk | RDA-Eigenschaft --> RDA-E-W115
          'P473', // Charakter einer Hochschulschrift | RDA-Eigenschaft --> RDA-E-W120
          'P516', // Grad-verleihende Institution | RDA-Eigenschaft --> RDA-E-W125
          'P533', // Jahr, in dem ein akademischer Grad verliehen wird | RDA-Eigenschaft --> RDA-E-W130
          'P513', // Geistige Schöpferin / Geistiger Schöpfer eines Werks | RDA-Eigenschaft (Akteur) --> RDA-E-W135
          'P590', // Sonstiger Akteur, der mit einem Werk in Verbindung steht | RDA-Eigenschaft --> RDA-E-W140
          'P555', // Mit Werk in Beziehung stehendes Werk | RDA-Eigenschaft --> RDA-E-W145
          //=== RDA-Elemente ===
          'P388', // Basisregeln
          'P386', // Spezialregeln
          'P410', // Spezifische Regeln
          'P661', // Beziehungskennzeichnung
          //=== RDA-Ressourcentypen ===
          'P637', // Elemente
          'P657', // Beziehungen Akteure
          'P658', // Beziehungen zu anderen Ressourcen
          //=== RDA-Vorgabewerte ===
          'P8', // zulässige Werte
          //== alle Seiten hinten ==
          'P642', // Beschreibung (nachgestellt)
          'P11', // Beispiel(e)
     ],
     infobox: [
          Property.Annotation
     ]
};

export const rdaRessourceTypeGroups: Groups = {
     header: [
          Property.definition,
          // Property['STA-Notation'],
          // Property.Annotation,
     ],
     table: [],
     body: [
          Property['General-of-Doc:-STA-property'],
          Property['Definition-Delimitation-of-Doc:-STA-property'],
          Property['Sources-of-information'],
          Property.description,
          Property.Elements,
          Property['Relationships-Actors-of-Doc:-RDA-property'],
          Property['Relationships-to-other-resources-of-Doc:-RDA-property'],
          Property['description-(at-the-end)'],
          Property['title-proper-of-RDA-property'],
          Property.Status,
          Property.Repetition,
          Property['embedded-(item)'],
          Property['Implementation-in-the-GND'],
     ],
     infobox: [
          Property.Annotation
     ]
};
