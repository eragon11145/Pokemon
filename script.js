

var x, y, pokemon, pokemoN, pokemoN2, hp, atk, df, spa, sdf, spd, p, i,gen, poke,poke2,hp1,atk1,df1,spa1,sdf1,spd1,gen2,t,guesses,o;
x=(Math.random())
console.log(x)
y=Math.random()
guesses=0
x=Math.floor(x * 1071);
y=Math.floor(y * 1071);
pokemon=" Bulbasaur, Ivysaur, Venusaur, Mega venusaur, Charmander, Charmeleon, Charizard, Mega charizard x, Mega charizard y, Squirtle, Wartortle, Blastoise, Mega blastoise, Caterpie, Metapod, Butterfree, Weedle, Kakuna, Beedrill, Mega beedrill, Pidgey, Pidgeotto, Pidgeot, Mega Pidgeot, Rattata, Raticate, Spearow, Fearow, Ekans, Arbok, Pikachu, Raichu, Sandshrew, Sandslash, Nidoran, Nidorina, Nidoqueen, Nidoran, Nidorino, Nidoking, Clefairy, Clefable, Vulpix, Ninetales, Jigglypuff, Wigglytuff, Zubat, Golbat, Oddish, Gloom, Vileplume, Paras, Parasect, Venonat, Venomoth, Diglett, Dugtrio, Meowth, Persian, Psyduck, Golduck, Mankey, Primeape, Growlithe, Arcanine, Poliwag, Poliwhirl, Poliwrath, Abra, Kadabra, Alakazam, Mega alakazam, Machop, Machoke, Machamp, Bellsprout, Weepinbell, Victreebel, Tentacool, Tentacruel, Geodude, Graveler, Golem, Ponyta, Rapidash, Slowpoke, Slowbro, Mega slowbro, Magnemite, Magneton, Farfetch’d, Doduo, Dodrio, Seel, Dewgong, Grimer, Muk, Shellder, Cloyster, Gastly, Haunter, Gengar, Mega gengar, Onix, Drowzee, Hypno, Krabby, Kingler, Voltorb, Electrode, Exeggcute, Exeggutor, Cubone, Marowak, Hitmonlee, Hitmonchan, Lickitung, Koffing, Weezing, Rhyhorn, Rhydon, Chansey, Tangela, Kangaskhan, Mega kangaskhan, Horsea, Seadra, Goldeen, Seaking, Staryu, Starmie, Mr. Mime, Scyther, Jynx, Electabuzz, Magmar, Pinsir, Mega pinsir, Tauros, Magikarp, Gyarados, Mega gyarados, Lapras, Ditto, Eevee, Vaporeon, Jolteon, Flareon, Porygon, Omanyte, Omastar, Kabuto, Kabutops, Aerodactyl, Mega aerodactyl, Snorlax, Articuno, Zapdos, Moltres, Dratini, Dragonair, Dragonite, Mewtwo, Mega mewtwo x, Mega mewtwo y, Mew, Chikorita, Bayleef, Meganium, Cyndaquil, Quilava, Typhlosion, Totodile, Croconaw, Feraligatr, Sentret, Furret, Hoothoot, Noctowl, Ledyba, Ledian, Spinarak, Ariados, Crobat, Chinchou, Lanturn, Pichu, Cleffa, Igglybuff, Togepi, Togetic, Natu, Xatu, Mareep, Flaaffy, Ampharos, Bellossom, Marill, Azumarill, Sudowoodo, Politoed, Hoppip, Skiploom, Jumpluff, Aipom, Sunkern, Sunflora, Yanma, Wooper, Quagsire, Espeon, Umbreon, Murkrow, Slowking, Misdreavus, Unown, Wobbuffet, Girafarig, Pineco, Forretress, Dunsparce, Gligar, Steelix, Snubbull, Granbull, Qwilfish, Scizor, Shuckle, Heracross, Sneasel, Teddiursa, Ursaring, Slugma, Magcargo, Swinub, Piloswine, Corsola, Remoraid, Octillery, Delibird, Mantine, Skarmory, Houndour, Houndoom, Kingdra, Phanpy, Donphan, Porygon2, Stantler, Smeargle, Tyrogue, Hitmontop, Smoochum, Elekid, Magby, Miltank, Blissey, Raikou, Entei, Suicune, Larvitar, Pupitar, Tyranitar, Lugia, Ho-oh, Celebi, Treecko, Grovyle, Sceptile, Torchic, Combusken, Blaziken, Mudkip, Marshtomp, Swampert, Poochyena, Mightyena, Zigzagoon, Linoone, Wurmple, Silcoon, Beautifly, Cascoon, Dustox, Lotad, Lombre, Ludicolo, Seedot, Nuzleaf, Shiftry, Taillow, Swellow, Wingull, Pelipper, Ralts, Kirlia, Gardevoir, Surskit, Masquerain, Shroomish, Breloom, Slakoth, Vigoroth, Slaking, Nincada, Ninjask, Shedinja, Whismur, Loudred, Exploud, Makuhita, Hariyama, Azurill, Nosepass, Skitty, Delcatty, Sableye, Mawile, Aron, Lairon, Aggron, Meditite, Medicham, Electrike, Manectric, Plusle, Minun, Volbeat, Illumise, Roselia, Gulpin, Swalot, Carvanha, Sharpedo, Wailmer, Wailord, Numel, Camerupt, Torkoal, Spoink, Grumpig, Spinda, Trapinch, Vibrava, Flygon, Cacnea, Cacturne, Swablu, Altaria, Zangoose, Seviper, Lunatone, Solrock, Barboach, Whiscash, Corphish, Crawdaunt, Baltoy, Claydol, Lileep, Cradily, Anorith, Armaldo, Feebas, Milotic, Castform, Kecleon, Shuppet, Banette, Duskull, Dusclops, Tropius, Chimecho, Absol, Wynaut, Snorunt, Glalie, Spheal, Sealeo, Walrein, Clamperl, Huntail, Gorebyss, Relicanth, Luvdisc, Bagon, Shelgon, Salamence, Beldum, Metang, Metagross, Regirock, Regice, Registeel, Latias, Latios, Kyogre, Groudon, Rayquaza, Jirachi, Deoxys, Turtwig, Grotle, Torterra, Chimchar, Monferno, Infernape, Piplup, Prinplup, Empoleon, Starly, Staravia, Staraptor, Bidoof, Bibarel, Kricketot, Kricketune, Shinx, Luxio, Luxray, Budew, Roserade, Cranidos, Rampardos, Shieldon, Bastiodon, Burmy, Wormadam, Mothim, Combee, Vespiquen, Pachirisu, Buizel, Floatzel, Cherubi, Cherrim, Shellos, Gastrodon, Ambipom, Drifloon, Drifblim, Buneary, Lopunny, Mismagius, Honchkrow, Glameow, Purugly, Chingling, Stunky, Skuntank, Bronzor, Bronzong, Bonsly, Mime Jr., Happiny, Chatot, Spiritomb, Gible, Gabite, Garchomp, Munchlax, Riolu, Lucario, Hippopotas, Hippowdon, Skorupi, Drapion, Croagunk, Toxicroak, Carnivine, Finneon, Lumineon, Mantyke, Snover, Abomasnow, Weavile, Magnezone, Lickilicky, Rhyperior, Tangrowth, Electivire, Magmortar, Togekiss, Yanmega, Leafeon, Glaceon, Gliscor, Mamoswine, Porygon-z, Gallade, Probopass, Dusknoir, Froslass, Rotom, Uxie, Mesprit, Azelf, Dialga, Palkia, Heatran, Regigigas, Giratina, Cresselia, Phione, Manaphy, Darkrai, Shaymin, Arceus, Victini, Snivy, Servine, Serperior, Tepig, Pignite, Emboar, Oshawott, Dewott, Samurott, Patrat, Watchog, Lillipup, Herdier, Stoutland, Purrloin, Liepard, Pansage, Simisage, Pansear, Simisear, Panpour, Simipour, Munna, Musharna, Pidove, Tranquill, Unfezant, Blitzle, Zebstrika, Roggenrola, Boldore, Gigalith, Woobat, Swoobat, Drilbur, Excadrill, Audino, Timburr, Gurdurr, Conkeldurr, Tympole, Palpitoad, Seismitoad, Throh, Sawk, Sewaddle, Swadloon, Leavanny, Venipede, Whirlipede, Scolipede, Cottonee, Whimsicott, Petilil, Lilligant, Basculin, Sandile, Krokorok, Krookodile, Darumaka, Darmanitan, Maractus, Dwebble, Crustle, Scraggy, Scrafty, Sigilyph, Yamask, Cofagrigus, Tirtouga, Carracosta, Archen, Archeops, Trubbish, Garbodor, Zorua, Zoroark, Minccino, Cinccino, Gothita, Gothorita, Gothitelle, Solosis, Duosion, Reuniclus, Ducklett, Swanna, Vanillite, Vanillish, Vanilluxe, Deerling, Sawsbuck, Emolga, Karrablast, Escavalier, Foongus, Amoonguss, Frillish, Jellicent, Alomomola, Joltik, Galvantula, Ferroseed, Ferrothorn, Klink, Klang, Klinklang, Tynamo, Eelektrik, Eelektross, Elgyem, Beheeyem, Litwick, Lampent, Chandelure, Axew, Fraxure, Haxorus, Cubchoo, Beartic, Cryogonal, Shelmet, Accelgor, Stunfisk, Mienfoo, Mienshao, Druddigon, Golett, Golurk, Pawniard, Bisharp, Bouffalant, Rufflet, Braviary, Vullaby, Mandibuzz, Heatmor, Durant, Deino, Zweilous, Hydreigon, Larvesta, Volcarona, Cobalion, Terrakion, Virizion, Tornadus, Thundurus, Reshiram, Zekrom, Landorus, Kyurem, Keldeo, Meloetta, Genesect, Chespin, Quilladin, Chesnaught, Fennekin, Braixen, Delphox, Froakie, Frogadier, Greninja, Bunnelby, Diggersby, Fletchling, Fletchinder, Talonflame, Scatterbug, Spewpa, Vivillon, Litleo, Pyroar, Flabebe, Floette, Florges, Skiddo, Gogoat, Pancham, Pangoro, Furfrou, Espurr, Meowstic, Honedge, Doublade, Aegislash, Spritzee, Aromatisse, Swirlix, Slurpuff, Inkay, Malamar, Binacle, Barbaracle, Skrelp, Dragalge, Clauncher, Clawitzer, Helioptile, Heliolisk, Tyrunt, Tyrantrum, Amaura, Aurorus, Sylveon, Hawlucha, Dedenne, Carbink, Goomy, Sliggoo, Goodra, Klefki, Phantump, Trevenant, Pumpkaboo, Gourgeist, Bergmite, Avalugg, Noibat, Noivern, Xerneas, Yveltal, Zygarde, Diancie, Hoopa, Volcanion, Rowlet, Dartrix, Decidueye, Litten, Torracat, Incineroar, Popplio, Brionne, Primarina, Pikipek, Trumbeak, Toucannon, Yungoos, Gumshoos, Grubbin, Charjabug, Vikavolt, Crabrawler, Crabominable, Oricorio, Cutiefly, Ribombee, Rockruff, Lycanroc, Wishiwashi, Mareanie, Toxapex, Mudbray, Mudsdale, Dewpider, Araquanid, Fomantis, Lurantis, Morelull, Shiinotic, Salandit, Salazzle, Stufful, Bewear, Bounsweet, Steenee, Tsareena, Comfey, Oranguru, Passimian, Wimpod, Golisopod, Sandygast, Palossand, Pyukumuku, Type: Null, Silvally, Minior, Komala, Turtonator, Togedemaru, Mimikyu, Bruxish, Drampa, Dhelmise, Jangmo-o, Hakamo-o, Kommo-o, Alolan rattata, Alolan raticate, Alolan raichu, Alolan sandshrew, Alolan sandslash, Alolan vulpix, Alolan ninetales, Alolan diglett, Alolan dugtrio, Alolan meowth, Alolan persian, Alolan geodude, Alolan graveler, Alolan golem, Alolan grimer, Alolan muk, Alolan exeggutor, Alolan marowak, Tapu koko, Tapu lele, Tapu bulu, Tapu fini, Cosmog, Cosmoem, Solgaleo, Lunala, Nihilego, Buzzwole, Pheromosa, Xurkitree, Celesteela, Kartana, Guzzlord, Necrozma, Magearna, Marshadow, Poipole, Naganadel, Stakataka, Blacephalon, Zeraora, Meltan, Melmetal, Grookey, Thwackey, Rillaboom, Scorbunny, Raboot, Cinderace, Sobble, Drizzile, Inteleon, Skwovet, Greedent, Rookidee, Corvisquire, Corviknight, Blipbug, Dottler, Orbeetle, Nickit, Thievul, Gossifleur, Eldegoss, Wooloo, Dubwool, Chewtle, Drednaw, Yamper, Boltund, Rolycoly, Carkol, Coalossal, Applin, Flapple, Appletun, Silicobra, Sandaconda, Cramorant, Arrokuda, Barraskewda, Toxel, Toxtricity, Sizzlipede, Centiskorch, Clobbopus, Grapploct, Sinistea, Polteageist, Hatenna, Hattrem, Hatterene, Impidimp, Morgrem, Grimmsnarl, Galarian zigzagoon, Galarian linoone, Obstagoon, Galarian meowth, Perrserker, Galarian ponyta, Galarian rapidash, Galarian slowpoke, Galarian slowbro, Galarian slowking, Galarian corsola, Cursola, Galarian farfetch’d, Sirfetchd, Galarian weezing, Galarian mr. mime, Mr. rime, Galarian darumaka, Galarian darmanitan, Galarian yamask, Runerigus, Galarian stunfisk, Milcery, Alcremie, Falinks, Pincurchin, Snom, Frosmoth, Stonjourner, Eiscue, Indeedee, Morpeko, Cufant, Copperajah, Dracozolt, Arctozolt, Dracovish, Arctovish, Duraludon, Dreepy, Drakloak, Dragapult, Zacian, Zamazenta, Eternatus, Kubfu, Urshifu, Zarude, Regieleki, Regidrago, Glastrier, Spectrier, Calyrex, Galarian articuno, Galarian zapdos, Galarian moltres, Wyrdeer, Kleavor, Ursaluna, Basculegion, Basculegion, Sneasler, Overqwil, Enamorus, Enamorus, Sprigatito, Floragato, Meowscarada, Fuecoco, Crocolar, Skeledirge, Quaxley, Quaxwell, Quaquaval, Lechonk, Oinkologne, Oinkologne, Dudunsparce, Dudunsparce, Tarountula, Spidops, Nymble, Lokix, Rellor, Rabsca, Greavard, Houndstone, Flittle, Espathra, Farigarif, Wiglett, Wugtrio, Dondozo, Veluza, Finizen, Palafin, Palafin, Smoliv, Dolliv, Arboliva, Capsakid, Scovillian, Tadbulb, Bellibolt, Varoom, Revavroom, Orthworm, Tandemaus, Maushold, Maushold, Cetoddle, Cetitan, Frigibax, Arctibax, Baxcalibur, Tatsugiri, Tatsugiri, Tatsugiri, Cyclizar, Pawmi, Pawmo, Pawmot, Wattrel, Kilowattrel, Bombirdier, Squawkabilly, Squawkabilly, Squawkabilly, Squawkabilly, Flamigo, Klawf, Nacli, Naclstack, Garganacl, Glimmet, Glimmora, Shroodle, Grafaiai, Fidough, Dachsbun, Maschiff, Mabosstiff, Bramblin, Brambleghast, Gimmighoul, Gimmighoul, Gholdengo, Great tusk, Brute bonnet, Sandy shocks, Scream tail, Flutter mane, Slither wing, Roaring moon, Iron treads, Iron moth, Iron hands, Iron jugulis, Iron thorns, Iron bundle, Iron valiant, Ting-lu, Chien-pao, Wo-chien, Chi-yu, Koraidon, Miraidon, Tinkatink, Tinkatuff, Tinkaton, Charcadet, Armarouge, Ceruledge, Toedscool, Toedscruel, Kingambit, Clodsire, Annihilape, null";
pokemoN=pokemon.split(",");
pokemoN2=pokemon.split(",");
hp=[45,60,80,80,39,58,78,78,78,44,59,79,79,45,50,60,40,45,65,65,40,63,83,83,30,55,40,65,35,60,35,60,50,75,55,70,90,46,61,81,70,95,38,73,115,140,40,75,45,60,75,35,60,60,70,10,35,40,65,50,80,40,65,55,90,40,65,90,25,40,55,55,70,80,90,50,65,80,40,80,40,55,80,50,65,90,95,95,25,50,52,35,60,65,90,80,105,30,50,30,45,60,60,35,60,85,30,55,40,60,60,95,50,60,50,50,90,40,65,80,105,250,65,105,105,30,55,45,80,30,60,40,70,65,65,65,65,65,75,20,95,95,130,48,55,130,65,65,65,35,70,30,60,80,80,160,90,90,90,41,61,91,106,106,106,100,45,60,80,39,58,78,50,65,85,35,85,60,100,40,55,40,70,85,75,125,20,50,90,35,55,40,65,55,70,90,75,70,100,70,90,35,55,75,55,30,75,65,55,95,65,95,60,95,60,48,190,70,50,75,100,65,75,60,90,65,70,20,80,55,60,90,40,60,50,100,65,35,75,45,85,65,45,75,75,90,90,85,73,55,35,50,45,45,45,95,255,90,115,100,50,70,100,106,106,100,40,50,70,45,60,80,50,70,100,35,70,38,78,45,50,60,50,60,40,60,80,40,70,90,40,60,40,60,28,38,68,40,70,60,60,60,80,150,31,61,1,64,84,104,72,144,50,30,50,70,50,50,50,60,70,30,60,40,70,60,60,65,65,50,70,100,45,70,130,170,60,70,70,60,80,60,45,50,80,50,70,45,75,73,73,90,90,50,110,43,63,40,60,66,86,45,75,20,95,70,60,44,64,20,40,99,75,65,95,50,80,70,90,110,35,55,55,100,43,45,65,95,40,60,80,80,80,80,80,80,100,100,105,100,50,55,75,95,44,64,76,53,64,84,40,55,85,59,79,37,77,45,60,80,40,60,67,97,30,60,40,60,70,30,70,60,55,85,45,70,76,111,75,90,150,55,65,60,100,49,71,45,63,103,57,67,50,20,100,76,50,58,68,108,135,40,70,68,108,40,70,48,83,74,49,69,45,60,90,70,70,110,115,100,75,75,85,86,65,65,75,110,85,68,60,45,70,50,75,80,75,100,90,91,110,150,120,80,100,70,100,120,100,45,60,75,65,90,110,55,75,95,45,60,45,65,85,41,64,50,75,50,75,50,75,76,116,50,62,80,45,75,55,70,85,65,67,60,110,103,75,85,105,50,75,105,120,75,45,55,75,30,40,60,40,60,45,70,70,50,60,95,70,105,75,50,70,50,65,72,38,58,54,74,55,75,50,80,40,60,55,75,45,60,70,45,65,110,62,75,36,51,71,60,80,55,50,70,69,114,55,100,165,50,70,44,74,40,60,60,35,65,85,55,75,50,60,60,46,66,76,55,95,80,50,80,109,45,65,77,59,89,45,65,95,70,100,70,110,85,58,52,72,92,55,85,91,91,91,79,79,100,100,89,125,91,100,71,56,61,88,40,59,75,41,54,72,38,85,45,62,78,38,45,80,62,86,44,54,78,66,123,67,95,75,62,74,45,59,60,78,101,62,82,53,86,42,72,50,65,50,71,44,62,58,82,77,123,95,78,67,50,45,68,90,57,43,85,44,55,55,95,40,85,126,126,108,50,80,80,68,78,78,45,65,95,50,60,80,35,55,80,48,88,47,57,77,47,97,75,40,60,45,75,45,50,50,70,100,38,68,40,70,40,60,48,68,70,120,42,52,72,51,90,100,25,75,55,85,55,95,95,60,65,60,65,55,68,78,70,45,55,75,30,75,60,50,75,38,73,10,35,40,65,40,55,80,80,105,95,60,70,70,70,70,43,43,137,137,109,107,71,83,97,59,223,97,80,90,67,73,61,53,88,46,135,50,70,100,50,65,80,50,65,70,70,120,38,68,98,25,50,60,40,70,40,60,42,72,50,90,59,69,30,80,110,40,70,110,52,72,70,41,61,40,75,50,100,50,80,40,60,42,57,57,45,65,95,38,78,93,50,70,50,65,90,95,95,60,60,52,62,65,50,80,70,105,38,58,109,45,65,65,48,30,70,100,75,60,58,72,122,90,90,90,90,70,28,68,88,92,92,140,60,100,105,80,200,100,100,100,90,90,90,103,70,130,120,120,80,85,74,74,40,61,76,67,81,104,55,70,85,54,110,115,125,125,35,60,33,71,41,75,50,72,30,95,120,10,35,150,90,70,100,100,41,52,78,50,65,61,109,45,80,70,50,74,74,108,170,65,90,115,68,68,68,70,45,60,70,40,70,70,82,82,82,82,82,70,55,60,100,48,83,40,63,37,57,60,80,40,55,45,45,87,115,111,85,115,55,85,105,90,80,154,94,100,56,74,165,80,85,55,100,100,50,65,85,40,85,75,40,80,100,130,110];
atk=[49,62,82,100,52,64,84,130,104,48,63,83,103,30,20,45,35,25,90,150,45,60,80,80,56,81,60,90,60,95,55,90,75,100,47,62,92,57,72,102,45,70,41,76,45,70,45,80,50,65,80,70,95,55,65,55,100,45,70,52,82,80,105,70,110,50,65,95,20,35,50,50,80,100,130,75,90,105,40,70,80,95,120,85,100,65,75,75,35,60,90,85,110,45,70,80,105,65,95,35,50,65,65,45,48,73,105,130,30,50,40,95,50,80,120,105,55,65,90,85,130,5,55,95,125,40,65,67,92,45,75,45,110,50,83,95,125,155,100,10,125,155,85,48,55,65,65,130,60,40,60,80,115,105,135,110,85,90,100,64,84,134,110,190,150,100,49,62,82,52,64,84,65,80,105,46,76,30,50,20,35,60,90,90,38,58,40,25,30,20,40,50,75,40,55,75,80,20,50,100,75,35,45,55,70,30,75,65,45,85,65,65,85,75,60,72,33,80,65,90,70,75,85,80,120,95,130,10,125,95,80,130,40,50,50,100,55,65,105,55,40,80,60,90,95,60,120,80,95,20,35,95,30,63,75,80,10,85,115,75,64,84,134,90,130,100,45,65,85,60,85,120,70,85,110,55,90,30,70,45,35,70,35,50,30,50,70,40,70,100,55,85,30,50,25,35,65,30,60,40,130,60,80,160,45,90,90,51,71,91,60,120,20,45,45,65,75,85,70,90,110,40,60,45,75,50,40,73,47,60,43,73,90,120,70,90,60,100,85,25,45,60,100,70,100,85,115,40,70,115,100,55,95,48,78,80,120,40,70,41,81,95,125,15,60,70,90,75,115,40,70,68,50,130,23,50,80,40,60,80,64,104,84,90,30,75,95,135,55,75,135,100,50,75,80,90,100,150,150,100,150,68,89,109,58,78,104,51,66,86,55,75,120,45,85,25,85,65,85,120,30,70,125,165,42,52,29,59,94,30,80,45,65,105,35,60,48,83,100,50,80,66,76,60,125,55,82,30,63,93,24,89,80,25,5,65,92,70,90,130,85,70,110,72,112,50,90,61,106,100,49,69,20,62,92,120,70,85,140,100,123,95,50,76,110,60,95,130,80,125,55,100,80,50,75,105,125,120,120,90,160,100,70,80,100,90,100,120,100,45,60,75,63,93,123,55,75,100,55,85,60,80,110,50,88,53,98,53,98,53,98,25,55,55,77,115,60,100,75,105,135,45,57,85,135,60,80,105,140,50,65,95,100,125,53,63,103,45,55,100,27,67,35,60,92,72,82,117,90,140,86,65,105,75,90,58,30,50,78,108,112,140,50,95,65,105,50,95,30,45,55,30,40,65,44,87,50,65,95,60,100,75,75,135,55,85,40,60,75,47,77,50,94,55,80,100,55,85,115,55,75,30,40,55,87,117,147,70,130,50,40,70,66,85,125,120,74,124,85,125,110,83,123,55,65,97,109,65,85,105,85,60,90,129,90,115,115,120,150,125,130,72,77,120,61,78,107,45,59,69,56,63,95,36,56,50,73,81,35,22,52,50,68,38,45,65,65,100,82,124,80,48,48,80,110,50,52,72,48,80,54,92,52,105,60,75,53,73,38,55,89,121,59,77,65,92,58,50,50,75,100,80,70,110,66,85,69,117,30,70,131,131,100,100,110,110,55,75,107,65,85,115,54,69,74,75,85,120,70,110,62,82,70,82,132,70,45,55,65,115,20,53,63,100,125,40,70,55,105,35,45,44,64,75,125,30,40,120,52,60,120,35,125,55,75,60,95,95,60,115,78,98,90,105,60,131,55,75,110,56,71,85,75,100,41,67,55,100,35,60,80,95,120,80,105,105,80,115,85,130,75,29,29,137,113,53,139,137,89,101,181,101,107,95,125,73,73,131,127,112,65,143,65,85,125,71,86,116,40,60,85,55,95,47,67,87,20,35,45,28,58,40,50,40,80,64,115,45,90,40,60,80,40,110,85,57,107,85,63,123,38,98,65,115,68,118,45,65,30,40,90,45,60,120,30,70,90,65,110,85,100,65,100,65,55,95,95,135,90,65,85,90,140,55,95,81,40,60,100,101,25,65,125,80,65,95,80,130,100,100,90,90,95,60,80,120,130,130,85,90,130,120,100,100,145,65,80,85,125,85,105,135,140,112,92,130,115,115,115,61,80,110,45,55,75,65,85,120,45,100,90,100,100,41,79,46,102,50,50,61,101,35,60,90,55,100,100,102,45,70,160,35,53,69,62,108,31,64,70,119,85,50,75,75,68,113,75,95,145,50,50,50,95,50,75,115,40,70,103,96,96,96,96,115,100,55,60,100,35,55,65,95,55,80,78,120,65,115,30,30,60,131,127,81,65,55,135,139,112,70,140,80,134,80,130,110,130,90,80,135,85,45,55,75,50,60,125,40,70,135,75,115]
df=[49,63,83,123,43,58,78,111,78,65,80,100,120,35,55,50,30,50,40,40,40,55,75,80,35,60,30,65,44,69,40,55,85,110,52,67,87,40,57,77,48,73,40,75,20,45,35,70,55,70,85,55,80,50,60,25,50,35,60,48,78,35,60,45,80,40,65,95,15,30,45,65,50,70,80,35,50,65,35,65,100,115,130,55,70,65,110,180,70,95,55,45,70,55,80,50,75,100,180,30,45,60,80,160,45,70,90,115,50,70,80,85,95,110,53,79,75,95,120,95,120,5,115,80,100,70,95,60,65,55,85,65,80,35,57,57,100,120,95,55,79,109,80,48,50,60,60,60,70,100,125,90,105,65,85,65,100,85,90,45,65,95,90,100,70,100,65,80,100,43,58,78,64,80,100,34,64,30,50,30,50,40,70,80,38,58,15,28,15,65,85,45,70,40,55,85,95,50,80,115,75,40,50,70,55,30,55,45,45,85,60,110,42,80,60,48,58,65,90,140,70,105,200,50,75,85,100,230,75,55,50,75,40,120,40,80,95,35,75,45,70,140,30,50,95,60,120,90,62,35,35,95,15,37,37,105,10,75,85,115,50,70,110,130,90,100,35,45,65,40,60,70,50,70,90,35,70,41,61,35,55,50,55,70,30,50,70,50,40,60,30,60,30,100,25,35,65,32,62,60,80,60,80,100,90,45,45,23,43,63,30,60,40,135,45,65,75,85,100,140,180,55,75,40,60,40,50,75,75,45,53,83,20,40,35,45,40,70,140,35,65,60,45,50,80,40,60,60,90,60,60,65,85,43,73,65,85,55,105,77,97,50,100,20,79,70,70,35,65,90,130,83,80,60,48,50,80,50,70,90,85,105,105,130,55,60,100,80,80,100,130,200,100,150,90,80,90,140,90,100,50,64,85,105,44,52,71,53,68,88,30,50,70,40,60,41,51,34,49,79,35,65,40,60,118,168,45,85,50,42,102,70,35,55,45,70,48,68,66,34,44,44,84,60,52,42,64,50,47,67,86,116,95,45,5,45,108,45,65,95,40,40,70,78,118,90,110,40,65,72,56,76,50,50,75,65,115,95,130,125,67,67,95,86,130,110,125,80,70,65,145,135,70,77,130,105,70,120,100,106,110,120,120,80,100,90,100,120,100,55,75,95,45,55,65,45,60,85,39,69,45,65,90,37,50,48,63,48,63,48,63,45,85,50,62,80,32,63,85,105,130,43,55,40,60,86,55,85,95,40,55,75,85,75,70,90,80,59,99,89,60,85,50,75,65,35,45,80,45,55,67,85,125,70,115,80,85,145,103,133,45,65,62,82,40,60,40,60,50,70,95,40,50,75,50,63,50,65,85,50,70,60,45,105,45,70,50,70,80,50,60,91,131,70,95,115,40,70,80,55,75,55,60,90,60,70,90,40,80,50,85,40,84,50,60,90,50,80,70,100,95,50,75,75,105,66,112,50,70,90,55,65,129,90,72,70,70,100,120,90,90,90,77,95,65,95,122,40,58,72,40,52,67,38,77,43,55,71,40,60,50,58,72,39,47,68,48,62,62,78,60,54,76,100,150,140,60,72,66,86,53,88,67,115,60,90,62,88,33,52,77,119,50,72,65,75,57,150,35,53,70,91,48,76,70,122,85,184,35,80,95,95,121,150,60,120,55,75,75,40,50,90,54,69,74,30,50,75,30,60,45,95,90,57,77,70,40,60,40,65,20,62,152,70,100,52,92,35,90,55,80,40,60,50,80,38,48,98,90,80,90,40,140,80,110,130,95,95,100,65,135,63,80,70,85,100,65,90,125,35,70,50,90,120,40,75,30,60,35,60,100,115,130,50,75,85,110,85,75,115,115,31,131,107,89,47,139,37,71,103,131,53,101,115,80,67,73,211,53,75,65,143,50,70,90,40,60,75,40,55,65,55,95,35,55,105,20,80,110,28,58,60,90,55,100,50,90,50,60,50,90,120,80,80,80,75,125,55,40,60,35,70,45,65,60,90,45,65,45,65,95,30,45,65,41,61,101,55,100,55,70,65,95,80,100,50,55,95,120,65,75,45,55,85,145,99,40,75,100,95,35,60,135,110,55,58,49,69,90,90,100,100,115,30,50,75,115,115,95,60,100,105,50,50,130,60,80,85,90,90,72,95,105,65,65,60,95,70,110,54,63,70,59,78,100,45,65,80,40,75,70,80,80,45,92,40,78,60,85,60,100,30,60,70,25,50,115,73,40,72,97,45,60,90,40,65,41,91,63,90,145,45,70,70,45,65,45,66,92,60,60,60,65,20,40,70,35,60,85,51,51,51,51,74,115,75,100,130,42,90,35,65,70,115,60,90,30,70,70,25,95,131,99,97,99,55,79,71,120,60,108,86,110,114,90,130,80,100,80,115,100,45,55,77,40,100,80,35,65,120,60,80]
spa=[65,80,100,122,60,80,109,130,159,50,65,85,135,20,25,90,20,25,45,15,35,50,70,135,25,50,31,61,40,65,50,90,20,45,40,55,75,40,55,85,60,95,50,81,45,85,30,65,75,85,110,45,60,40,90,35,50,40,65,65,95,35,60,70,100,40,50,70,105,120,135,175,35,50,65,70,85,100,50,80,30,45,55,65,80,40,100,130,95,120,58,35,60,45,70,40,65,45,85,100,115,130,170,30,43,73,25,50,55,80,60,125,40,50,35,35,60,60,85,30,45,35,100,40,60,70,95,35,65,70,100,100,55,115,95,100,55,65,40,15,60,70,85,48,45,110,110,95,85,90,115,55,65,60,70,65,95,125,125,50,70,100,154,154,194,100,49,63,83,60,80,109,44,59,79,35,45,36,86,40,55,40,60,70,56,76,35,45,40,40,80,70,95,65,80,115,90,20,60,30,90,35,45,55,40,30,105,75,25,65,130,60,85,100,85,72,33,90,35,60,65,35,55,40,60,55,55,10,40,35,50,75,70,90,30,60,65,65,105,65,80,40,80,110,95,40,60,105,85,20,35,35,85,65,70,40,75,115,90,90,45,65,95,90,110,100,65,85,105,70,85,110,50,60,85,30,60,30,50,20,25,100,25,50,40,60,90,30,60,90,30,75,55,95,45,65,125,50,100,40,60,35,55,95,30,50,30,51,71,91,20,40,20,45,35,55,65,55,40,50,60,40,60,65,105,85,75,47,73,100,43,73,65,95,70,90,65,105,85,70,90,60,45,50,80,85,115,40,70,60,100,95,55,46,76,50,90,40,70,61,81,40,70,10,100,70,60,63,83,30,60,72,95,75,23,50,80,55,75,95,74,94,114,45,40,40,60,110,35,55,95,50,100,75,110,130,150,100,150,100,150,45,55,75,58,78,104,61,81,111,30,40,50,35,55,25,55,40,60,95,50,125,30,65,42,47,29,79,94,30,80,45,60,85,62,87,57,92,60,60,90,44,54,105,105,42,62,65,41,71,24,79,10,70,15,92,92,40,50,80,40,35,115,38,68,30,60,61,86,90,49,69,60,62,92,45,130,80,55,110,95,125,120,116,60,130,45,70,135,65,75,65,80,95,75,105,125,150,150,130,80,100,75,80,100,135,100,120,100,45,60,75,45,70,100,63,83,108,35,60,25,35,45,50,88,53,98,53,98,53,98,67,107,36,50,65,50,80,25,50,60,55,77,30,50,60,25,40,55,50,65,85,30,30,40,50,70,30,40,55,37,77,70,110,80,35,45,65,15,30,106,35,65,35,45,103,55,95,53,83,74,112,40,60,80,120,40,65,55,75,95,105,125,125,44,87,65,80,110,40,60,75,40,60,55,85,65,85,40,57,97,24,54,45,70,70,45,75,105,85,125,65,95,145,30,40,60,60,70,95,40,100,81,55,95,60,35,55,40,60,40,37,57,45,55,105,48,45,65,125,50,135,90,72,90,125,125,150,120,115,130,129,128,120,48,56,74,62,90,114,62,83,103,32,50,40,56,74,27,27,90,73,109,61,75,112,62,97,46,69,65,63,83,35,45,50,63,99,59,85,37,68,39,54,60,97,58,120,61,109,45,69,67,99,110,74,81,50,55,83,110,80,50,65,44,58,32,44,45,97,131,131,81,100,150,130,50,70,100,60,80,80,66,91,126,30,40,75,30,55,55,55,145,42,62,98,55,95,30,55,25,43,53,45,55,40,50,50,80,65,90,71,111,45,55,30,40,50,82,90,40,20,60,70,100,30,95,95,60,75,91,40,50,70,135,86,45,65,100,25,40,95,10,25,50,81,35,50,50,75,30,45,55,40,65,125,50,95,130,85,95,29,29,113,137,127,53,137,173,107,59,97,127,130,90,73,127,53,151,102,55,80,40,55,60,40,55,65,70,95,125,35,55,33,43,53,25,50,80,47,87,40,80,40,60,38,48,40,90,40,60,80,40,95,100,35,65,85,40,60,54,114,50,90,50,70,74,134,56,86,136,55,75,95,30,50,60,40,50,65,80,40,100,110,65,145,58,68,85,90,110,15,30,30,50,66,50,110,70,91,45,125,20,65,105,70,40,80,80,90,70,80,120,40,60,100,80,80,145,53,63,70,100,100,65,145,80,125,85,100,105,45,45,80,100,40,65,135,135,45,60,81,63,90,110,50,65,85,35,59,59,85,85,29,52,21,52,31,115,30,50,55,101,110,35,50,65,78,45,53,106,58,78,125,62,108,59,103,30,54,60,40,65,65,30,45,35,45,75,120,120,120,85,40,50,70,55,105,60,45,45,45,45,75,35,35,35,45,105,130,40,80,30,50,40,60,45,80,75,75,133,53,79,121,65,135,85,55,72,140,50,122,70,124,120,50,90,100,145,85,135,35,45,70,50,125,60,50,80,60,45,50];
sdf=[65,80,100,120,50,65,85,85,115,64,80,105,115,20,25,80,20,25,80,80,35,50,70,80,35,70,31,61,54,79,50,80,30,55,40,55,85,40,55,75,65,90,65,100,25,50,40,75,65,75,90,55,80,55,75,45,70,40,65,50,80,45,70,50,80,40,50,90,55,70,95,105,35,60,85,30,45,70,100,120,30,45,65,65,80,40,80,80,55,70,62,35,60,70,95,50,100,25,45,35,55,75,95,45,90,115,25,50,55,80,45,75,50,80,110,110,75,45,70,30,45,105,40,80,100,25,45,50,80,55,85,120,80,95,85,85,70,90,70,20,100,130,95,48,65,95,95,110,75,55,70,45,70,75,95,110,125,90,85,50,70,100,90,100,120,100,65,80,100,50,65,85,48,63,83,45,55,56,96,80,110,40,70,80,56,76,35,55,20,65,105,45,70,45,60,90,100,50,80,65,100,55,65,95,55,30,85,45,25,65,95,130,42,110,85,48,58,65,35,60,65,65,65,40,60,55,80,230,95,75,50,75,40,80,30,60,95,35,75,45,140,70,50,80,95,40,60,95,65,45,35,110,65,55,55,70,135,100,75,115,50,70,100,154,154,100,55,65,85,50,60,70,50,70,90,30,60,41,61,30,25,50,25,90,50,70,100,30,40,60,30,50,30,70,35,55,115,52,82,60,60,35,55,65,30,50,30,23,43,73,30,60,40,90,35,55,65,55,40,50,60,55,75,40,60,75,85,85,85,80,53,83,20,40,35,45,45,75,70,80,110,60,45,50,80,40,60,75,105,60,60,85,65,41,71,35,55,70,120,87,107,50,80,55,125,70,120,33,63,90,130,87,90,60,48,50,80,50,70,90,55,75,75,65,65,30,50,80,60,80,90,100,200,150,130,110,140,90,90,100,50,55,65,85,44,52,71,56,76,101,30,40,60,40,60,41,51,34,49,79,70,105,30,50,88,138,45,105,50,42,102,90,30,50,53,78,62,82,66,44,54,56,96,105,52,37,59,50,41,61,86,116,45,90,65,42,108,45,55,85,85,40,70,42,72,55,75,40,65,72,61,86,120,60,85,85,90,95,55,50,85,95,115,56,65,95,75,60,75,115,150,135,70,77,130,105,70,100,120,106,110,120,130,80,100,90,100,120,100,55,75,95,45,55,65,45,60,70,39,69,45,65,90,37,50,48,63,48,63,48,63,55,95,30,42,55,32,63,25,40,80,43,55,45,65,86,35,50,65,40,55,75,85,75,60,80,80,39,79,69,50,75,50,75,55,35,45,70,45,55,67,35,75,70,115,80,65,105,45,65,45,65,62,82,40,60,40,60,65,85,110,50,60,85,50,63,60,75,95,50,70,60,45,105,55,80,85,105,45,50,60,86,116,60,85,85,40,70,80,55,95,55,60,90,40,50,70,40,80,135,65,60,99,50,60,90,50,80,40,70,95,50,75,65,95,66,48,50,70,90,55,105,72,90,129,80,80,120,100,80,90,90,128,95,45,58,75,60,70,100,44,56,71,36,77,38,52,69,25,30,50,54,66,79,98,154,57,81,48,71,90,60,81,37,49,140,65,89,57,75,46,75,56,86,60,123,63,89,43,94,45,59,63,92,130,63,67,150,75,113,150,87,60,82,55,75,35,46,40,80,98,98,95,150,130,90,50,70,100,40,50,90,56,81,116,30,50,75,30,60,45,75,75,47,67,70,40,70,40,65,25,52,142,55,85,72,132,35,90,75,100,40,60,50,60,38,48,98,110,110,60,30,90,45,75,130,95,95,100,95,85,73,105,70,91,90,45,70,105,35,80,85,35,65,65,100,45,70,40,65,30,45,65,50,100,75,80,75,115,95,130,31,131,89,107,131,53,37,71,101,31,53,89,115,90,67,73,101,79,80,35,65,40,60,70,40,60,75,40,55,65,35,73,35,55,85,45,90,120,52,92,60,120,45,90,38,68,50,60,50,70,90,40,60,80,50,70,95,30,50,35,70,50,90,50,80,54,114,53,73,103,40,55,75,41,61,81,40,60,65,80,40,70,110,100,130,62,82,70,90,100,45,55,65,105,84,61,121,60,85,30,90,20,90,95,58,49,69,70,80,80,90,50,30,50,75,115,115,95,50,60,95,50,50,110,80,80,100,90,125,75,70,80,75,75,80,65,80,100,45,63,70,40,58, 75,45,60,75,45,80,90,75,75,40,86,25,55,58,100,55,97,30,60,70,25,70,65,65,40,62,87,51,78,109,40,65,35,83,45,67,55,45,75,75,40,55,45,65,86,95,95,95,65,25,40,60,40,60,85,51,51,51,51,64,55,35,65,90,60,81,35,72,55,80,51,70,35,70,70,45,91,53,99,85,115,135,105,101,70,110,68,80,84,60,60,80,65,135,120,100,115,64,82,105,40,80,100,100,120,85,100,90];
spd=[45,60,80,80,65,80,100,100,100,43,58,78,78,45,30,70,50,35,75,145,56,71,101,121,72,97,70,100,55,80,90,110,40,65,41,56,76,50,65,85,35,60,65,100,20,45,55,90,30,40,50,25,30,45,90,95,120,90,115,55,85,70,95,60,95,90,90,70,90,105,120,150,35,45,55,40,55,70,70,100,20,35,45,90,105,15,30,30,45,70,60,75,110,45,70,25,50,40,70,80,95,110,130,70,42,67,50,75,100,150,40,55,35,45,87,76,30,35,60,25,40,50,60,90,100,60,85,63,68,85,115,90,105,95,105,93,85,105,110,80,81,81,60,48,55,65,130,65,40,35,55,55,80,130,150,30,85,100,90,50,70,80,130,130,140,100,45,60,80,65,80,100,43,58,78,20,90,50,70,55,85,30,40,130,67,67,60,15,15,20,40,70,95,35,45,55,50,40,50,30,70,50,80,110,85,30,30,95,15,35,110,65,91,30,85,48,33,85,15,40,45,85,30,30,45,85,65,5,85,115,40,55,20,30,50,50,35,65,45,75,70,70,65,95,85,40,50,60,85,75,35,70,65,95,83,100,55,115,100,85,41,51,61,110,90,100,70,95,120,45,55,80,40,50,60,35,70,60,100,20,15,65,15,65,30,50,70,30,60,80,85,125,85,65,40,50,80,65,80,35,70,30,90,100,40,160,40,28,48,68,25,50,20,30,50,90,50,50,30,40,50,60,80,65,105,95,95,85,85,65,40,55,65,95,60,60,35,40,20,60,80,60,10,70,100,35,55,50,80,90,65,70,70,60,60,35,55,55,75,23,43,75,45,80,81,70,40,45,65,25,25,51,65,75,23,50,80,25,45,65,32,52,52,55,97,50,50,100,30,50,70,50,50,50,110,110,90,90,95,100,150,31,36,56,61,81,108,40,50,60,60,80,100,31,71,25,65,45,60,70,55,90,58,58,30,30,36,36,66,70,40,95,85,115,35,85,34,39,115,70,80,85,105,105,71,85,112,45,74,84,23,33,10,60,30,91,35,42,82,102,5,60,90,32,47,65,95,50,85,46,66,91,50,40,60,125,60,50,40,50,95,83,80,95,95,65,95,80,90,80,40,45,110,91,95,80,115,90,100,77,100,90,85,80,100,125,100,120,100,63,83,113,45,55,65,45,60,70,42,77,55,60,80,66,106,64,101,64,101,64,101,24,29,43,65,93,76,116,15,20,25,72,114,68,88,50,35,40,45,64,69,74,45,85,42,42,92,57,47,112,66,116,30,90,98,65,74,92,50,95,60,55,45,48,58,97,30,30,22,32,70,110,65,75,65,105,75,115,45,55,65,20,30,30,55,98,44,59,79,75,95,103,60,20,15,30,40,60,65,65,108,10,20,30,50,90,60,40,50,30,40,20,55,80,57,67,97,40,50,105,25,145,32,65,105,48,35,55,60,70,55,60,80,60,80,65,109,38,58,98,60,100,108,108,108,111,111,90,90,101,95,108,90,99,38,57,64,60,73,104,71,97,122,57,78,62,84,126,35,29,89,72,106,42,52,75,52,68,43,58,102,68,104,28,35,60,23,29,49,72,45,73,50,68,30,44,44,59,70,109,48,71,46,58,60,118,101,50,40,60,80,75,38,56,56,99,28,28,55,123,99,99,95,50,70,70,42,52,70,70,90,60,40,50,60,65,75,60,45,45,46,36,43,63,43,93,84,124,60,112,40,45,35,45,35,27,42,35,45,15,30,77,117,50,60,32,62,72,100,60,80,80,40,15,35,5,59,95,60,65,36,96,96,92,36,40,45,65,85,72,77,110,40,65,65,109,90,110,90,115,20,35,45,25,50,45,45,130,95,75,85,37,37,97,97,103,79,151,83,61,109,43,79,65,125,73,121,13,107,143,34,34,65,80,85,69,94,119,70,90,120,25,20,57,77,67,45,30,90,50,90,10,60,48,88,44,74,26,121,30,50,30,20,70,30,46,71,85,66,136,40,75,45,65,32,42,50,70,39,49,29,50,70,60,60,100,95,40,50,90,105,15,30,30,30,30,55,65,60,100,70,50,95,30,30,32,34,64,75,15,20,65,70,50,95,97,40,30,75,55,75,55,85,82,102,142,138,138,130,72,97,105,200,80,30,130,80,95,100,90,65,85,50,78,78,120,85,106,46,65,83,123,36,49,66,50,65,85,35,65,65,55,55,20,35,45,92,30,45,34,68,75,105,60,95,120,35,70,75,100,100,30,33,39,50,75,45,45,47,90,65,75,111,111,43,73,55,62,87,82,82,82,121,60,85,105,70,125,82,92,92,92,92,90,75,25,35,35,60,86,75,110,65,95,51,85,60,90,10,80,84,87,55,101,111,135,81,119,106,110,50,108,72,136,116,45,135,70,100,135,135,58,78,94,35,75,85,70,100,50,20,90];
function stat(p){
  console.log(pokemoN[p]);
  console.log(hp[p]);
  console.log(atk[p]);
  console.log(df[p]);
  console.log(spa[p]);
  console.log(sdf[p]);
  console.log(spd[p]);
}
function stats(poke){
  i=0;
  while ((' '+poke)!=pokemoN[i]){
    i+=1
  console.log(hp[i]);
  console.log(atk[i]);
  console.log(df[i]);
  console.log(spa[i]);
  console.log(sdf[i]);
  console.log(spd[i]);
  console.log(hp[i]+atk[i]+df[i]+spa[i]+sdf[i]+spd[i]);
  }
}
x=Math.floor(Math.random()*1071);
console.log(hp[x]);
console.log(atk[x]);
console.log(df[x]);
console.log(spa[x]);
console.log(sdf[x]);
console.log(spd[x]);
console.log(hp[x]+atk[x]+df[x]+spa[x]+sdf[x]+spd[x]);
gen=0;
function choosegen(){
  if (x<166){
    gen=1
  }
  else if (x<266){
    gen=2;
  }
  else if (x<401){
    gen=3;
  }  
  else if (x<509){
    gen=4;
  }  
  else if (x<664){
    gen=5;
  }  
  else if (x<736){
    gen=6;
  }
  else if (x<842){
    gen=7;
  }    
  else if ((841<x) && (x<958)){
      gen=8;
    }
  else{
    gen=9;
  }
}
choosegen()
console.log('Gen'+ ' '+(gen))
function hide(){
 document.getElementById("HealthBar").style.visibility="hidden"
document.getElementById("AttackBar").style.visibility= "hidden"
document.getElementById("DefenseBar").style.visibility="hidden"
document.getElementById("SpecialAttackBar").style.visibility="hidden"
document.getElementById("SDFBar").style.visibility="hidden"
 document.getElementById("SPDBar").style.visibility="hidden"
}
function newgame(){
  o=0
   document.getElementById("HealthBar").style.visibility= "visible"
document.getElementById("AttackBar").style.visibility="visible"
document.getElementById("DefenseBar").style.visibility="visible"
document.getElementById("SpecialAttackBar").style.visibility="visible"
document.getElementById("SDFBar").style.visibility="visible"
 document.getElementById("SPDBar").style.visibility="visible"
  document.getElementById("Answered").innerHTML=' '
  x=Math.floor(Math.random()*958)
  hp1=(hp[x]);
  atk1=(atk[x]);
  df1=(df[x]);
  spa1=(spa[x]);
  sdf1=(sdf[x]);
  spd1=(spd[x]);
  console.log(hp[x]+atk[x]+df[x]+spa[x]+sdf[x]+spd[x]);
  choosegen();
  if (document.getElementById("Generations").value !="all"){
    while (gen!=parseInt(document.getElementById("Generations").value)){
      x=Math.floor(Math.random()*1071)
      hp1=(hp[x]);
  atk1=(atk[x]);
  df1=(df[x]);
  spa1=(spa[x]);
  sdf1=(sdf[x]);
  spd1=(spd[x]);
  console.log(hp[x]+atk[x]+df[x]+spa[x]+sdf[x]+spd[x]);
  choosegen();
    }
  }
  if (document.getElementById("goodness").checked){
    while ((hp[x]+atk[x]+df[x]+spa[x]+sdf[x]+spd[x])<450){
      x=Math.floor(Math.random()*1071)
  hp1=(hp[x]);
  atk1=(atk[x]);
  df1=(df[x]);
  spa1=(spa[x]);
  sdf1=(sdf[x]);
  spd1=(spd[x]);
  console.log(hp[x]+atk[x]+df[x]+spa[x]+sdf[x]+spd[x]);
  choosegen();
  if (document.getElementById("Generations").value !="all"){
    while (gen!=parseInt(document.getElementById("Generations").value)){
      x=Math.floor(Math.random()*1071)
      hp1=(hp[x]);
  atk1=(atk[x]);
  df1=(df[x]);
  spa1=(spa[x]);
  sdf1=(sdf[x]);
  spd1=(spd[x]);
  console.log(hp[x]+atk[x]+df[x]+spa[x]+sdf[x]+spd[x]);
  choosegen();
    }
  }
    }
  }
  console.log('Gen'+ ' '+(gen));
 document.getElementById("Health").innerHTML ='HP:'+ ' '+hp1
  document.getElementById("HealthBar").style.width=(hp1*50/200)+"%"
  document.getElementById("Attack").innerHTML ='Attack:'+' ' +atk1
    document.getElementById("AttackBar").style.width=(atk1*50/200)+"%"
  document.getElementById("Defense").innerHTML ='Defense:'+ ' '+df1
      document.getElementById("DefenseBar").style.width=(df1*50/200)+"%"
  document.getElementById("SpecialAttack").innerHTML ='Special Attack:' +' '+spa1
      document.getElementById("SpecialAttackBar").style.width=(spa1*50/200)+"%"
  document.getElementById("SpecialDefense").innerHTML ='Special Defense:'+' '+sdf1
      document.getElementById("SDFBar").style.width=(sdf1*50/200)+"%"
  document.getElementById("Speed").innerHTML ='Speed:'+ ' '+spd1
      document.getElementById("SPDBar").style.width=(spd1*50/200)+"%"
  document.getElementById("Total").innerHTML='Total:'+ ' '+(hp1+atk1+spa1+df1+sdf1+spd1)
  document.getElementById("message").innerHTML=' '
  document.getElementById("Hinted").innerHTML=' '
  document.getElementById("GuessNumber").innerHTML=' '
  guesses=0
  
  
}

function guess(poke){
  guesses=guesses+1
  document.getElementById("GuessNumber").innerHTML ="Number of Guesses: " + guesses
  poke=poke.trim()
  poke=poke.toLowerCase();
  poke2=poke[0];
  poke2=poke2.toUpperCase();
  poke=poke.slice(1);
  poke=poke2+poke
  if ((' ')+poke==pokemoN[x]){
    document.getElementById("message").innerHTML='Correct! The Pokemon Was' + pokemoN[x] +'!';
    //newgame();
  }
  else{
    i=0;
    while ((pokemoN[i]!=((' ') + poke)) && (i<1073)){
      i+=1;
    }
    if (i<166){
      gen2=1;
    }
    if ((165<i) && (i<266)){
      gen2=2;
    }
    if ((265<i) && (i<401)){
      gen2=3;
    }  
    if ((400<i) && (i<509)){
      gen2=4;
    }  
    if ((508<i) && (i<664)){
      gen2=5;
    }  
    if ((663<i) && (i<736)){
      gen2=6;
    }
    if ((735<i) && (i<842)){
      gen2=7;
    }
    if ((841<i) && (i<958)){
      gen2=8;
    }
    if (957<i){
      gen2=9;
    }
    if (i===1073){
      gen2='Null';
    }
    choosegen()
    if (gen2==gen){     document.getElementById("message").innerHTML='Try Again...Same Generation';
  }
    if (gen2>gen){ document.getElementById("message").innerHTML='Try Again...Its from an older Generation';
               }
    if (gen2<gen){ document.getElementById("message").innerHTML='Try Again...Its from a newer Generation';
            }    
    if (gen2==='Null'){
      document.getElementById("message").innerHTML='Try Again...Check your spelling';
     
            }
 }

  document.getElementById("answer").value=''
}
t=('');
function hint(){
  t=('');
  t+=(pokemoN[x]);
  if (o==0){
  document.getElementById("Hinted").innerHTML='Hint: '  
  }
  document.getElementById("Hinted").innerHTML+= t[1+o]
  o+=1
}
function answer(){
  document.getElementById("Answered").innerHTML='Answer: '+pokemoN[x]
}
var input = document.getElementById("answer")
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
  guess(document.getElementById("answer").value)
}
})
