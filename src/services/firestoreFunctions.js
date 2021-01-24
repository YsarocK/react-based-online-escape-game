import firebase from '../firebase';

// FONCTION POUR ECRIRE DANS LA BDD
function firebaseWrite(field, value, roomID) {
    const db = firebase.firestore();
    var data = {};
    data[field] = value;
    db.collection('Room').doc(roomID).update(data);
}

// ASYNC FUNCTION TO UPDATE DATABASE
async function updateBatch(db, roomID, dataToBatch) {    
    const batch = db.batch();

    const sfRef = db.collection('Room').doc(roomID);
    sfRef.update(dataToBatch);

    await batch.commit();
}

// FONCTION DE CREATION D'UNE ROOM
function firebaseCreateRoom() {
    const db = firebase.firestore();
    const query = db.collection('Room').doc();
    query.set({
        tiroirObjects: ['lampetorche', 'loupe', 'briquet'],
        pitch: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        isReady: true,
        hasBegin: false,
        step: 0,
        message: "Il doit bien y avoir un moyen d'ouvrir les volets...",
        pressurebarIsAchieved: false,
        glitchStatue: false,
        robotMove: false,
        paperDiscovered: "undone",
        bureauLocked: false,
        garageOpened: false,
        gladys: "",
        intro: true,
        timeBeforeAlert: "",
        isHublotDiscovered: false,
        printerNoise: false,
        gladysMessagePassed: false,
        end: "",
        pressurebar : {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0
        },
        team : {
            name: '',
            score: 0,
            trophies : {
                t1 : {
                    id : 1,
                    active : false
                },
                t2 : {
                    id : 2,
                    active : false
                },
                t3 : {
                    id : 3,
                    active : false
                }
            },
        },
        player : {
            p1: {
                active : false,
                id : 1,
                pseudo : '',
                characterId : 0,
                score : 0,
                zone : "salon",
                holding : "",
                quest: "",
                garage: false,
            },
            p2: {
                active : false,
                id : 2,
                pseudo  :'',
                characterId : 0,
                score : 0,
                zone : "salon",
                holding : "",
                quest: "",
                garage: false,
            },
            p3: {
                active : false,
                id : 3,
                pseudo : '',
                characterId : 0,
                score : 0,
                zone : "salon",
                holding : "",
                quest: "",
                garage: false,
            },
            p4: {
                active : false,
                id : 4,
                pseudo : '',
                characterId : 0,
                score : 0,
                zone : "salon",
                holding : "",
                quest: "",
                garage: false,
            },
        },
        cursors: {
            isAchieved: false,
            values: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            },
            validationArray: ["#D2307C", "#FAEC4F", "#D22E26", "#4AA19C", "#419149"],
            colorScheme: ["#D2307C", "#FAEC4F", "#4AA19C", "#B33CEA", "#D22E26", "#4AA19C", "#FF8A00", "#419149", "#37B704", "black"],
            colorAngles: [36, 72, 108, 144, 180, 216, 252, 288, 324, 360]
        },
        quests : {
            begin: {
                name: "Pour bien commencer",
                state: false,
                description: "Découverte des lieux",

            },
            tablet: {
                name: "Roulez volets",
                state: false,
                description: "Vous avez essayé d'ouvrir les volets, sans succés..."
            },
            cursors: {
                name: "Tous ensemble",
                state: false,
                description: "Le bureau s'est ouvert"
            },
            puzzle: {
                name: "Vous avez un message",
                state: false,
                description: "Reconstituer l'image"
            },
            scratch: {
                name: "Des givrés",
                state: false,
                description: "Dégivrer le hublot"
            },
            compteur: {
                name: 'La tension est à son comble',
                state: false,
                description: "Mettre la tension au maximum"
            }
        },
        itemsActive : {
            i1 : 0,
            i2 : 0,
            i3 : 0,
            i4 : 0
        },
        houseSettings : {
            rooms : {
                salon: {
                    objects: [],
                    isLocked: false,
                },
                sdb : {
                    objects: [],
                    isLocked: false,
                },
            },
            glitch : {
                isAchieved : false,
                p1 : false,
                p2 : false,
                p3 : false,
                p4 : false,
            },
            lights : {
                isActive : false
            },
            airConditioning : {
                isActive : false
            },
            roomLocked : {
                canTrap : false,
                locked : false,
                characterLocked : 0
            },
            vacuum : {
                roomId : 2,
                gavePuzzle : false
            },
            timer : {
                isActive: false,
                // Add date --> startTimer: '',
            },
        },
        inventory : [],
        paperInventory : [],
        rooms: {
            cuisine : {
                isLocked: false,
                objects : ['couteau', 'bouteille', 'rouleauapatisserie', 'ciseaux', 'tiroir'],
            },
            salon : {
                isLocked: false,
                objects : ['soclerobot', 'television', 'coussin', 'couverture', 'googlehome', 'papier2', 'boitierelec'],
            },
            celier : {
                isLocked: false,
                objects :['bouteilledevin', 'conserves', 'balais', 'papier3'],
            },
            garage : {
                isLocked:false,
                objects: ['carton'],
                discovered: {
                    tournevis: false,
                    chalumeau: false,
                    compteur: false,
                    grattegratte: false,
                }
            },
            chambre1 : {
                isLocked:false,
                objects: ['romanpolicier', 'chaise', 'bureau', 'armoire', 'papier4']
            },
            wc1 : {
                isLocked:false,
                objects: ['pq', 'brossetoilette', 'cremepourlesmains', 'papier6']
            },
            sdb1 : {
                isLocked:false,
                objects: ['serviettedetoilette', 'geldouche', 'dentifrice', 'brosseadent', 'papier7']
            },
            bureau : {
                isLocked:false,
                objects: ['corbeille', 'robot', 'ampoules', 'tableau', 'imprimante', 'papier8', 'porte']
            },
            sdb2 : {
                isLocked:false,
                objects: ['geldouche', 'serviettedetoilette', 'papier9']
            },
            chambre3 : {
                isLocked:false,
                objects: ['tablette', 'sac', 'stylo', 'classeur', 'papier10']
            },
            wc2 : {
                isLocked:false,
                objects: ['brossetoilette', 'cremepourlesmains', 'papier11']
            },
            terrasse : {
                isLocked:false,
                objects: ['papier1']
            },
            balcon : {
                isLocked:false,
                objects: ['papier5']
            },
            couloir : {
                isLocked:false,
                objects: ['hublot', 'battedebaseball', 'clé', 'ampoule']
            },
            chambre2 : {
                isLocked:false,
                objects: ['tapis', 'commode', 'lampedechevet', 'papier12', 'cadre']
            }
        }
    });
    var roomID = query.id;
    return roomID;
}

export default {
    firebaseWrite,
    firebaseCreateRoom,
    updateBatch,
}