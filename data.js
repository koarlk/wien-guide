/**
 * Wiener Bezirks-Guide.
 * Pro Bezirk genau drei Einträge -> cheapEat, everyday, notSoEveryday.
 * coords: [Breitengrad, Längengrad] für den Karten-Marker.
 * Viele Einträge sind bewusst als Platzhalter angelegt (v.a. in den Außenbezirken) -
 * ersetze sie einfach durch deine eigenen Favoriten (coords nicht vergessen).
 */
const DISTRICTS = [
  {
    number: 1,
    name: "Innere Stadt",
    spots: {
      cheapEat: {
        name: "Bitzinger Würstelstand Albertina",
        category: "Würstelstand",
        rating: 4.4,
        priceLevel: "€",
        description: "Legendärer Würstelstand mitten in der Innenstadt, perfekt für schnellen Hunger.",
        address: "Augustinerstraße 1, 1010 Wien",
        coords: [48.2043, 16.3686],
        tags: ["Würstel", "Snack", "Late Night"]
      },
      everyday: {
        name: "Figlmüller",
        category: "Wirtshaus",
        rating: 4.6,
        priceLevel: "€€",
        description: "Wiener Institution seit 1905, berühmt für das tellergroße Schnitzel.",
        address: "Wollzeile 5, 1010 Wien",
        coords: [48.2085, 16.3763],
        tags: ["Schnitzel", "Klassiker", "Innenstadt"]
      },
      notSoEveryday: {
        name: "Edvard",
        category: "Fine Dining",
        rating: 4.6,
        priceLevel: "€€€€",
        description: "Elegantes Fine-Dining direkt am Ring, ideal für besondere Anlässe.",
        address: "Schottenring 24, 1010 Wien",
        coords: [48.2160, 16.3654],
        tags: ["Fine Dining", "Ring", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 2,
    name: "Leopoldstadt",
    spots: {
      cheapEat: {
        name: "Wurststand Praterstern",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Schneller Snack direkt beim Praterstern.",
        address: "Praterstern 1, 1020 Wien",
        coords: [48.2183, 16.3919],
        tags: ["Würstel", "Bahnhof", "Schnell"]
      },
      everyday: {
        name: "Schweizerhaus",
        category: "Wirtshaus / Biergarten",
        rating: 4.6,
        priceLevel: "€€",
        description: "Prater-Institution, weltberühmt für Stelze und kühles Bier im Gastgarten.",
        address: "Straße des 1. Mai 116, 1020 Wien",
        coords: [48.2166, 16.3966],
        tags: ["Stelze", "Biergarten", "Prater"]
      },
      notSoEveryday: {
        name: "Das Loft",
        category: "Fine Dining",
        rating: 4.5,
        priceLevel: "€€€€",
        description: "Panorama-Restaurant im Sofitel mit Blick über die Stadt.",
        address: "Praterstraße 1, 1020 Wien",
        coords: [48.2126, 16.3820],
        tags: ["Aussicht", "Fine Dining", "Skyline"]
      }
    }
  },
  {
    number: 3,
    name: "Landstraße",
    spots: {
      cheapEat: {
        name: "Rochusmarkt Imbissstand",
        category: "Imbiss",
        rating: 4.1,
        priceLevel: "€",
        description: "Frischer Snack direkt am Rochusmarkt.",
        address: "Landstraßer Hauptstraße 96, 1030 Wien",
        coords: [48.2053, 16.3924],
        tags: ["Markt", "Snack", "Schnell"]
      },
      everyday: {
        name: "Salm Bräu",
        category: "Brauereigasthaus",
        rating: 4.4,
        priceLevel: "€€",
        description: "Hausgebrautes Bier und deftige Wiener Küche unweit des Belvedere.",
        address: "Rennweg 8, 1030 Wien",
        coords: [48.1970, 16.3796],
        tags: ["Bier", "Hausmannskost", "Belvedere"]
      },
      notSoEveryday: {
        name: "Steirereck im Stadtpark",
        category: "Fine Dining",
        rating: 4.9,
        priceLevel: "€€€€",
        description: "Eines der besten Restaurants Österreichs, für den ganz besonderen Anlass.",
        address: "Am Heumarkt 2A, 1030 Wien",
        coords: [48.2046, 16.3806],
        tags: ["Fine Dining", "Haubenküche", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 4,
    name: "Wieden",
    spots: {
      cheapEat: {
        name: "Naschmarkt Imbissstand",
        category: "Imbiss",
        rating: 4.3,
        priceLevel: "€",
        description: "Streetfood-Vielfalt am berühmten Naschmarkt.",
        address: "Naschmarkt, 1040 Wien",
        coords: [48.1986, 16.3634],
        tags: ["Markt", "Streetfood", "Schnell"]
      },
      everyday: {
        name: "Gasthaus Ubl",
        category: "Beisl",
        rating: 4.5,
        priceLevel: "€€",
        description: "Traditionelles Wiener Beisl mit klassischer Hausmannskost.",
        address: "Präuscherngasse 4, 1040 Wien",
        coords: [48.1963, 16.3652],
        tags: ["Beisl", "Traditionell", "Hausmannskost"]
      },
      notSoEveryday: {
        name: "Restaurant Quirin",
        category: "Fine Dining",
        rating: 4.5,
        priceLevel: "€€€€",
        description: "Feine österreichische Küche in stilvollem Ambiente.",
        address: "Wiedner Hauptstraße 15, 1040 Wien",
        coords: [48.1965, 16.3690],
        tags: ["Fine Dining", "Österreichisch", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 5,
    name: "Margareten",
    spots: {
      cheapEat: {
        name: "Würstelstand Margaretengürtel",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Klassischer Würstelstand für den schnellen Hunger zwischendurch.",
        address: "Margaretengürtel 100, 1050 Wien",
        coords: [48.1858, 16.3475],
        tags: ["Würstel", "Schnell", "Gürtel"]
      },
      everyday: {
        name: "Silberwirt",
        category: "Modernes Beisl",
        rating: 4.4,
        priceLevel: "€€",
        description: "Beliebtes, modernisiertes Beisl mit klassischer Wiener Küche.",
        address: "Schlossgasse 21, 1050 Wien",
        coords: [48.1907, 16.3585],
        tags: ["Beisl", "Modern", "Wiener Küche"]
      },
      notSoEveryday: {
        name: "Restaurant Margarete",
        category: "Fine Dining",
        rating: 4.4,
        priceLevel: "€€€€",
        description: "Modernes Fine-Dining-Konzept im 5. Bezirk.",
        address: "Reinprechtsdorfer Straße 1, 1050 Wien",
        coords: [48.1900, 16.3550],
        tags: ["Fine Dining", "Modern", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 6,
    name: "Mariahilf",
    spots: {
      cheapEat: {
        name: "Leberkäse Pepi",
        category: "Imbiss",
        rating: 4.2,
        priceLevel: "€",
        description: "Kult-Leberkässemmel zum Mitnehmen.",
        address: "Mariahilfer Straße 100, 1060 Wien",
        coords: [48.1972, 16.3495],
        tags: ["Leberkäse", "Snack", "Mariahilfer Straße"]
      },
      everyday: {
        name: "Gasthaus Quell",
        category: "Beisl",
        rating: 4.4,
        priceLevel: "€€",
        description: "Traditionsbeisl mit großem Schanigarten.",
        address: "Reindorfgasse 19, 1060 Wien",
        coords: [48.1950, 16.3380],
        tags: ["Beisl", "Schanigarten", "Traditionell"]
      },
      notSoEveryday: {
        name: "Restaurant Sechser",
        category: "Fine Dining",
        rating: 4.5,
        priceLevel: "€€€€",
        description: "Kreative Fine-Dining-Küche mitten in Mariahilf.",
        address: "Gumpendorfer Straße 50, 1060 Wien",
        coords: [48.1971, 16.3560],
        tags: ["Fine Dining", "Kreativ", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 7,
    name: "Neubau",
    spots: {
      cheapEat: {
        name: "Falafel Stand Neubaugasse",
        category: "Imbiss",
        rating: 4.3,
        priceLevel: "€",
        description: "Frischer Falafel-Snack im hippen 7. Bezirk.",
        address: "Neubaugasse 20, 1070 Wien",
        coords: [48.1996, 16.3520],
        tags: ["Falafel", "Streetfood", "Schnell"]
      },
      everyday: {
        name: "Schnitzelwirt",
        category: "Beisl",
        rating: 4.4,
        priceLevel: "€€",
        description: "Kultiges Beisl mit riesigen, günstigen Schnitzeln.",
        address: "Neubaugasse 52, 1070 Wien",
        coords: [48.2015, 16.3496],
        tags: ["Schnitzel", "Kult", "Günstig"]
      },
      notSoEveryday: {
        name: "Glasswing",
        category: "Fine Dining",
        rating: 4.6,
        priceLevel: "€€€€",
        description: "Modernes Fine-Dining mit kreativer Küche im 7. Bezirk.",
        address: "Zieglergasse 6, 1070 Wien",
        coords: [48.1987, 16.3480],
        tags: ["Fine Dining", "Kreativ", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 8,
    name: "Josefstadt",
    spots: {
      cheapEat: {
        name: "Kebap Josefstädter Straße",
        category: "Imbiss",
        rating: 4.1,
        priceLevel: "€",
        description: "Günstiger Kebap-Snack an der Josefstädter Straße.",
        address: "Josefstädter Straße 30, 1080 Wien",
        coords: [48.2107, 16.3480],
        tags: ["Kebap", "Schnell", "Snack"]
      },
      everyday: {
        name: "Gasthaus Wickerl",
        category: "Beisl",
        rating: 4.3,
        priceLevel: "€€",
        description: "Klassisches Josefstädter Beisl mit Schanigarten.",
        address: "Josefstädter Straße 45, 1080 Wien",
        coords: [48.2110, 16.3450],
        tags: ["Beisl", "Schanigarten", "Klassisch"]
      },
      notSoEveryday: {
        name: "Kim Kocht",
        category: "Fine Dining",
        rating: 4.6,
        priceLevel: "€€€€",
        description: "Koreanisch-österreichische Fine-Dining-Küche im Theaterviertel.",
        address: "Lange Gasse 4, 1080 Wien",
        coords: [48.2085, 16.3510],
        tags: ["Fine Dining", "Fusion", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 9,
    name: "Alsergrund",
    spots: {
      cheapEat: {
        name: "Wurststand Nußdorfer Straße",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Unkomplizierter Snack an der Nußdorfer Straße.",
        address: "Nußdorfer Straße 30, 1090 Wien",
        coords: [48.2255, 16.3550],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Servitenwirt",
        category: "Beisl",
        rating: 4.4,
        priceLevel: "€€",
        description: "Beliebtes Beisl mit Schanigarten am Servitenplatz.",
        address: "Servitengasse 7, 1090 Wien",
        coords: [48.2225, 16.3608],
        tags: ["Beisl", "Schanigarten", "Servitenviertel"]
      },
      notSoEveryday: {
        name: "Restaurant Nona",
        category: "Fine Dining",
        rating: 4.5,
        priceLevel: "€€€€",
        description: "Elegantes Fine-Dining nahe dem AKH.",
        address: "Währinger Straße 20, 1090 Wien",
        coords: [48.2200, 16.3560],
        tags: ["Fine Dining", "Elegant", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 10,
    name: "Favoriten",
    spots: {
      cheapEat: {
        name: "Wurststand Reumannplatz",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Klassischer Würstelstand direkt am Reumannplatz.",
        address: "Reumannplatz 1, 1100 Wien",
        coords: [48.1747, 16.3771],
        tags: ["Würstel", "Schnell", "Reumannplatz"]
      },
      everyday: {
        name: "Gasthaus Favoriten",
        category: "Beisl",
        rating: 4.2,
        priceLevel: "€€",
        description: "Bodenständige Wiener Küche mitten in Favoriten.",
        address: "Favoritenstraße 100, 1100 Wien",
        coords: [48.1800, 16.3760],
        tags: ["Beisl", "Hausmannskost", "Alltag"]
      },
      notSoEveryday: {
        name: "Restaurant Wienerberg",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€€",
        description: "Gehobene Küche mit Blick auf den Wienerberg.",
        address: "Laxenburger Straße 200, 1100 Wien",
        coords: [48.1580, 16.3660],
        tags: ["Fine Dining", "Aussicht", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 11,
    name: "Simmering",
    spots: {
      cheapEat: {
        name: "Wurststand Simmeringer Hauptstraße",
        category: "Würstelstand",
        rating: 3.9,
        priceLevel: "€",
        description: "Einfacher Snack an der Simmeringer Hauptstraße.",
        address: "Simmeringer Hauptstraße 50, 1110 Wien",
        coords: [48.1830, 16.4020],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Gasthaus Kaiserwiese",
        category: "Beisl",
        rating: 4.2,
        priceLevel: "€€",
        description: "Traditionelles Gasthaus mit gutbürgerlicher Küche.",
        address: "Kaiserebersdorfer Straße 30, 1110 Wien",
        coords: [48.1750, 16.4200],
        tags: ["Beisl", "Gutbürgerlich", "Alltag"]
      },
      notSoEveryday: {
        name: "Restaurant Gasometer",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€€",
        description: "Modernes Restaurant in den historischen Gasometern.",
        address: "Guglgasse 8, 1110 Wien",
        coords: [48.1850, 16.4200],
        tags: ["Fine Dining", "Gasometer", "Modern"]
      }
    }
  },
  {
    number: 12,
    name: "Meidling",
    spots: {
      cheapEat: {
        name: "Wurststand Meidlinger Hauptstraße",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Schneller Happen an der Meidlinger Hauptstraße.",
        address: "Meidlinger Hauptstraße 50, 1120 Wien",
        coords: [48.1770, 16.3330],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Gasthaus Meidling",
        category: "Beisl",
        rating: 4.2,
        priceLevel: "€€",
        description: "Gemütliches Beisl nahe Schönbrunn.",
        address: "Wilhelmstraße 20, 1120 Wien",
        coords: [48.1740, 16.3400],
        tags: ["Beisl", "Schönbrunn-nah", "Gemütlich"]
      },
      notSoEveryday: {
        name: "Restaurant Hetzendorf",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€€",
        description: "Feine Küche nahe Schloss Hetzendorf.",
        address: "Hetzendorfer Straße 10, 1120 Wien",
        coords: [48.1650, 16.3200],
        tags: ["Fine Dining", "Schloss", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 13,
    name: "Hietzing",
    spots: {
      cheapEat: {
        name: "Imbiss am Schönbrunner Schlosspark",
        category: "Imbiss",
        rating: 4.1,
        priceLevel: "€",
        description: "Schneller Snack nahe Schloss Schönbrunn.",
        address: "Hietzinger Hauptstraße 1, 1130 Wien",
        coords: [48.1870, 16.3010],
        tags: ["Snack", "Schönbrunn", "Schnell"]
      },
      everyday: {
        name: "Gasthaus Hietzinger Bräu",
        category: "Wirtshaus",
        rating: 4.3,
        priceLevel: "€€",
        description: "Traditionelles Wirtshaus im noblen Hietzing.",
        address: "Hietzinger Hauptstraße 20, 1130 Wien",
        coords: [48.1860, 16.2980],
        tags: ["Wirtshaus", "Traditionell", "Hietzing"]
      },
      notSoEveryday: {
        name: "Restaurant Hietzinger Stubn",
        category: "Fine Dining",
        rating: 4.4,
        priceLevel: "€€€€",
        description: "Elegante Küche im noblen 13. Bezirk nahe Schönbrunn.",
        address: "Maxingstraße 10, 1130 Wien",
        coords: [48.1830, 16.3000],
        tags: ["Fine Dining", "Elegant", "Schönbrunn-nah"]
      }
    }
  },
  {
    number: 14,
    name: "Penzing",
    spots: {
      cheapEat: {
        name: "Wurststand Hütteldorf",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Einfacher Snack nahe dem Wienerwald.",
        address: "Hüttelbergstraße 5, 1140 Wien",
        coords: [48.2010, 16.2550],
        tags: ["Würstel", "Wienerwald", "Schnell"]
      },
      everyday: {
        name: "Heuriger Wolf",
        category: "Heuriger",
        rating: 4.4,
        priceLevel: "€€",
        description: "Gemütlicher Heuriger am Rand des Wienerwaldes.",
        address: "Rathstraße 50, 1140 Wien",
        coords: [48.2050, 16.2600],
        tags: ["Heuriger", "Wienerwald", "Gemütlich"]
      },
      notSoEveryday: {
        name: "Restaurant Penzing",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€€",
        description: "Gehobene Küche am Rand des Wienerwaldes.",
        address: "Linzer Straße 300, 1140 Wien",
        coords: [48.1950, 16.2750],
        tags: ["Fine Dining", "Wienerwald", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 15,
    name: "Rudolfsheim-Fünfhaus",
    spots: {
      cheapEat: {
        name: "Kebap Fünfhaus",
        category: "Imbiss",
        rating: 4.0,
        priceLevel: "€",
        description: "Günstiger Kebap-Imbiss an der Mariahilfer Straße West.",
        address: "Mariahilfer Straße 200, 1150 Wien",
        coords: [48.1930, 16.3280],
        tags: ["Kebap", "Schnell", "Snack"]
      },
      everyday: {
        name: "Gasthaus Sechshauser",
        category: "Beisl",
        rating: 4.1,
        priceLevel: "€€",
        description: "Bodenständiges Beisl im 15. Bezirk.",
        address: "Sechshauser Straße 50, 1150 Wien",
        coords: [48.1900, 16.3300],
        tags: ["Beisl", "Hausmannskost", "Alltag"]
      },
      notSoEveryday: {
        name: "Restaurant Fünfhaus",
        category: "Fine Dining",
        rating: 4.2,
        priceLevel: "€€€",
        description: "Kreative Küche im aufstrebenden 15. Bezirk.",
        address: "Storchengasse 10, 1150 Wien",
        coords: [48.1870, 16.3250],
        tags: ["Fine Dining", "Kreativ", "Aufstrebend"]
      }
    }
  },
  {
    number: 16,
    name: "Ottakring",
    spots: {
      cheapEat: {
        name: "Wurststand Ottakringer Brauerei",
        category: "Würstelstand",
        rating: 4.1,
        priceLevel: "€",
        description: "Snack direkt bei der Ottakringer Brauerei.",
        address: "Ottakringer Straße 91, 1160 Wien",
        coords: [48.2115, 16.3220],
        tags: ["Würstel", "Brauerei", "Schnell"]
      },
      everyday: {
        name: "Gasthaus Wilder Berg",
        category: "Beisl",
        rating: 4.2,
        priceLevel: "€€",
        description: "Urwiener Beisl mit Blick zum Wilhelminenberg.",
        address: "Thaliastraße 100, 1160 Wien",
        coords: [48.2100, 16.3100],
        tags: ["Beisl", "Aussicht", "Alltag"]
      },
      notSoEveryday: {
        name: "Restaurant Yppenplatz",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€",
        description: "Moderne Küche direkt am trendigen Yppenplatz.",
        address: "Yppenplatz 4, 1160 Wien",
        coords: [48.2110, 16.3380],
        tags: ["Fine Dining", "Yppenplatz", "Trendig"]
      }
    }
  },
  {
    number: 17,
    name: "Hernals",
    spots: {
      cheapEat: {
        name: "Wurststand Hernalser Hauptstraße",
        category: "Würstelstand",
        rating: 3.9,
        priceLevel: "€",
        description: "Schneller Snack an der Hernalser Hauptstraße.",
        address: "Hernalser Hauptstraße 100, 1170 Wien",
        coords: [48.2180, 16.3200],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Gasthaus Neuwaldegg",
        category: "Wirtshaus",
        rating: 4.3,
        priceLevel: "€€",
        description: "Gemütliches Wirtshaus am Rand des Wienerwaldes.",
        address: "Neuwaldegger Straße 40, 1170 Wien",
        coords: [48.2280, 16.2900],
        tags: ["Wirtshaus", "Wienerwald", "Gemütlich"]
      },
      notSoEveryday: {
        name: "Restaurant Calvarienberg",
        category: "Fine Dining",
        rating: 4.2,
        priceLevel: "€€€",
        description: "Feine Küche mit Blick über Hernals.",
        address: "Kalvarienberggasse 20, 1170 Wien",
        coords: [48.2170, 16.3320],
        tags: ["Fine Dining", "Aussicht", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 18,
    name: "Währing",
    spots: {
      cheapEat: {
        name: "Wurststand Gersthof",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Unkomplizierter Snack in Gersthof.",
        address: "Gersthofer Straße 50, 1180 Wien",
        coords: [48.2330, 16.3200],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Gasthaus Kutschker",
        category: "Beisl",
        rating: 4.2,
        priceLevel: "€€",
        description: "Traditionelles Beisl an der Kutschkergasse.",
        address: "Kutschkergasse 30, 1180 Wien",
        coords: [48.2270, 16.3380],
        tags: ["Beisl", "Traditionell", "Alltag"]
      },
      notSoEveryday: {
        name: "Restaurant Türkenschanze",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€",
        description: "Elegantes Restaurant nahe dem Türkenschanzpark.",
        address: "Gymnasiumstraße 40, 1180 Wien",
        coords: [48.2320, 16.3450],
        tags: ["Fine Dining", "Park", "Elegant"]
      }
    }
  },
  {
    number: 19,
    name: "Döbling",
    spots: {
      cheapEat: {
        name: "Wurststand Heiligenstadt",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Schneller Snack bei der Heiligenstädter Straße.",
        address: "Heiligenstädter Straße 100, 1190 Wien",
        coords: [48.2450, 16.3650],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Steman",
        category: "Heuriger",
        rating: 4.6,
        priceLevel: "€€",
        description: "Berühmter Schnitzel-Heuriger, eine Wiener Institution.",
        address: "Döblinger Hauptstraße 76, 1190 Wien",
        coords: [48.2380, 16.3600],
        tags: ["Schnitzel", "Heuriger", "Institution"]
      },
      notSoEveryday: {
        name: "Restaurant Cobenzl",
        category: "Fine Dining",
        rating: 4.4,
        priceLevel: "€€€€",
        description: "Aussichtsreiches Restaurant am Cobenzl mit Blick über Wien.",
        address: "Am Cobenzl 94, 1190 Wien",
        coords: [48.2660, 16.3220],
        tags: ["Fine Dining", "Aussicht", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 20,
    name: "Brigittenau",
    spots: {
      cheapEat: {
        name: "Wurststand Wallensteinplatz",
        category: "Würstelstand",
        rating: 3.9,
        priceLevel: "€",
        description: "Günstiger Snack am Wallensteinplatz.",
        address: "Wallensteinplatz 1, 1200 Wien",
        coords: [48.2300, 16.3720],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Gasthaus Brigittenau",
        category: "Beisl",
        rating: 4.1,
        priceLevel: "€€",
        description: "Einfaches, ehrliches Beisl im 20. Bezirk.",
        address: "Wallensteinstraße 50, 1200 Wien",
        coords: [48.2320, 16.3680],
        tags: ["Beisl", "Ehrlich", "Alltag"]
      },
      notSoEveryday: {
        name: "Mraz & Sohn",
        category: "Fine Dining",
        rating: 4.7,
        priceLevel: "€€€€",
        description: "Ausgezeichnete moderne österreichische Küche, ideal für besondere Anlässe.",
        address: "Wallensteinstraße 59, 1200 Wien",
        coords: [48.2330, 16.3660],
        tags: ["Fine Dining", "Modern", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 21,
    name: "Floridsdorf",
    spots: {
      cheapEat: {
        name: "Wurststand Floridsdorfer Markt",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Frischer Snack am Floridsdorfer Markt.",
        address: "Am Spitz 1, 1210 Wien",
        coords: [48.2570, 16.3980],
        tags: ["Würstel", "Markt", "Schnell"]
      },
      everyday: {
        name: "Heuriger Stammersdorf",
        category: "Heuriger",
        rating: 4.3,
        priceLevel: "€€",
        description: "Klassischer Heuriger im Weinbaugebiet Stammersdorf.",
        address: "Stammersdorfer Straße 80, 1210 Wien",
        coords: [48.2870, 16.4070],
        tags: ["Heuriger", "Weinbau", "Gemütlich"]
      },
      notSoEveryday: {
        name: "Restaurant Donaufeld",
        category: "Fine Dining",
        rating: 4.2,
        priceLevel: "€€€",
        description: "Gehobene Küche im aufstrebenden Floridsdorf.",
        address: "Prager Straße 50, 1210 Wien",
        coords: [48.2620, 16.3950],
        tags: ["Fine Dining", "Aufstrebend", "Besonderer Anlass"]
      }
    }
  },
  {
    number: 22,
    name: "Donaustadt",
    spots: {
      cheapEat: {
        name: "Wurststand Kagran",
        category: "Würstelstand",
        rating: 4.0,
        priceLevel: "€",
        description: "Schneller Snack in Kagran.",
        address: "Donaustadtstraße 1, 1220 Wien",
        coords: [48.2400, 16.4340],
        tags: ["Würstel", "Schnell", "Kagran"]
      },
      everyday: {
        name: "Gasthaus Alte Donau",
        category: "Beisl",
        rating: 4.3,
        priceLevel: "€€",
        description: "Gemütliches Lokal direkt an der Alten Donau.",
        address: "Wagramer Straße 100, 1220 Wien",
        coords: [48.2440, 16.4300],
        tags: ["Alte Donau", "Gemütlich", "Terrasse"]
      },
      notSoEveryday: {
        name: "Restaurant Donauturm",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€€",
        description: "Drehrestaurant im Donauturm mit Panoramablick über Wien.",
        address: "Donauturmstraße 4, 1220 Wien",
        coords: [48.2400, 16.4100],
        tags: ["Fine Dining", "Aussicht", "Donauturm"]
      }
    }
  },
  {
    number: 23,
    name: "Liesing",
    spots: {
      cheapEat: {
        name: "Wurststand Liesing",
        category: "Würstelstand",
        rating: 3.9,
        priceLevel: "€",
        description: "Einfacher Snack im südlichsten Bezirk Wiens.",
        address: "Breitenfurter Straße 300, 1230 Wien",
        coords: [48.1470, 16.2850],
        tags: ["Würstel", "Schnell", "Alltag"]
      },
      everyday: {
        name: "Gasthaus Rodaun",
        category: "Wirtshaus",
        rating: 4.2,
        priceLevel: "€€",
        description: "Traditionelles Wirtshaus im dörflichen Rodaun.",
        address: "Ketzergasse 200, 1230 Wien",
        coords: [48.1360, 16.2620],
        tags: ["Wirtshaus", "Rodaun", "Traditionell"]
      },
      notSoEveryday: {
        name: "Restaurant Kalksburg",
        category: "Fine Dining",
        rating: 4.3,
        priceLevel: "€€€",
        description: "Feine Küche am Rand des Wienerwaldes in Kalksburg.",
        address: "Willergasse 60, 1230 Wien",
        coords: [48.1400, 16.2500],
        tags: ["Fine Dining", "Wienerwald", "Besonderer Anlass"]
      }
    }
  }
];

const TIERS = [
  { key: "cheapEat", label: "Cheap Eat", emoji: "💸" },
  { key: "everyday", label: "Every Day", emoji: "🍴" },
  { key: "notSoEveryday", label: "Not So Everyday", emoji: "✨" }
];
